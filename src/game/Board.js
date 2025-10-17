import { BOARD_WIDTH, BOARD_HEIGHT } from '../config/constants.js'
import { createMatrix, randomInt } from '../utils/helpers.js'

export class Board {
  constructor () {
    this.grid = createMatrix(BOARD_HEIGHT, BOARD_WIDTH, 0)
    this.score = 0
  }

  reset () {
    this.grid = createMatrix(BOARD_HEIGHT, BOARD_WIDTH, 0)
    this.score = 0
  }

  checkCollision (piece, posX = piece.pos.x, posY = piece.pos.y, shape = piece.shape) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue

        const boardY = posY + y
        const boardX = posX + x

        if (boardY < 0 || boardY >= BOARD_HEIGHT ||
            boardX < 0 || boardX >= BOARD_WIDTH) {
          return true
        }

        if (this.grid[boardY][boardX] !== 0) {
          return true
        }
      }
    }
    return false
  }

  solidifyPiece (piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const by = piece.pos.y + y
          const bx = piece.pos.x + x

          if (by >= 0 && by < BOARD_HEIGHT &&
              bx >= 0 && bx < BOARD_WIDTH) {
            this.grid[by][bx] = 1
          }
        }
      }
    }
  }

  removeFullLines () {
    let totalRemoved = 0

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (this.grid[y].every(v => v === 1)) {
        totalRemoved += BOARD_WIDTH
        this.grid.splice(y, 1)
        this.grid.unshift(Array(BOARD_WIDTH).fill(0))
        y--
      }
    }

    for (let x = 0; x < BOARD_WIDTH; x++) {
      let full = true
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (this.grid[y][x] === 0) {
          full = false
          break
        }
      }

      if (full) {
        totalRemoved += BOARD_HEIGHT
        for (let y = 0; y < BOARD_HEIGHT; y++) {
          this.grid[y].splice(x, 1)
          this.grid[y].push(0)
        }
        x--
      }
    }

    this.score += totalRemoved
    return totalRemoved
  }

  spawnSegmentsAtBorder (direction, attempts = 5) {
    for (let i = 0; i < attempts; i++) {
      if (direction === 'left' || direction === 'right') {
        const col = direction === 'left' ? 0 : BOARD_WIDTH - 1
        const maxLen = 6
        const len = randomInt(1, Math.min(maxLen, BOARD_HEIGHT - 1))
        const start = randomInt(0, BOARD_HEIGHT - len)

        let canPlace = true
        for (let y = start; y < start + len; y++) {
          if (this.grid[y][col] === 1) {
            canPlace = false
            break
          }
        }
        if (!canPlace) continue

        let onesCount = 0
        for (let y = 0; y < BOARD_HEIGHT; y++) {
          if (this.grid[y][col] === 1) onesCount++
        }
        if (onesCount + len >= BOARD_HEIGHT) continue

        for (let y = start; y < start + len; y++) {
          this.grid[y][col] = 1
        }
      } else {
        const row = direction === 'top' ? 0 : BOARD_HEIGHT - 1
        const maxLen = 8
        const len = randomInt(1, Math.min(maxLen, BOARD_WIDTH - 1))
        const start = randomInt(0, BOARD_WIDTH - len)

        let canPlace = true
        for (let x = start; x < start + len; x++) {
          if (this.grid[row][x] === 1) {
            canPlace = false
            break
          }
        }
        if (!canPlace) continue

        const onesCount = this.grid[row].reduce((s, v) => s + (v === 1 ? 1 : 0), 0)
        if (onesCount + len >= BOARD_WIDTH) continue

        for (let x = start; x < start + len; x++) {
          this.grid[row][x] = 1
        }
      }
    }
  }
}
