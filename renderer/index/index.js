const { ipcRenderer } = require('electron')
const { $ } = require('../../util/index')
const musicAudio = new Audio()
let allTracks = []
let currentTrack = null

function renderHtml (arr) {
  const dom = $('#list')
  const lisHtml = arr.reduce((str, item) => {
    const newStr = str + `
      <li class="row list-group-item d-flex justify-content-between align-items-center">
        <div class="col-1">
          <i class="fas fa-music text-secondary"></i>
        </div>
        <div class="col-9">${item.fileName}</div>
        <div class="col-1">
          <i class="fas fa-play" data-id="${item.id}"></i>
        </div>
        <div class="col-1">
          <i class="fas fa-trash-alt" data-id="${item.id}"></i>
        </div>
      </li>
    `
    return newStr
  }, '')
  const ulHtml = `<ul class="list-group btn-block mt-2 mb-4">${lisHtml}</ul>`
  dom.innerHTML = ulHtml
}

$('#add-music-button').addEventListener('click', () => {
  ipcRenderer.send('add-music-window', 'hello')
})

ipcRenderer.on('get-tracks', (e, tracks) => {
  allTracks = tracks
  renderHtml(tracks)
})

$('#list').addEventListener('click', (e) => {
  e.preventDefault()
  const { dataset, classList } = e.target
  const id = dataset && dataset.id
  const play = classList.contains('fa-play')
  const pause = classList.contains('fa-pause')
  const del = classList.contains('fa-trash-alt')

  // 播放：
  // 1 点击的是播放按钮
  if (id && play) {
    // 1.1 音乐点击暂停后再次点击播放
    // 1.1.1 如果是同一首歌
    if (currentTrack && currentTrack.id === id) {
      musicAudio.play()
    } else {
      // 1.1.2 如果不是同一首歌
      currentTrack = allTracks.find(track => track.id === id)
      musicAudio.src = currentTrack.path
      musicAudio.play()
      const resetElement = document.querySelector('.fa-pause')
      if (resetElement) {
        resetElement.classList.replace('fa-pause', 'fa-play')
      }
    }
    classList.replace('fa-play', 'fa-pause')
  }

  // 2 点击的是暂停按钮
  if (id && pause) {
    musicAudio.pause()
    classList.replace('fa-pause', 'fa-play')
  }

  // 3 点击的是删除按钮
  if (id && del) {
    ipcRenderer.send('delete-track', id)
  }
})
