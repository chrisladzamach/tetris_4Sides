import { BOARD_WIDTH, BOARD_HEIGHT, COLORS } from '../config/constants.js'

export class GameUI {
  constructor (canvas, scoreElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.scoreElement = scoreElement
    this.blockSize = 0

    this.resizeCanvas()
    window.addEventListener('resize', () => {
      this.resizeCanvas()
    })
  }

  resizeCanvas () {
    const availableWidth = window.innerWidth
    const availableHeight = window.innerHeight

    const blockWidth = availableWidth / BOARD_WIDTH
    const blockHeight = availableHeight / BOARD_HEIGHT

    this.blockSize = Math.min(blockWidth, blockHeight)

    this.canvas.width = this.blockSize * BOARD_WIDTH
    this.canvas.height = this.blockSize * BOARD_HEIGHT

    this.ctx.setTransform(this.blockSize, 0, 0, this.blockSize, 0, 0)
  }

  draw (board, piece) {
    // Draw background
    this.ctx.fillStyle = COLORS.BACKGROUND
    this.ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT)

    // Draw board blocks
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board.grid[y][x] === 1) {
          this.ctx.fillStyle = COLORS.BOARD_BLOCK
          this.ctx.fillRect(x, y, 1, 1)
        }
      }
    }

    // Draw current piece
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          this.ctx.fillStyle = COLORS.PIECE
          this.ctx.fillRect(piece.pos.x + x, piece.pos.y + y, 1, 1)
        }
      }
    }
  }

  updateScore (score) {
    if (this.scoreElement) {
      this.scoreElement.innerText = String(score)
    }
  }
}
