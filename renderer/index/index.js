const { ipcRenderer } = require('electron')
const { $ } = require('../../util/index')

$('#add-music-button').addEventListener('click', () => {
  ipcRenderer.send('add-music-window', 'hello')
})
