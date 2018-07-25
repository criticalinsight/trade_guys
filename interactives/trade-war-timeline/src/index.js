import * as d3 from 'd3'
import chart from './js/chart'
// import scrollInit from './js/scrolling'
import 'intersection-observer'
import scrollama from 'scrollama'
import parseData from './js/data'
import DataCSV from './data/dummy.csv'
import './scss/main.scss'

let current_step = 1
let totalImports = 0
let totalExports = 0
let totalAdded = 0
var container = d3.select('#scroll')
var graphic = container.select('.scroll__graphic')
var chartContainer = graphic.select('.chart')
var text = container.select('.scroll__text')
var step = text.selectAll('.step')

const data = parseData.parseData({
	data: DataCSV
})

const dataSVG = parseData.parseDataSVG({
	data: DataCSV
})

function init() {
	hideLoading()
	// flexBox()
	scrollInit()
	// drawChart()
}

function hideLoading() {
	d3.select('.loading-container').style('display', 'none')
	d3.selectAll('.hide-on-load').classed('hide-on-load', false)
}

function flexBox() {
	const stack = d3.select('.stack')
	// let steps = data.map(d => ({ step: d.step, date: d.date }))
	let steps = Array.from(new Set([...data.map(d => d.step)]))

	// console.log(steps)
	// d3.select('.scroll__text')
	// 	.selectAll('.step')
	// 	.data(steps)
	// 	.enter()
	// 	.append('div')
	// 	.attr('class', 'step')
	// 	.attr('data-step', d => d)
	// 	.html(d => '<p>Event #' + d + '</p>')

	let groups = ['Imports', 'Exports']

	const scaleY = d3
		.scaleLinear()
		.range([0, Math.floor(window.innerHeight / 2)])
		.domain([0, 300])

	const scaleColor = d3
		.scaleOrdinal()
		.range([
			'#196c95',
			'#5db6d0',
			'#f9bc65',
			'#d66e42',
			'#4f9793',
			'#3e7a82',
			'#4b5255'
		])
		.domain(['USA', 'China', 'EU', 'Canada', 'Mexico'])

	const group = stack
		.selectAll('.group')
		.data(groups)
		.enter()
		.append('div')
		.attr('class', 'group')
		.attr('data-group', d => d)

	const block = group
		.selectAll('.block')
		.data(d => data.filter(datum => datum.group === d))
		.enter()
		.append('div')
		.attr('class', 'block')
		.attr('data-step', d => d.step)
		.style('height', d => `${scaleY(d.value)}px`)
		.style('background-color', d => scaleColor(d.country))

	const label = group
		.append('span')
		.html(d => {
			if (d == 'Imports') {
				return 'U.S.'
			}

			let html = ''
			;['China', 'EU', 'Canada', 'Mexico'].forEach((country, i) => {
				let prefix = ' / '
				if (i === 0) {
					prefix = ''
				}
				html += `${prefix}<span style="color:${scaleColor(
					country
				)}">${country}</span>`
			})

			return html
		})
		.attr('class', 'label')

	let gridLines = stack
		.selectAll('.gridlines')
		.data(steps)
		.enter()
		.append('div')
		.attr('class', 'gridlines')
		.attr('data-gridlines', d => d)
		.style('bottom', d => {
			let total = 35
			let blocks = Array.from(
				document.querySelectorAll('.block[data-step="' + d + '"]')
			)
			blocks.forEach(block => {
				total += block.offsetHeight
			})
			return total + 'px'
		})
		.text(d => d)
}

function calcTotalAdded(dataset) {
	let totalStepSum = dataset
		.map(d => d.sum)
		.reduce((total, num) => total + num, 0)

	if (current_step == 1) {
		totalAdded = totalStepSum
		return
	}

	let totalPrevStepSum = dataSVG.steps[current_step - 1]
		.map(d => d.sum)
		.reduce((total, num) => total + num, 0)

	totalAdded = totalStepSum - totalAdded

	console.log(totalAdded)
}

function drawChart() {
	let dataset = dataSVG.steps[current_step]

	calcTotalAdded(dataset)

	chart.init({
		data: dataset,
		categories: dataSVG.categories,
		container: '.chart-primary'
	})
}

// initialize the scrollama
var scroller = scrollama()

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepHeight = Math.floor(window.innerHeight * 0.75)
	step.style('height', stepHeight + 'px')

	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth
	var textWidth = text.node().offsetWidth

	var graphicWidth = bodyWidth - textWidth

	graphic
		.style('width', graphicWidth + 'px')
		.style('height', window.innerHeight + 'px')

	var chartMargin = 32
	var chartWidth = graphic.node().offsetWidth - chartMargin

	chartContainer
		.style('width', chartWidth + 'px')
		.style('height', Math.floor(window.innerHeight / 2) + 'px')

	// 3. tell scrollama to update new element dimensions
	scroller.resize()
}

// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }

	// add color to current step only
	step.classed('is-active', function(d, i) {
		return i === response.index
	})

	let stepNum = response.index + 1
	current_step = stepNum

	// update graphic based on step
	// step.select('.amount-added').text('+$' + totalAdded + 'billion')
	chartContainer
		.selectAll('.block')
		.classed('is-visible', d => d.step <= stepNum)

	drawChart()
}

function handleContainerEnter(response) {
	// response = { direction }
}

function handleContainerExit(response) {
	// response = { direction }
}

function setupStickyfill() {
	d3.selectAll('.sticky').each(function() {
		Stickyfill.add(this)
	})
}

function scrollInit() {
	// setupStickyfill()

	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize()

	// 2. setup the scroller passing options
	// this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			container: '#scroll',
			graphic: '.scroll__graphic',
			text: '.scroll__text',
			step: '.scroll__text .step',
			debug: false
		})
		.onStepEnter(handleStepEnter)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit)

	// setup resize event
	window.addEventListener('resize', handleResize)
}

init()
