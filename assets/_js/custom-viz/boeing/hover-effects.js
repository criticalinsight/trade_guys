const Hover = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))

  paragraphs.forEach(paragraph => {
    let activeParts = Array.from(paragraph.querySelectorAll('.part'))
    activeParts.forEach(function(part) {
      let partName
      let partSVG
      let partLabel

      part.addEventListener('mouseover', () => {
        const notHovered = activeParts.filter(partName => partName !== part)

        notHovered.forEach(part => {
          partName = part.getAttribute('data-part')
          partLabel = document.getElementById(`${partName}-label`)
          partSVG = document.getElementById(`${partName}-part`)

          partLabel.classList.remove('boeing-js__opacity-focused')
          partSVG.classList.remove('boeing-js__opacity-focused')
        })
      })

      part.addEventListener('mouseout', () => {
        const notHovered = activeParts.filter(partName => partName !== part)

        notHovered.forEach(part => {
          partName = part.getAttribute('data-part')
          partLabel = document.getElementById(`${partName}-label`)
          partSVG = document.getElementById(`${partName}-part`)

          partLabel.classList.add('boeing-js__opacity-focused')
          partSVG.classList.add('boeing-js__opacity-focused')
        })
      })
    })
  })
}

export default Hover
