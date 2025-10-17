import { GAME_CONFIG } from '../config/constants.js'

export class AudioManager {
  constructor () {
    this.gameAudio = null
  }

  start () {
    if (!this.gameAudio) {
      this.gameAudio = new globalThis.Audio('./tetris.mp3')
      this.gameAudio.volume = GAME_CONFIG.AUDIO_VOLUME
      // this.gameAudio.playbackRate = GAME_CONFIG.AUDIO_PLAYBACK_RATE
      this.gameAudio.loop = true
      this.gameAudio.play()
    }
  }

  stop () {
    if (this.gameAudio) {
      this.gameAudio.pause()
      this.gameAudio.currentTime = 0
      this.gameAudio = null
    }
  }
}
