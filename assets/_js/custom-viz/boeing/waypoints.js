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
          if (direction == 'down') {
            setTimeout(function run() {
              console.log('down: ' + partName)

              setTimeout(run, 100)
            }, 1000)
          } else if (direction == 'up') {
            console.log('up: ' + partName)
          }
        })
      },
      offset: '70%'
    })
  })
}

export default Waypoints
