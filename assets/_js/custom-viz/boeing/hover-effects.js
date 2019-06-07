const Hover = () => {
  const paragraphs = Array.from(document.querySelectorAll('.scroll-text'))

  paragraphs.forEach(paragraph => {
    let activeParts = Array.from(paragraph.querySelectorAll('.part'))
    activeParts.forEach(function(part) {
      part.addEventListener('mouseover', () => {
        const notHovered = activeParts.filter(partName => partName !== part)

        notHovered.forEach(part => {
          let partName = part.getAttribute('data-part')
          let partSVG = document.getElementById(`${partName}-part`)

          partSVG.classList.remove('boeing-js__opacity-focused')
        })
      })
    })
  })
}

export default Hover
