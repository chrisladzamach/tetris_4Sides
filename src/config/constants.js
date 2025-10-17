export const BOARD_WIDTH = 60
export const BOARD_HEIGHT = 32

export const PIECES = {
  O: [
    [1, 1],
    [1, 1]
  ],
  I: [
    [1, 1, 1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ]
}

export const PIECE_COLORS = {
  O: '#FFFF00',
  I: '#00FFFF',
  T: '#800080',
  S: '#00FF00',
  Z: '#FF0000',
  J: '#0000FF',
  L: '#FF7F0F'
}

export const COLORS = {
  BACKGROUND: '#000',
  BOARD_BLOCK: '#333',
  PIECE: '#6c00abff'
}

export const GAME_CONFIG = {
  BORDER_SPAWN_INTERVAL: 2200,
  AUDIO_VOLUME: 0.3
  // AUDIO_PLAYBACK_RATE: 0.7
}
