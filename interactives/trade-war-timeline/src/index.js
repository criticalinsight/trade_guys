import * as d3 from 'd3'
import chart from './js/chart'
import scrollInit from './js/scrolling'
import parseData from './js/data'
import DataCSV from './data/dummy.csv'
import './scss/main.scss'

let current_step = 1

const data = parseData({
	data: DataCSV
})

function init() {
	hideLoading()
	flexBox()
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

function drawChart() {
	let dataset = data

	// chart.init({
	// 	data: dataset,
	// 	container: '.chart-primary'
	// })
}

init()
