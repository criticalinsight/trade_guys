const mobileNavigation = () => {
  const menuTrigger = document.getElementById('nav-trigger')
  const menuTriggerLabel = document.getElementById('nav-trigger-label')
  const menuLabelOpen = menuTriggerLabel.getAttribute('data-label-open')
  const menuLabelClose = menuTriggerLabel.getAttribute('data-label-close')
  const siteOverlay = document.getElementById('site-overlay')

  menuTrigger.addEventListener('change', function() {
    if (menuTrigger.checked) {
      document.body.classList.add('menu-open')
      siteOverlay.classList.add('menu-open')
      menuTriggerLabel.innerHTML = menuLabelClose
    } else {
      document.body.classList.remove('menu-open')
      siteOverlay.classList.remove('menu-open')
      menuTriggerLabel.innerHTML = menuLabelOpen
    }
  })

  siteOverlay.addEventListener('click', function() {
    menuTrigger.checked = !menuTrigger.checked
    triggerEvent(menuTrigger, 'change')
  })

  function triggerEvent(element, eventName) {
    const event = document.createEvent('HTMLEvents')
    event.initEvent(eventName, false, true)
    element.dispatchEvent(event)
  }
}

export default mobileNavigation
