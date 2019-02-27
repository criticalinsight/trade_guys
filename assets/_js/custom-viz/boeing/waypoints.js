import 'waypoints/lib/noframework.waypoints.min'
import 'waypoints/src/shortcuts/inview'
import 'waypoints/src/shortcuts/sticky'

const Waypoints = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))
  const boeingWrapper = document.getElementById('boeingScroll')
  const svgContainer = document.querySelector('.svg-container')
  const allLabels = svgContainer.querySelector('.label-group')

  // let hideAllLabels = new Waypoint({
  //   element: boeingWrapper,
  //   handler: function() {
  //     Array.from(allLabels).forEach(label => {
  //       if (!label.classList.contains('hidden')) {
  //         label.classList.add('hidden')
  //       } else {
  //         return
  //       }
  //     })
  //   },
  //   offset: '95%'
  // })

  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    new Waypoint({
      element: paragraph,
      handler: function() {
        Array.from(parts).forEach(part => {
          let partName = part.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)

          partLabel.classList.remove('hidden')
          // if (!partLabel.classList.contains('hidden')) {
          //   return
          // } else {
          //
          // }
        })
      },
      offset: '95%'
    })
  })

  paragraphs.forEach(paragraph => {
    const parts = paragraph.querySelectorAll('.part')
    new Waypoint({
      element: paragraph,
      handler: function() {
        Array.from(parts).forEach(part => {
          let partName = part.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)

          partLabel.classList.add('hidden')

          if (paragraph.classList.contains('hidden')) {
            paragraph.classList.remove('hidden')
          } else {
            paragraph.classList.add('hidden')
          }
        })
      },
      offset: '10%'
    })
  })

  hideAllLabels()
}

export default Waypoints
