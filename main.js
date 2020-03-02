const { app, BrowserWindow, ipcMain, dialog } = require('electron')

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
  mainWindow.webContents.openDevTools()

  ipcMain.on('add-music-window', () => {
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, './renderer/add/index.html')
    addWindow.webContents.openDevTools()
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
})
