import * as d3 from 'd3'
function parseData({ data }) {
  let dataObj = []

  data.forEach(function(row, i) {
    row.id = row.country + '-' + row.category

    row.group = 'Exports'
    if (row.country === 'USA') {
      row.group = 'Imports'
    }
    dataObj.push(row)
  })
  dataObj.sort((a, b) => a.step - b.step)

  return dataObj
}

function parseDataSVG({ data }) {
  let dataObj = {
    steps: {}
  }
  data.map(d => (d.category = slugify(d.category)))
  let steps = Array.from(new Set([...data.map(d => d.step)]))
  dataObj.categories = Array.from(new Set([...data.map(d => d.category)]))

  steps.forEach(step => {
    let entries = data.filter(d => d.step <= step)

    let stepObj = {}

    entries.forEach(entry => {
      stepObj[entry.group] = stepObj[entry.group] || {
        group: entry.group,
        sum: 0
      }

      dataObj.categories.forEach(c => {
        if (stepObj[entry.group][c]) {
          return
        }
        stepObj[entry.group][c] = 0
      })

      stepObj[entry.group][entry.category] += entry.value
      stepObj[entry.group].sum += entry.value
    })

    dataObj.steps[step] = Object.values(stepObj)
  })

  return dataObj
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default { parseData, parseDataSVG }
