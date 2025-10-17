export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const createMatrix = (rows, cols, fill = 0) => Array.from({ length: rows }, () => Array(cols).fill(fill))

export const cloneMatrix = (matrix) => matrix.map(row => row.slice())

export const rotateMatrix = (matrix) => {
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
