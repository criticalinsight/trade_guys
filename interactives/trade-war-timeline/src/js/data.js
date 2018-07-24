function parseData({ data }) {
  let dataObj = []

  data.forEach(function(row, i) {
    // dataObj.steps[row.step] = dataObj.steps[row.step] || []
    //

    row.id = row.country + '-' + row.category

    row.group = 'Exports'
    if (row.country === 'USA') {
      row.group = 'Imports'
    }
    dataObj.push(row)
    // dataObj.steps[row.step].push(row)
  })
  dataObj.sort((a, b) => a.step - b.step)

  console.log(dataObj)

  return dataObj
}

export default parseData
