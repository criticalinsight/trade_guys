import PaginationInit from './pagination'
import AudioPlayer from './audio-player'
import HomePageScroll from './home'
import MobileNavigation from './navigation'
import YoutubeVideoEmbed from './youtube-video-embed'

window.addEventListener('DOMContentLoaded', () => {
  PaginationInit()
  AudioPlayer()
  HomePageScroll()
  MobileNavigation()
  YoutubeVideoEmbed()
})
