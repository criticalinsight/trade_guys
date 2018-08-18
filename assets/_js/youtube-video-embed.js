function generateYoutubeID(el) {
  const videoURL = el.getAttribute('data-url')
  let videoID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = videoURL.match(regExp)
  if (match && match[2].length == 11) {
    videoID = match[2]
  }
  return videoID
}

function createVideoEmbed() {
  const videoContainer = document.querySelector('.post-feature-video')
  if (!videoContainer) {
    return
  }
  const videoID = generateYoutubeID(videoContainer)
  if (!videoID) {
    return
  }
  videoContainer.innerHTML =
    '<iframe width="560" height="315" src="//www.youtube.com/embed/' +
    videoID +
    '" frameborder="0" allowfullscreen></iframe>'
}

export default createVideoEmbed
