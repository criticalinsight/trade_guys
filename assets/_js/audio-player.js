import * as SoundCloudAudio from 'soundcloud-audio'

let scPlayers = []

const init = (URL, player) => {
  let lengthDisplay = player.querySelector('.duration')

  let scPlayer = new SoundCloudAudio('e1b9039f824fdaf6ec1fc594037c1ac7')
  scPlayer.resolve(URL, function(track) {
    let minutes = millisToMinutesAndSeconds(track.duration)
    lengthDisplay.textContent = minutes
  })
  scPlayers.push(scPlayer)
}

const millisToMinutesAndSeconds = millis => {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

const progressBar = (progressDisplay, i) => {
  setInterval(() => {
    let progressPercent =
      (scPlayers[i].audio.currentTime / scPlayers[i].audio.duration) * 100
    progressDisplay.style.width = `${progressPercent}%`
  }, 300)
}

const addSeeker = (player, progressDisplay, i) => {
  player.querySelector('.progress-bar').addEventListener('click', e => {
    let progressBarWidth = player.querySelector('.progress-bar').offsetWidth
    let progressMillis =
      (e.offsetX / progressBarWidth) * scPlayers[i].audio.duration
    scPlayers[i].audio.currentTime = progressMillis
    progressBar(progressDisplay, i)
  })
}

const pauseString = 'pause'
const listenString = 'listen'
const loadingString = 'loading'

const toggleStatus = player => {
  let action = player.querySelector('.action')
  action.classList.toggle('pause')
  action.classList.toggle('listen')
  let pause = player.querySelector('.pause')
  let listen = player.querySelector('.listen')
  if (pause) {
    pause.querySelector('.action-label').innerText = pauseString
    pause.setAttribute('aria-label', 'Pause the podcast')
  }
  if (listen) {
    listen.querySelector('.action-label').innerText = listenString
    listen.setAttribute('aria-label', 'Listen to the podcast')
  }

  let control = player.querySelector('.audio-control i')
  control.classList.toggle('icon-pause')
  control.classList.toggle('icon-play')
}

export default function AudioPlayer() {
  let audioPlayers = document.querySelectorAll('.audio-player')
  if (!audioPlayers) {
    return
  }

  audioPlayers.forEach((player, i) => {
    let listen = player.querySelector('.listen') || {}
    listen.querySelector('.action-label').innerText = listenString

    let URL = player.querySelector('.audio-control').dataset.url
    init(URL, player)

    player.querySelector('.menu').addEventListener('click', () => {
      player.querySelector('.transcript').classList.toggle('show-transcript')
    })

    player.querySelectorAll('.action').forEach(element => {
      let progressDisplay = player.querySelector('.progress')
      element.addEventListener('click', () => {
        addSeeker(player, progressDisplay, i)
        if (scPlayers[i] && scPlayers[i].playing) {
          scPlayers[i].pause()
          toggleStatus(player)
        } else if (scPlayers[i] && !scPlayers[i].playing) {
          scPlayers[i].play()
          if (scPlayers[i].audio.currentTime === 0) {
            listen.querySelector('.action-label').innerText = loadingString
            setTimeout(() => toggleStatus(player), 1500)
          } else {
            toggleStatus(player)
          }
          progressBar(progressDisplay, i)
        }
      })
    })
  })
}
