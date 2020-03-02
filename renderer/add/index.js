const { ipcRenderer } = require('electron')
const path = require('path')
const { $ } = require('../../util/index')
let filePaths = []

function renderHtml (paths) {
  const dom = $('#list')
  const lisHtml = paths.reduce((str, p) => {
    return str += ` <li class="list-group-item">${path.basename(p)}</li>`
  }, '')
  const ulHtml = `<ul class="list-group btn-block mt-2">${lisHtml}</ul>`
  console.log(ulHtml)
  dom.innerHTML = ulHtml
}

$('#select-music-button').addEventListener('click', () => {
  ipcRenderer.send('open-music-file')

  ipcRenderer.on('selected-file', (e, paths) => {
    if (Array.isArray(paths)) {
      filePaths = paths
      renderHtml(paths)
    }
  })
})

$('#add-music-button').addEventListener('click', () => {
  ipcRenderer.send('add-tracks', filePaths)
})
