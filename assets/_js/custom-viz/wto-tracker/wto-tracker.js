import $ from 'jquery'
import gapi from 'gapi'

const SPREADSHEET_ID = '1z5iTKdahMJpEaKBS4Mhw_QEGsAEjVARkP2tNO7E-p80'
let longIndex

gapi.load('client', function() {
  gapi.client
    .init({
      apiKey: 'AIzaSyAUwCi8c_8omEKBILVuIK4_4kyFuN0SOxM',
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      discoveryDocs: [
        'https://sheets.googleapis.com/$discovery/rest?version=v4'
      ]
    })
    .then(function() {
      gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: SPREADSHEET_ID,
          range: 'A:Z'
        })
        .then(function(sheet) {
          renderTable({
            columns: sheet.result.values[0],
            data: sheet.result.values.slice(1)
          })
        })
    })
})

function renderTable(sheet) {
  let descriptionIndices = sheet.columns
    .filter(function(column) {
      return column.toLowerCase().indexOf('description') > -1
    })
    .map(function(column) {
      return sheet.columns.indexOf(column)
    })

  let linkIndex = sheet.columns.indexOf(
    sheet.columns.find(function(column) {
      return column.toLowerCase().indexOf('link') > -1
    })
  )

  longIndex =
    1 +
    sheet.columns.indexOf(
      sheet.columns.find(function(column) {
        return column.toLowerCase().indexOf('long') > -1
      })
    )

  $('#proposals').DataTable({
    data: sheet.data.map(function(row) {
      return [
        null,
        ...row.map(function(c, i) {
          return descriptionIndices.indexOf(i) > -1
            ? '<p>' +
                c +
                ' <a href=' +
                row[linkIndex] +
                ' target="_blank">' +
                'link to document ' +
                externalLink +
                '</a></p>'
            : c
        })
      ]
    }),
    columns: [
      {
        className: 'details-control',
        orderable: false,
        data: null,
        defaultContent: ''
      },
      ...sheet.columns.map(function(column) {
        return { title: column }
      })
    ],

    responsive: {
      details: false
    },
    pagingType: 'simple',
    order: [[1, 'desc']],
    columnDefs: [
      {
        targets: [1, 2, 3],
        orderable: false
      },
      { targets: [5, 6], visible: false },
      { targets: 0, responsivePriority: 0 },
      { targets: 1, responsivePriority: 1 },
      { targets: 2, responsivePriority: 2 },
      { targets: 3, responsivePriority: 3 },
      { targets: 4, responsivePriority: 4 }
    ],
    initComplete
  })
}
console.log(initComplete)
function initComplete() {
  $('.dataTables_length').remove()
  $('.fullWidthFeatureContent').before($('.dataTables_filter'))
  $('.dataTables_filter').after($('.dataTables_info'))

  $('.loader').hide()
  let table = this.api()

  let filterColumns = [2, 3].map(function(c) {
    return table.column(c)
  })
  makeFilter(table, filterColumns)
  let searchField = document.querySelector("label input[type='search']")

  $(searchField).after(
    '<button class="reset btn btn-all-caps btn-submit" aria-label="Reset Form">reset</button>'
  )

  $('.reset').on('click', function() {
    ;[...Array.from(filterColumns), ...table.column(12)].forEach(function(fc) {
      return fc.search('', true, false).draw()
    })

    searchField.value = ''

    table.search('', true, false).draw()

    table.responsive.recalc()
  })

  searchField.addEventListener('keydown', function() {
    table.responsive.recalc()
  })

  $('#proposals tbody').on('click', 'td.details-control', function() {
    let tr = $(this).closest('tr')
    let row = table.row(tr)

    if (row.child.isShown()) {
      row.child.hide()
      tr.removeClass('shown')
    } else {
      row.child(row.data()[longIndex]).show()

      $(row.child()[0])
        .find('td')
        .attr('colspan', '4')
        .attr('scope', 'colgroup')

      $(row.child()[0])
        .find('td')
        .before('<td>&nbsp;</td>')

      tr.addClass('shown')
    }
  })
}

function makeFilter(table, array) {
  array.forEach(function(c) {
    let label = c.header().textContent
    let labelSlug = label
      .toLowerCase()
      .replace(/[!@#$%^&*)(+=.,_-]/g, '')
      .replace(/ /g, '_')

    let datalist = $(
      '<datalist id="datalist_' + labelSlug + '"></datalist>'
    ).prependTo('.dataTables_filter')

    let input =
      '<input id="' +
      labelSlug +
      '" type="search" class="filter ' +
      labelSlug +
      '" list="datalist_' +
      labelSlug +
      '">'

    datalist
      .wrap('<div></div>')
      .before('<label for="' + labelSlug + '">' + label + ':</label>')
      .before(input)

    $('.' + labelSlug).on('change', function() {
      let val = $.fn.dataTable.util.escapeRegex($(input).val())
      c.search(val ? '' + val + '' : '', true, false).draw()
      table.responsive.recalc()
    })
    $('.' + labelSlug).on('input', function() {
      let val = $.fn.dataTable.util.escapeRegex($(input).val())
      c.search(val ? '' + val + '' : '', true, false).draw()
      table.responsive.recalc()
    })

    $('.sorting_asc').on('click', function() {
      table.responsive.recalc()
    })

    $(Array.from(new Set(Array.from(c.data()))))
      .sort()
      .each(function(j, d) {
        datalist.append('<option value="' + d + '">' + d + '</option>')
      })

    $(datalist)
      .children('option')
      .wrapAll('<select></select>')
  })
}

const externalLink =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path d="M7.49,0V1.67H1.68V13.32H13.32V7.52H15v5.72a1.76,1.76,0,0,1-.42,1.19,1.64,1.64,0,0,1-1.13.56H1.74a1.67,1.67,0,0,1-1.16-.41A1.61,1.61,0,0,1,0,13.48v-.27C0,9.4,0,5.6,0,1.8A1.83,1.83,0,0,1,.58.4a1.53,1.53,0,0,1,1-.39h6Z" transform="translate(0 0)"/><path d="M9.17,1.67V0H15V5.84H13.34v-3h0c-.05.05-.11.1-.16.16l-.45.46-1.3,1.29-.84.84-.89.9-.88.87-.89.9c-.28.29-.57.57-.86.86L6.16,10l-.88.87a1.83,1.83,0,0,1-.13.16L4,9.86l0,0L5.36,8.47l.95-1,.75-.75,1-1L8.87,5l1-.94.85-.86.92-.91.56-.58Z" transform="translate(0 0)"/></svg>'
