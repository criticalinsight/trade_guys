import 'waypoints/lib/noframework.waypoints.min'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'

const Waypoints = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))
  // const counter = document.getElementsByClassName('counter')

  let numberParts = 0
  let numberPlaces = 0

  const increaseParts = function() {
    numberParts += 1
    document.querySelector('.part-total').innerHTML = numberParts
    console.log(`number of parts: ${numberParts}`)
  }

  const increasePlaces = function() {
    numberPlaces += 1
    document.querySelector('.places-total').innerHTML = numberPlaces
    console.log(`number of places: ${numberPlaces}`)
  }

  //if paragraph hits bottom of screen, part label appears
  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    new Waypoint({
      element: paragraph,
      handler: function() {
        Array.from(parts).forEach(function(part, i) {
          let partName = part.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)

          if (partLabel.classList.contains('hidden')) {
            setTimeout(function() {
              partLabel.classList.remove('hidden')
              increaseParts()
              increasePlaces()
            }, 600 * (i + 1))
          } else {
            partLabel.classList.add('hidden')
            //decrease number
          }
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
          console.log(partLabel)

          if (!partLabel.classList.contains('hidden')) {
            partLabel.classList.add('hidden')
          } else {
            partLabel.classList.remove('hidden')
          }
        })
      },
      offset: '10%'
    })
  })
}

export default Waypoints
