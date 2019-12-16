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
  let descriptionIndex = sheet.columns.indexOf(
    sheet.columns.find(function(column) {
      column.toLowerCase().indexOf('description') > -1 &&
        column.toLowerCase().indexOf('long') < 0
    })
  )

  let linkIndex = sheet.columns.indexOf(
    sheet.columns.find(function(column) {
      return column.toLowerCase().indexOf('document') > -1
    })
  )

  let memberIndex = sheet.columns.indexOf(
    sheet.columns.find(function(column) {
      return column.toLowerCase().indexOf('member') > -1
    })
  )

  longIndex = sheet.columns.indexOf(
    sheet.columns.find(function(column) {
      return column.toLowerCase().indexOf('long') > -1
    })
  )

  $('#proposals').DataTable({
    data: sheet.data.map(function(row) {
      if (!row[5]) {
        row[5] = null
      }
      return [null].concat(
        row.map(function(c, i) {
          switch (i) {
            case memberIndex:
              const memberArray = c.split(',')
              const length = memberArray.length

              return length > 3
                ? memberArray.slice(0, -1).join(', ') +
                    ', and ' +
                    memberArray.slice(-1)
                : length === 2
                ? memberArray[0] + ' and ' + memberArray.slice(-1)
                : c

            case linkIndex:
              if (!row[linkIndex]) {
                return ''
              }

              return (
                '<p><a href=' +
                row[linkIndex] +
                ' target="_blank">' +
                'View ' +
                externalLink +
                '</a></p>'
              )

            case longIndex:
              return (
                '<p> ' +
                c.replace(/• /g, '<br/>• ').replace(/(?:\r\n|\r|\n)/g, '<br>') +
                '</p>'
              )

            case descriptionIndex:
              return (
                '<p> ' +
                c +
                '</p>' +
                '<p class="read-more">' +
                open +
                close +
                '<span>read more</span></p>'
              )

            default:
              return c
          }
        })
      )
    }),
    columns: [
      {
        className: 'details-control',
        orderable: false,
        data: null,
        defaultContent: ''
      }
    ].concat(
      sheet.columns.map(function(column) {
        return { title: column }
      })
    ),
    responsive: {
      details: false
    },
    pagingType: 'simple',
    order: [[1, 'desc']],
    columnDefs: [
      {
        targets: [0, 2, 3, 4, 6],
        orderable: false
      },
      { targets: [5], visible: false },
      { targets: 0, responsivePriority: 0 },
      { targets: 1, responsivePriority: 1 },
      { targets: 2, responsivePriority: 2 },
      { targets: 3, responsivePriority: 3 },
      { targets: 4, responsivePriority: 5 },
      { targets: 6, responsivePriority: 4 }
    ],
    initComplete
  })
}

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
    Array.from(filterColumns).forEach(function(fc) {
      return fc.search('', true, false).draw()
    })

    searchField.value = ''

    table.search('', true, false).draw()

    table.responsive.recalc()
  })

  searchField.addEventListener('keydown', function() {
    table.responsive.recalc()
  })

  $('#proposals tbody').on('click', 'tr', function() {
    let tr = $(this)
    let row = table.row(tr)

    if (row.child.isShown()) {
      row.child.hide()
      tr.removeClass('shown')
    } else {
      row.child(row.data()[longIndex + 1]).show()

      $(row.child()[0])
        .find('td')
        .attr('colspan', '5')
        .attr('scope', 'colgroup')

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
      '" name="' +
      labelSlug +
      '" value="">'

    datalist
      .wrap('<div></div>')
      .before('<label for="' + labelSlug + '">' + label + ':</label>')
      .before(input)

    $('.' + labelSlug).on('change', function() {
      let val = $.fn.dataTable.util.escapeRegex($(this).val())
      c.search(val ? '' + val + '' : '', true, false).draw()
      table.responsive.recalc()
    })
    $('.' + labelSlug).on('input', function() {
      let val = $.fn.dataTable.util.escapeRegex($(this).val())
      c.search(val ? '' + val + '' : '', true, false).draw()
      table.responsive.recalc()
    })

    $('.sorting_asc').on('click', function() {
      table.responsive.recalc()
    })

    const options = Array.from(c.data())
      .reduce(function(acc, curr) {
        if (typeof curr === 'string') {
          const currSplit = curr.split(/,| and /)

          currSplit.forEach(function(item) {
            acc.push(item.trim())
          })
        } else if (typeof curr === 'object') {
          acc.concat(curr)
        }

        return acc
      }, [])
      .sort(function(a, b) {
        return a.localeCompare(b)
      })
      .filter(function(o) {
        return o
      })

    $(Array.from(new Set(options)))
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
const open =
  '<svg class="open-icon" width="21px" height="21px" viewBox="0 0 45 46" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g transform="translate(-3659.000000, -1147.000000)" fill="#000000"> <path d="M3681.488,1147.176 C3685.55202,1147.176 3689.34398,1148.19999 3692.864,1150.248 C3696.25602,1152.23201 3698.94399,1154.91998 3700.928,1158.312 C3702.97601,1161.83202 3704,1165.62398 3704,1169.688 C3704,1173.75202 3702.97601,1177.54398 3700.928,1181.064 C3698.94399,1184.45602 3696.25602,1187.14399 3692.864,1189.128 C3689.34398,1191.17601 3685.55202,1192.2 3681.488,1192.2 C3677.42398,1192.2 3673.64802,1191.17601 3670.16,1189.128 C3666.76798,1187.14399 3664.08001,1184.45602 3662.096,1181.064 C3660.04799,1177.54398 3659.024,1173.75202 3659.024,1169.688 C3659.024,1165.62398 3660.04799,1161.83202 3662.096,1158.312 C3664.08001,1154.91998 3666.76798,1152.23201 3670.16,1150.248 C3673.64802,1148.19999 3677.42398,1147.176 3681.488,1147.176 Z M3693.488,1171.176 C3693.904,1171.176 3694.264,1171.032 3694.568,1170.744 C3694.872,1170.456 3695.024,1170.104 3695.024,1169.688 C3695.024,1169.272 3694.872,1168.92 3694.568,1168.632 C3694.264,1168.344 3693.904,1168.2 3693.488,1168.2 L3683.024,1168.2 L3683.024,1157.688 C3683.024,1157.272 3682.872,1156.92 3682.568,1156.632 C3682.264,1156.344 3681.904,1156.2 3681.488,1156.2 C3681.072,1156.2 3680.72,1156.344 3680.432,1156.632 C3680.144,1156.92 3680,1157.272 3680,1157.688 L3680,1168.2 L3669.488,1168.2 C3669.072,1168.2 3668.72,1168.344 3668.432,1168.632 C3668.144,1168.92 3668,1169.272 3668,1169.688 C3668,1170.104 3668.144,1170.456 3668.432,1170.744 C3668.72,1171.032 3669.072,1171.176 3669.488,1171.176 L3680,1171.176 L3680,1181.688 C3680,1182.104 3680.144,1182.456 3680.432,1182.744 C3680.72,1183.032 3681.072,1183.176 3681.488,1183.176 C3681.904,1183.176 3682.264,1183.032 3682.568,1182.744 C3682.872,1182.456 3683.024,1182.104 3683.024,1181.688 L3683.024,1171.176 L3693.488,1171.176 Z"></path> </g> </g> </svg>'
const close =
  '<svg class="close-icon" width="20px" height="21px" viewBox="0 0 45 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g  transform="translate(-3728.000000, -1150.000000)" fill="#000000"> <path d="M3750.488,1150.176 C3754.55202,1150.176 3758.34398,1151.19999 3761.864,1153.248 C3765.25602,1155.23201 3767.94399,1157.91998 3769.928,1161.312 C3771.97601,1164.83202 3773,1168.62398 3773,1172.688 C3773,1176.75202 3771.97601,1180.54398 3769.928,1184.064 C3767.94399,1187.45602 3765.25602,1190.14399 3761.864,1192.128 C3758.34398,1194.17601 3754.55202,1195.2 3750.488,1195.2 C3746.42398,1195.2 3742.64802,1194.17601 3739.16,1192.128 C3735.76798,1190.14399 3733.08001,1187.45602 3731.096,1184.064 C3729.04799,1180.54398 3728.024,1176.75202 3728.024,1172.688 C3728.024,1168.62398 3729.04799,1164.83202 3731.096,1161.312 C3733.08001,1157.91998 3735.76798,1155.23201 3739.16,1153.248 C3742.64802,1151.19999 3746.42398,1150.176 3750.488,1150.176 Z M3762.488,1174.176 C3762.904,1174.176 3763.264,1174.032 3763.568,1173.744 C3763.872,1173.456 3764.024,1173.104 3764.024,1172.688 C3764.024,1172.272 3763.872,1171.92 3763.568,1171.632 C3763.264,1171.344 3762.904,1171.2 3762.488,1171.2 L3738.488,1171.2 C3738.072,1171.2 3737.72,1171.344 3737.432,1171.632 C3737.144,1171.92 3737,1172.272 3737,1172.688 C3737,1173.104 3737.144,1173.456 3737.432,1173.744 C3737.72,1174.032 3738.072,1174.176 3738.488,1174.176 L3762.488,1174.176 Z" ></path> </g> </g> </svg>'
