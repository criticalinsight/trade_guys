import 'waypoints/lib/noframework.waypoints.min.js'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'
/* global Waypoint */

const Waypoints = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))
  const partCounter = document.body.querySelector('.part-total')
  const placeCounter = document.body.querySelector('.places-total')
  let totalParts = 0
  let totalPlaces = 0

  paragraphs.forEach(paragraph => {
    const activeParts = Array.from(paragraph.querySelectorAll('.part'))
    const activePlaces = Array.from(paragraph.querySelectorAll('.place'))
    let partsInParagraph = activeParts.length
    let placesInParagraph = activePlaces.length

    const waypoint = new Waypoint({
      element: paragraph,
      handler: function(direction) {
        // Counter functionality
        if (direction === 'down') {
          totalParts += partsInParagraph
          totalPlaces += placesInParagraph
          partCounter.innerHTML = totalParts
          placeCounter.innerHTML = totalPlaces
        } else {
          totalParts -= partsInParagraph
          totalPlaces -= placesInParagraph
          partCounter.innerHTML = totalParts
          placeCounter.innerHTML = totalPlaces
        }

        let partName
        let partLabel
        let partSVG

        activeParts.forEach(function(part) {
          partName = part.getAttribute('data-part')
          partLabel = document.getElementById(`${partName}-label`)
          partSVG = document.getElementById(`${partName}-part`)

          if (direction === 'down') {
            partLabel.classList.add('boeing-js__opacity-focused')

            if (!partSVG) {
              return
            }
            partSVG.classList.add('boeing-js__opacity-focused')
          } else {
            partLabel.classList.remove('boeing-js__opacity-focused')

            if (!partSVG) {
              return
            }
            partSVG.classList.remove('boeing-js__opacity-focused')
          }
        })
        const previousWaypoint = this.previous()

        if (!previousWaypoint) {
          return
        }

        if (direction === 'down') {
          const previousNodes = previousWaypoint.element.children
          Array.from(previousNodes).forEach(child => {
            if (child.classList.contains('place')) {
              return
            }

            document
              .getElementById(`${child.getAttribute('data-part')}-label`)
              .classList.remove('boeing-js__opacity-focused')

            let previousPart = document.getElementById(
              `${child.getAttribute('data-part')}-part`
            )

            if (!previousPart) {
              return
            }

            previousPart.classList.remove('boeing-js__opacity-focused')
            previousPart.classList.add('boeing-js__opacity-viewed')
          })
        } else {
          const previousNodes = previousWaypoint.element.children
          Array.from(previousNodes).forEach(child => {
            if (child.classList.contains('place')) {
              return
            }

            document
              .getElementById(`${child.getAttribute('data-part')}-label`)
              .classList.add('boeing-js__opacity-focused')

            let previousPart = document.getElementById(
              `${child.getAttribute('data-part')}-part`
            )
            if (!previousPart) {
              return
            }
            previousPart.classList.add('boeing-js__opacity-focused')
            previousPart.classList.remove('boeing-js__opacity-viewed')
          })
        }
      },
      offset: '90%'
    })
    return waypoint
  })
}

export default Waypoints
