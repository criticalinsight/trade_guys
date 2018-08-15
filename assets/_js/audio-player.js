import * as SoundCloudAudio from 'soundcloud-audio'

let scPlayers = []

const init = (URL, lengthDisplay) => {
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

export default function AudioPlayer() {
  let audioPlayers = document.querySelectorAll('.audio-player')

  if (!audioPlayers) {
    return
  }

  audioPlayers.forEach(player => {
    let URL = player.querySelector('.audio-control').dataset.url
    let lengthDisplay = player.querySelector('.duration')
    init(URL, lengthDisplay)
  })

  audioPlayers.forEach((player, i) => {
    player.querySelectorAll('.audio-control i, .action').forEach(element => {
      let progressDisplay = player.querySelector('.progress')
      element.addEventListener('click', () => {
        let control = player.querySelector('.audio-control i')
        control.classList.toggle('icon-pause')
        control.classList.toggle('icon-play')

        let action = player.querySelector('.action')
        action.textContent === 'listen'
          ? (action.textContent = 'pause')
          : (action.textContent = 'listen')

        addSeeker(player, progressDisplay, i)
        if (scPlayers[i] && scPlayers[i].playing) {
          scPlayers[i].pause()
        } else if (scPlayers[i] && !scPlayers[i].playing) {
          scPlayers[i].play()
          progressBar(progressDisplay, i)
        }
      })
    })
  })
}
