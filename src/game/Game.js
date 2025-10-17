import { GAME_CONFIG } from '../config/constants.js'
import { randomInt } from '../utils/helpers.js'
import { Board } from './board.js'
import { Piece } from './Piece.js'
import { AudioManager } from './AudioManager.js'

export class Game {
  constructor (ui) {
    this.ui = ui
    this.board = new Board()
    this.piece = new Piece()
    this.audioManager = new AudioManager()
    this.borderSpawnInterval = null
    this.animationFrameId = null
  }

  start () {
    this.board.reset()
    this.spawnNewPiece()
    this.startBorderSpawner()
    this.audioManager.start()
    this.ui.updateScore(this.board.score)
    this.startGameLoop()
    this.setupControls()
  }

  startGameLoop () {
    const loop = () => {
      this.ui.draw(this.board, this.piece)
      this.animationFrameId = window.requestAnimationFrame(loop)
    }
    loop()
  }

  spawnNewPiece () {
    this.piece.setRandom()
    this.piece.centerOnBoard()

    if (this.board.checkCollision(this.piece)) {
      this.gameOver()
    }
  }

  gameOver () {
    window.alert('Game over! (se reinicia tablero)')
    this.stop()
    this.start()
  }

  stop () {
    this.audioManager.stop()
    if (this.borderSpawnInterval) {
      clearInterval(this.borderSpawnInterval)
      this.borderSpawnInterval = null
    }
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  startBorderSpawner () {
    if (this.borderSpawnInterval) {
      clearInterval(this.borderSpawnInterval)
    }

    this.borderSpawnInterval = setInterval(() => {
      const directions = ['left', 'right', 'top', 'bottom']
      const direction = directions[Math.floor(Math.random() * directions.length)]
      this.board.spawnSegmentsAtBorder(direction, randomInt(1, 3))
      this.board.removeFullLines()
      this.ui.updateScore(this.board.score)
    }, GAME_CONFIG.BORDER_SPAWN_INTERVAL)
  }

  handleMove (direction) {
    const prev = { x: this.piece.pos.x, y: this.piece.pos.y }

    switch (direction) {
      case 'left':
        this.piece.pos.x--
        if (this.board.checkCollision(this.piece)) {
          this.piece.pos.x = prev.x
          this.solidifyAndSpawn('left')
        }
        break
      case 'right':
        this.piece.pos.x++
        if (this.board.checkCollision(this.piece)) {
          this.piece.pos.x = prev.x
          this.solidifyAndSpawn('right')
        }
        break
      case 'down':
        this.piece.pos.y++
        if (this.board.checkCollision(this.piece)) {
          this.piece.pos.y = prev.y
          this.solidifyAndSpawn('bottom')
        }
        break
      case 'up':
        this.piece.pos.y--
        if (this.board.checkCollision(this.piece)) {
          this.piece.pos.y = prev.y
          this.solidifyAndSpawn('top')
        }
        break
    }

    this.ui.draw(this.board, this.piece)
  }

  handleRotate () {
    const rotated = this.piece.rotate()

    if (!this.board.checkCollision(this.piece, this.piece.pos.x, this.piece.pos.y, rotated)) {
      this.piece.shape = rotated
    } else if (!this.board.checkCollision(this.piece, this.piece.pos.x - 1, this.piece.pos.y, rotated)) {
      this.piece.pos.x -= 1
      this.piece.shape = rotated
    } else if (!this.board.checkCollision(this.piece, this.piece.pos.x + 1, this.piece.pos.y, rotated)) {
      this.piece.pos.x += 1
      this.piece.shape = rotated
    }

    this.ui.draw(this.board, this.piece)
  }

  solidifyAndSpawn (borderDirection) {
    this.board.solidifyPiece(this.piece)
    this.board.spawnSegmentsAtBorder(borderDirection, 2)
    this.board.removeFullLines()
    this.ui.updateScore(this.board.score)
    this.spawnNewPiece()
  }

  setupControls () {
    document.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowLeft':
          this.handleMove('left')
          break
        case 'ArrowRight':
          this.handleMove('right')
          break
        case 'ArrowDown':
          this.handleMove('down')
          break
        case 'ArrowUp':
          this.handleMove('up')
          break
        case ' ':
          this.handleRotate()
          break
      }
    })
  }
}
