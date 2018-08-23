const homePageScroll = () => {
  if (!document.querySelector('.body-home')) {
    return
  }

  const breakpoint = getComputedStyle(document.body)
    .getPropertyValue('--breakpoint')
    .replace(/"/g, '')
    .trim()
  if (breakpoint == 'xsmall' || breakpoint == 'small') {
    return
  }

  const mainSiteLogoContainer = document.querySelector('.site-title-main')
  const the_arrow = document.getElementById('the_arrow')
  const trade_arrow = document.getElementById('trade_arrow')
  const guys_arrow = document.getElementById('guys_arrow')
  const featuredStatContainer = document.querySelector(
    '.featured-stat-container'
  )

  window.addEventListener('scroll', function() {
    let featuredStat = isInViewport(featuredStatContainer)
    if (featuredStat.isVisible) {
      featuredStatContainer.style.setProperty(
        '--background-width',
        (featuredStat.width / 2) - featuredStat.top + 'px'
      )
    }

    let mainSiteLogo = isInViewport(mainSiteLogoContainer)

    if (!mainSiteLogo.isVisible) {
      return
    }

    if (!mainSiteLogoContainer.classList.contains('in-view')) {
      mainSiteLogoContainer.classList.add('in-view')
    }

    logoTransformations()
  })

  function logoTransformations() {
    const newSize = window.pageYOffset / 2
    const srotate = 'translate(' + newSize + 'px)'
    const srotateneg = 'translate(-' + newSize + 'px)'
    the_arrow.style.setProperty('transform', srotateneg)
    guys_arrow.style.setProperty('transform', srotateneg)
    trade_arrow.style.setProperty('transform', srotate)
  }

  function isInViewport(el) {
    const { top, bottom, width } = el.getBoundingClientRect()
    const vHeight = window.innerHeight || document.documentElement.clientHeight

    return {
      isVisible: (top > 0 || bottom > 0) && top < vHeight,
      width: width,
      top: top
    }
  }
}

export default homePageScroll
