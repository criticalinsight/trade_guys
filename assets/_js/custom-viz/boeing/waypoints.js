import 'waypoints/lib/noframework.waypoints.min'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'

const Waypoints = () => {
  console.log('waypoint file')

  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))
  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    new Waypoint({
      element: paragraph,
      handler: function(direction) {
        Array.from(parts).forEach(part => {
          let partName = part.getAttribute('data-part')
          console.log('direction: ' + direction + ' part: ' + partName)
        })
      },
      offset: '95%'
    })
  })
}

export default Waypoints
