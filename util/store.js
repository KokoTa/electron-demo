const Store = require('electron-store')
const uuidv4 = require('uuid/v4')
const path = require('path')

class DataStore extends Store {

  constructor(setting) {
    super(setting)
    this.tracks = this.get('tracks') || []
  }

  saveTracks() {
    this.set('tracks', this.tracks)
    return this
  }

  getTracks() {
    return this.get('tracks') || []
  }

  addTracks(tracks) {
    const newTracks = tracks.map((track) => {
      return {
        id: uuidv4(),
        path: track,
        fileName: path.basename(track)
      }
    }).filter((track) => {
      const currentTracks = this.getTracks().map((item) => item.path)
      return currentTracks.indexOf(track.path) < 0
    })

    this.tracks = [...this.tracks, ...newTracks]
    return this.saveTracks()
  }
}

module.exports = DataStore
