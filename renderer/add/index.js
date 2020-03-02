const { ipcRenderer } = require('electron')
const path = require('path')
const { $ } = require('../../util/index')

function renderHtml (paths) {
  const dom = $('#list')
  const lisHtml = paths.reduce((str, p) => {
    str += ` <li class="list-group-item">${path.basename(p)}</li>`
  }, '')
  const ulHtml = `<ul class="list-group">${lisHtml}</ul>`
  dom.innerHTML = ulHtml
}

$('#select-music-button').addEventListener('click', () => {
  ipcRenderer.send('open-music-file')

  ipcRenderer.on('selected-file', (e, paths) => {
    console.log(paths)
    if (Array.isArray(paths)) {
      renderHtml(paths)
    }
  })
})
