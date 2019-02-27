const Hover = () => {
  let parts = document.querySelectorAll('.part')

  parts.forEach(part => {
    part.addEventListener('click', () => {
      let partName = part.getAttribute('data-part')
      console.log('data point (click): ' + partName)
    })
  })
}

export default Hover
