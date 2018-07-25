import * as d3 from 'd3'
import breakpoints from './breakpoints'

const chart = drawChart()
const transitionDuration = 600
const t = d3.transition().duration(transitionDuration)
const format = d3.format(',.3s')
const formatPercentage = d3.format(',.2%')

let windowWidth = window.innerWidth
let el
let categories

function resize() {
  const sz = Math.min(el.node().offsetWidth, window.innerHeight)
  chart.width(sz).height()
  el.call(chart)
}

function drawChart() {
  const colors = ['#455a64', '#8cb561', '#e7ae3f', '#a483a8', '#3b75bb']
  const margin = { top: 15, right: 20, bottom: 70, left: 70 }
  let width = 0
  let height = 0
  let groups

  var x = d3
    .scaleBand()
    .paddingInner(0.05)
    .align(0.1)

  var y = d3.scaleLinear()

  var colorScale = d3.scaleOrdinal().range(colors)

  function enter({ container, data }) {
    const svg = container.selectAll('svg').data([data])
    const svgEnter = svg.enter().append('svg')
    svgEnter.append('rect').attr('class', 'rect')
    const gEnter = svgEnter.append('g')
    gEnter.append('g').attr('class', 'g-plot')
    gEnter.append('g').attr('class', 'axis axis--x')
    gEnter.append('g').attr('class', 'axis axis--y')
    gEnter.append('g').attr('class', 'legend')
  }

  function exit({ container, data }) {}

  function updateScales({ data }) {
    groups = data.map(d => d.group)

    x.domain(groups).rangeRound([0, width])

    y.domain([0, 263])
      .nice()
      .rangeRound([height, 0])

    colorScale.domain(categories)
  }

  function updateDom({ container, data }) {
    let svg = container
      .select('svg')
      .attr(
        'viewBox',
        '0 0 ' +
          (width + margin.left + margin.right) +
          ' ' +
          (height + margin.top + margin.bottom)
      )

    let g = svg
      .select('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    let plot = g.select('.g-plot')

    let stack = d3.stack().keys(categories)

    categories.forEach(function(key, key_index) {
      var bar = plot
        .selectAll('.bar-' + key)
        .data(stack(data)[key_index], function(d) {
          return d.data.group + '-' + key
        })

      bar.exit().remove()

      bar
        .enter()
        .append('rect')
        .attr('class', function(d) {
          return 'bar bar-' + key
        })
        .attr('fill', function(d) {
          return colorScale(key)
        })
        .attr('x', d => x(d.data.group))
        .attr('y', height)
        .merge(bar)
        .transition()
        .attr('x', function(d) {
          return x(d.data.group)
        })
        .attr('y', function(d) {
          return y(d[1])
        })
        .attr('height', function(d) {
          return y(d[0]) - y(d[1])
        })
        .attr('width', x.bandwidth())
    })
  }

  function updateAxes({ container, data }) {
    let axisX = d3.axisBottom(x).tickFormat(d => {
      if (d == 'Imports') {
        return 'USA'
      }
      return 'China/EU/Canada/Mexico'
    })
    container
      .select('.axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisX)

    container
      .select('.axis--y')
      .call(d3.axisLeft(y).ticks(null, 's'))
      .append('text')
      .attr('x', 2)
      .attr('y', y(y.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
  }

  function updateLegend({ container, data }) {
    var legend = container
      .select('.legend')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + i * 20 + ')'
      })

    legend
      .append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => colorScale(d))

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d)
  }

  function chart(container) {
    const data = container.datum()

    enter({ container, data })
    exit({ container, data })
    updateScales({ container, data })
    updateDom({ container, data })
    updateAxes({ container, data })
    updateLegend({ container, data })
  }

  chart.width = function(...args) {
    if (!args.length) return width
    width = args[0]
    return chart
  }

  chart.height = function() {
    height = 700
    if (breakpoints.isMobile()) {
      height = 400
    }
    return chart
  }

  const interactions = {}

  return chart
}

function init(args) {
  el = d3.select(args.container)
  el.datum(args.data)
  categories = args.categories
  resize(args)
}

export default { init }
