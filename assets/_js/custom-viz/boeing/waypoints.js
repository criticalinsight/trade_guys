import 'waypoints/lib/noframework.waypoints.min'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'

const Waypoints = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))

  const counter = document.getElementsByClassName('counter')
  const partTotal = document.querySelectorAll('.part-total')
  const placeTotal = document.querySelectorAll('.place-total')

  //if paragraph hits bottom of screen, part label appears
  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    new Waypoint({
      element: paragraph,
      handler: function() {
        Array.from(parts).forEach(function(part, i) {
          let partName = part.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)
          let number = 0

          setTimeout(function() {
            if (partLabel.classList.contains('hidden')) {
              partLabel.classList.remove('hidden')
              //increment number
            } else {
              partLabel.classList.add('hidden')
              //decrease number
            }
          }, 5000 * (i + 1))

          console.log(`${counter} and ${partTotal} and ${placeTotal}`)
          console.log(`${number}`)
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
        })
      },
      offset: '10%'
    })
  })
}

export default Waypoints
