const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const DataStore = require('./util/store')
const store = new DataStore({
  name: 'music-data'
})

class AppWindow extends BrowserWindow {
  constructor (config, filePath) {
    const baseConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      },
      show: false
    }
    const finalConfig = { ...baseConfig, ...config }
    super(finalConfig)
    this.loadFile(filePath)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index/index.html')
  let addWindow

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('get-tracks', store.getTracks())
  })

  ipcMain.on('add-music-window', () => {
    addWindow = new AppWindow({
      width: 500,
      height: 400
      // parent: mainWindow
    }, './renderer/add/index.html')
  })

  ipcMain.on('open-music-file', (e) => {
    const options = {
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Music',
          extends: ['mp3']
        }
      ]
    }

    dialog.showOpenDialog(options).then((files) => {
      const filePaths = files.filePaths
      if (filePaths.length) {
        e.reply('selected-file', filePaths)
      }
    })
  })

  ipcMain.on('add-tracks', (e, tracks) => {
    const currentTracks = store.addTracks(tracks).getTracks()
    addWindow.close()
    mainWindow.webContents.send('get-tracks', currentTracks)
  })

  ipcMain.on('delete-track', (e, trackId) => {
    const currentTracks = store.delTrack(trackId).getTracks()
    mainWindow.webContents.send('get-tracks', currentTracks)
  })
})
