import 'waypoints/lib/noframework.waypoints.min'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'

const Waypoints = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))

  const svgContainer = document.querySelector('.svg-container')
  const plane = svgContainer.querySelector('.plane')
  const map = svgContainer.querySelector('.map')
  const svgParts = svgContainer.querySelectorAll('.svgPart')

  svgParts.forEach(part => {
    part.classList.add('boeing-js__opacity-not-viewed')
  })

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

        if (direction === 'down') {
          numberParts += partCount
        } else {
          numberParts -= parts.length - partCount
        }

        document.querySelector('.part-total').innerHTML = numberParts

        const totalParts = 22
        const totalPlaces = 19

        while (partCount == totalParts && placeCount == totalPlaces) {
          if (
            plane.classList.contains('js-display-none') &&
            direction === 'up'
          ) {
            plane.classList.remove('js-display-none')
            map.classList.add('js-display-none')
          } else {
            plane.classList.add('js-display-none')
            map.classList.remove('js-display-none')
          }
        }
      },
      offset: ''
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
          let partSVG = document.getElementById(`${partName}-part`)
          console.log(`${part.getAttribute('data-part')}-part`)
          console.log(partSVG)

          if (activeParts.indexOf(part) < 0) {
            partLabel.classList.add('js-hidden')

            // match part name with svg counterpart
            // if its a match, bring into full opacity
          } else {
            partLabel.classList.remove('js-hidden')
            if (
              partSVG !== null &&
              `${part.getAttribute('data-part')}-part` ===
                partSVG.getAttribute('id')
            ) {
              partSVG.classList.remove('boeing-js__opacity-not-viewed')
              partSVG.classList.add('boeing-js__opacity-focused')
            }
          }
        })
      },
      offset: '90%'
    })
  })
}

export default Waypoints
