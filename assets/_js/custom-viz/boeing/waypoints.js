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
          let partLabel = document.getElementById(partName + '-label')
          console.log(`direction: ${direction}`)
          console.log(`part: ${partName}`)
          console.log(`partLabel: ${partLabel}`)
          console.log(partLabel.innerHTML)
          partLabel.classList.add('fade-in-1')
        })
      },
      offset: '95%'
    })
  })
}

export default Waypoints
