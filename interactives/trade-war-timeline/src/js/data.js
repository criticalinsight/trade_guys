function parseData ({data, categories}) {
  let dataObj = {
    years: [],
    countries: [],
    points: {},
    totals: {}
  }

  data.forEach(function (row, i) {
    if (!dataObj.years.includes(row.year)) {
      dataObj.years.push(row.year)
      dataObj.points[row.year] = []
      dataObj.totals[row.year] = {}
    }

    if (!dataObj.countries.includes(row.country)) {
      dataObj.countries.push(row.country)
    }

    dataObj.totals[row.year][row.country] = row

    categories.forEach(category => {
      dataObj.points[row.year].push({
        id: row.country + '-' + category,
        country: row.country,
        year: row.year,
        value: row[category] || 0,
        category: category
      })
    })
  })
  dataObj.years.sort((a, b) => b - a)

  return dataObj
}

export default parseData
