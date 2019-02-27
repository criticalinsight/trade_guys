import 'waypoints/lib/noframework.waypoints.min'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'

const Waypoints = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))

  //if paragraph hits bottom of screen, part label appears
  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    new Waypoint({
      element: paragraph,
      handler: function() {
        Array.from(parts).forEach(part => {
          let partName = part.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)

          if (partLabel.classList.contains('hidden')) {
            // partLabel.setTimeout(function() {
            partLabel.classList.remove('hidden')
            // }, 10000)
          } else {
            partLabel.classList.add('hidden')
          }

          // if (paragraph.classList.contains('hidden')) {
          //   paragraph.classList.remove('hidden')
          // } else {
          //   paragraph.classList.add('hidden')
          // }
        })
      },
      offset: '95%'
    })
  })

  //if paragraph hits top of screen, part label disappears
  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    new Waypoint({
      element: paragraph,
      handler: function() {
        Array.from(parts).forEach(part => {
          let partName = part.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)

          if (partLabel.classList.contains('hidden')) {
            partLabel.classList.remove('hidden')
          } else {
            partLabel.classList.add('hidden')
          }

          // if (paragraph.classList.contains('hidden')) {
          //   paragraph.classList.remove('hidden')
          // } else {
          //   paragraph.classList.add('hidden')
          // }
        })
      },
      offset: '10%'
    })
  })
}

export default Waypoints
