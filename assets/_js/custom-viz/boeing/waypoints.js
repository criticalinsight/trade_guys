import 'waypoints/lib/noframework.waypoints.min'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'

const Waypoints = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))

  const svgContainer = document.querySelector('.svg-container')
  const plane = svgContainer.querySelector('.plane')
  const map = svgContainer.querySelector('.map')

  // const counter = document.getElementsByClassName('counter')
  let numberParts = 0
  let numberPlaces = 0

  //if paragraph hits bottom of screen, part label appears
  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    const places = paragraph.querySelectorAll('.place')

    new Waypoint({
      element: paragraph,
      handler: function(direction) {
        ///// Update DOM classes
        Array.from(places).forEach(function(place) {
          if (place.classList.contains('counted')) {
            place.classList.remove('counted')
          } else {
            place.classList.add('counted')
          }
        })

        Array.from(parts).forEach(function(part) {
          if (part.classList.contains('counted')) {
            part.classList.remove('counted')
          } else {
            part.classList.add('counted')
          }
        })

        ///// Count relevant places and update Counter
        let placeCount = Array.from(places).filter(function(place) {
          return place.classList.contains('counted')
        }).length

        if (direction === 'down') {
          numberPlaces += placeCount
        } else {
          numberPlaces -= places.length - placeCount
        }

        document.querySelector('.places-total').innerHTML = numberPlaces

        ///// Count relevant parts and update Counter
        let partCount = Array.from(parts).filter(function(part) {
          return part.classList.contains('counted')
        }).length
        console.log(partCount + 'is the partCount')

        if (direction === 'down') {
          numberParts += partCount
        } else {
          numberParts -= parts.length - partCount
        }

        document.querySelector('.part-total').innerHTML = numberParts

        const totalParts = 22
        const totalPlaces = 19

        while (partCount == totalParts && placeCount == totalPlaces) {
          if (plane.classList.contains('display-none') && direction === 'up') {
            plane.classList.remove('display-none')
            map.classList.add('display-none')
          } else {
            plane.classList.add('display-none')
            map.classList.remove('display-none')
          }
        }
      },
      offset: '50%'
    })
  })

  //if paragraph hits top of screen, part label disappears
  paragraphs.forEach(paragraph => {
    const allParts = Array.from(document.querySelectorAll('.part'))
    const activeParts = Array.from(paragraph.querySelectorAll('.part'))

    new Waypoint({
      element: paragraph,
      handler: function() {
        allParts.forEach(function(part) {
          let partName = part.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)

          if (activeParts.indexOf(part) < 0) {
            partLabel.classList.add('hidden')
            console.log(part + ' are the activeParts')
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
