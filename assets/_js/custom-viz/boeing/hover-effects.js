const Hover = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))

  paragraphs.forEach(paragraph => {
    let activeParts = Array.from(paragraph.querySelectorAll('.part'))
    activeParts.forEach(function(part) {
      part.addEventListener('mouseover', () => {
        const notHovered = activeParts.filter(node => node !== part)

        notHovered.forEach(child => {
          let partName = child.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)
          let partSVG = document.getElementById(`${partName}-part`)

          if (
            part.getAttribute('data-part') === child.getAttribute('data-part')
          ) {
            return
          }

          partLabel.classList.remove('boeing-js__opacity-focused')

          if (!partSVG) {
            return
          }
          partSVG.classList.remove('boeing-js__opacity-focused')
        })
      })

      part.addEventListener('mouseout', () => {
        const notHovered = activeParts.filter(node => node !== part)

        notHovered.forEach(child => {
          let partName = child.getAttribute('data-part')
          let partLabel = document.getElementById(`${partName}-label`)
          let partSVG = document.getElementById(`${partName}-part`)

          partLabel.classList.add('boeing-js__opacity-focused')

          if (!partSVG) {
            return
          }
          partSVG.classList.add('boeing-js__opacity-focused')
        })
      })
    })
  })
}

export default Hover
