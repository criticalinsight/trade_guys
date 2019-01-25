const waypoints = require('waypoints/lib/jquery.waypoints.js')

const WaypointJS = () => {
  waypoints('.scrolling-text-1', function(direction) {
    const forwardFuselage = document.getElementById('forward_fuselage')
    const label = document.getElementById('forward_fuselage_label')

    if (direction === 'down') {
      forwardFuselage.fadeOut()
    } else if (direction === 'up') {
      label.fadeIn()
    } else {
      console.log('waypoint file loaded')
    }
  })
}

export default WaypointJS
