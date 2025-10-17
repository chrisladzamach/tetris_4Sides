import { PIECES, BOARD_WIDTH, BOARD_HEIGHT } from '../config/constants.js'
import { cloneMatrix } from '../utils/helpers.js'

export class Piece {
  constructor () {
    this.pos = { x: 0, y: 0 }
    this.shape = null
    this.type = null
  }

  setRandom () {
    const keys = Object.keys(PIECES)
    this.type = keys[Math.floor(Math.random() * keys.length)]
    this.shape = cloneMatrix(PIECES[this.type])
  }

  centerOnBoard () {
    const cols = this.shape[0].length
    const rows = this.shape.length
    this.pos.x = Math.floor((BOARD_WIDTH - cols) / 2)
    this.pos.y = Math.floor((BOARD_HEIGHT - rows) / 2)
  }

  rotate () {
    const rows = this.shape.length
    const cols = this.shape[0].length
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0))

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        rotated[x][rows - 1 - y] = this.shape[y][x]
      }
    }

    return rotated
  }
}
