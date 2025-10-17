import './style.css'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scoreEl = document.querySelector('span')

const BOARD_WIDTH = 60
const BOARD_HEIGHT = 32

let BOARD
let BLOCK_SIZE

let score = 0

const PIECES = {
  O: [
    [1,1],
    [1,1]
  ],
  I: [
    [1,1,1,1]
  ],
  T: [
    [0,1,0],
    [1,1,1]
  ],
  S: [
    [0,1,1],
    [1,1,0]
  ],
  Z: [
    [1,1,0],
    [0,1,1]
  ],
  J: [
    [1,0,0],
    [1,1,1]
  ],
  L: [
    [0,0,1],
    [1,1,1]
  ]
}

const piece = {
  pos: { x: 0, y: 0 },
  shape: null,
  type: null
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function createMatrix(rows, cols, fill = 0) {
  return Array.from({ length: rows }, () => Array(cols).fill(fill))
}

function cloneMatrix(m) {
  return m.map(row => row.slice())
}

function rotateMatrix(matrix) {
  const rows = matrix.length
  const cols = matrix[0].length
  const res = createMatrix(cols, rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      res[x][rows - 1 - y] = matrix[y][x]
    }
  }
  return res
}

function randomPiece() {
  const keys = Object.keys(PIECES)
  const type = keys[Math.floor(Math.random() * keys.length)]
  return { type, shape: cloneMatrix(PIECES[type]) }
}

function centerPieceOnBoard() {
  const w = piece.shape[0].length ? piece.shape[0].length : piece.shape[0].length
  const cols = piece.shape[0].length
  const rows = piece.shape.length
  piece.pos.x = Math.floor((BOARD_WIDTH - cols) / 2)
  piece.pos.y = Math.floor((BOARD_HEIGHT - rows) / 2)
}

function resizeCanvasAndScale() {
  const availableWidth = window.innerWidth
  const availableHeight = window.innerHeight

  const blockWidth = availableWidth / BOARD_WIDTH
  const blockHeight = availableHeight / BOARD_HEIGHT

  BLOCK_SIZE = Math.min(blockWidth, blockHeight)

  canvas.width = BLOCK_SIZE * BOARD_WIDTH
  canvas.height = BLOCK_SIZE * BOARD_HEIGHT

  ctx.setTransform(BLOCK_SIZE, 0, 0, BLOCK_SIZE, 0, 0)
}


window.addEventListener('resize', () => {
  resizeCanvasAndScale()
  draw()
})

function checkCollisionAt(posX = piece.pos.x, posY = piece.pos.y, shape = piece.shape) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue
      const boardY = posY + y
      const boardX = posX + x
      if (boardY < 0 || boardY >= BOARD_HEIGHT || boardX < 0 || boardX >= BOARD_WIDTH) return true
      if (BOARD[boardY][boardX] !== 0) return true
    }
  }
  return false
}

function solidifyPiece() {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const by = piece.pos.y + y
        const bx = piece.pos.x + x
        if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
          BOARD[by][bx] = 1
        }
      }
    }
  }
  removeFullLinesIfAny()
  spawnNewPieceCentered()
}

let gameAudio = null;

function startGameAudio() {
  if (!gameAudio) {
    gameAudio = new Audio("./tetris.mp3");
    gameAudio.volume = 0.3;
    gameAudio.playbackRate = 0.7;
    gameAudio.loop = true;
    gameAudio.play();
  }
}

function stopGameAudio() {
  if (gameAudio) {
    gameAudio.pause();
    gameAudio.currentTime = 0;
    gameAudio = null;
  }
}

function spawnNewPieceCentered() {
  const p = randomPiece()
  piece.type = p.type
  piece.shape = p.shape
  centerPieceOnBoard()
  if (checkCollisionAt()) {
    alert('Game over! (se reinicia tablero)')
    BOARD = createMatrix(BOARD_HEIGHT, BOARD_WIDTH, 0)
    score = 0
    updateScore()
    stopGameAudio()
  }
}

function removeFullLinesIfAny() {
  let totalRemoved = 0;

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (BOARD[y].every(v => v === 1)) {
      totalRemoved += BOARD_WIDTH;
      BOARD.splice(y, 1);
      BOARD.unshift(Array(BOARD_WIDTH).fill(0));
      y--;
    }
  }

  for (let x = 0; x < BOARD_WIDTH; x++) {
    let full = true;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (BOARD[y][x] === 0) { full = false; break; }
    }

    if (full) {
      totalRemoved += BOARD_HEIGHT;
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        BOARD[y].splice(x, 1);
        BOARD[y].push(0);
      }
      
      x--;
    }
  }

  score += totalRemoved;
  updateScore();
}


function updateScore() {
  if (scoreEl) scoreEl.innerText = String(score)
}

function spawnSegmentsAtBorder(dir, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    if (dir === 'left' || dir === 'right') {
      const col = dir === 'left' ? 0 : BOARD_WIDTH - 1
      const maxLen = 6
      const len = randomInt(1, Math.min(maxLen, BOARD_HEIGHT - 1))
      const start = randomInt(0, BOARD_HEIGHT - len)
      
      let canPlace = true
      for (let y = start; y < start + len; y++) {
        if (BOARD[y][col] === 1) { canPlace = false; break }
      }
      if (!canPlace) continue

      let onesCount = 0
      for (let y = 0; y < BOARD_HEIGHT; y++) if (BOARD[y][col] === 1) onesCount++
      if (onesCount + len >= BOARD_HEIGHT) continue

      for (let y = start; y < start + len; y++) BOARD[y][col] = 1

    } else {
      const row = dir === 'top' ? 0 : BOARD_HEIGHT - 1
      const maxLen = 8
      const len = randomInt(1, Math.min(maxLen, BOARD_WIDTH - 1))
      const start = randomInt(0, BOARD_WIDTH - len)
      
      let canPlace = true
      for (let x = start; x < start + len; x++) {
        if (BOARD[row][x] === 1) { canPlace = false; break }
      }

      if (!canPlace) continue

      let onesCount = BOARD[row].reduce((s, v) => s + (v === 1 ? 1 : 0), 0)
      if (onesCount + len >= BOARD_WIDTH) continue

      for (let x = start; x < start + len; x++) BOARD[row][x] = 1
    }
  }
  removeFullLinesIfAny()
}

let borderSpawnInterval = null
function startBorderSpawner(ms = 1000) {
  if (borderSpawnInterval) clearInterval(borderSpawnInterval)
  borderSpawnInterval = setInterval(() => {
    const dirs = ['left', 'right', 'top', 'bottom']
    const dir = dirs[Math.floor(Math.random() * dirs.length)]
    spawnSegmentsAtBorder(dir, randomInt(1, 3))
  }, ms)
}

function drawGrid() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT)

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (BOARD[y][x] === 1) {
        ctx.fillStyle = '#333'
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        ctx.fillStyle = '#6c00abff'
        ctx.fillRect(piece.pos.x + x, piece.pos.y + y, 1, 1)
      }
    }
  }
}

function draw() { drawGrid() }

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault()

  const prev = { x: piece.pos.x, y: piece.pos.y, shape: piece.shape }

  if (e.key === 'ArrowLeft') {
    piece.pos.x--
    if (checkCollisionAt()) {
      piece.pos.x = prev.x
      solidifyPiece()
      spawnSegmentsAtBorder('left', 2)
    }
  } else if (e.key === 'ArrowRight') {
    piece.pos.x++
    if (checkCollisionAt()) {
      piece.pos.x = prev.x
      solidifyPiece()
      spawnSegmentsAtBorder('right', 2)
    }
  } else if (e.key === 'ArrowDown') {
    piece.pos.y++
    if (checkCollisionAt()) {
      piece.pos.y = prev.y
      solidifyPiece()
      spawnSegmentsAtBorder('bottom', 2)
    }
  } else if (e.key === 'ArrowUp') {
    piece.pos.y--
    if (checkCollisionAt()) {
      piece.pos.y = prev.y
      solidifyPiece()
      spawnSegmentsAtBorder('top', 2)
    }
  } else if (e.code === 'Space') {
    const rotated = rotateMatrix(piece.shape)

    if (!checkCollisionAt(piece.pos.x, piece.pos.y, rotated)) {
      piece.shape = rotated
    } else if (!checkCollisionAt(piece.pos.x - 1, piece.pos.y, rotated)) {
      piece.pos.x -= 1
      piece.shape = rotated
    } else if (!checkCollisionAt(piece.pos.x + 1, piece.pos.y, rotated)) {
      piece.pos.x += 1
      piece.shape = rotated
    } else {}
  }

  draw()
})

function init() {
  resizeCanvasAndScale()
  BOARD = createMatrix(BOARD_HEIGHT, BOARD_WIDTH, 0)

  score = 0

  updateScore()
  spawnNewPieceCentered()
  startBorderSpawner(2200)
  function raf() {
    draw()
    requestAnimationFrame(raf)
  }
  raf()
}

const $section = document.querySelector('section')
$section.addEventListener('click', () =>{
  init()
  $section.remove()
    startGameAudio()
})
