const Pagination = {
  postsContainer: document.querySelector('.archive:not(.no-pagination)'),
  paginationContainer: document.querySelector('.archive-pagination'),
  postContentContainer: document.querySelector('.post-content'),
  postsList: Array.from(document.querySelectorAll('.post-list')),
  totalNumPosts: 0,
  numberOfPages: 0,
  currentPage: 1,
  numberPerPage: 10,
  filterByContentTypes: false,
  selectedContentTypes: [],
  getPosts() {
    let posts = this.postsList
    if (this.filterByContentTypes && this.selectedContentTypes.length > 0) {
      posts = this.postsList.filter(d =>
        this.selectedContentTypes.includes(d.getAttribute('data-content-type'))
      )
    }
    this.totalNumPosts = posts.length
    this.numberOfPages = Math.ceil(this.totalNumPosts / this.numberPerPage)
  },
  getContentTypesFromURL() {
    const params = this.getURLParams(window.location.href)
    if (params.content_type) {
      this.selectedContentTypes = params.content_type.split(',')
    }
  },
  setCurrentPage() {
    const params = this.getURLParams(window.location.href)
    let page = 1
    if (params.page && params.page <= this.numberOfPages) {
      page = params.page
    }
    this.currentPage = +page
  },
  setupPaginationBtns() {
    let btnHTML = `<button class='pagination-page pagination-prev' data-page='${this
      .currentPage - 1}'><i class="icon-angle-left"></i></button>`
    btnHTML += `<span class="pagination-total-pages"></span>`
    for (let i = 1; i <= this.numberOfPages; i++) {
      let btnClass = ''
      if (i == this.currentPage) {
        btnClass = ' is-active'
      }
      btnHTML += `<button class='pagination-page page-num${btnClass}' data-page='${i}'>${i}</button>`
    }
    btnHTML += `<button class='pagination-page pagination-next' data-page='${this
      .currentPage + 1}'><i class="icon-angle-right"></i></button>`
    this.paginationContainer.innerHTML = btnHTML

    this.paginationContainer
      .querySelectorAll('.pagination-page')
      .forEach(el => {
        el.addEventListener('click', Pagination.changePage)
      })
  },
  setupTotalPages() {
    const containers = document.querySelectorAll('.pagination-total-pages')
    containers.forEach(container => {
      container.innerHTML = `Page
    <span class="pagination-current-page">${this.currentPage}</span> of 
    ${this.numberOfPages} <span class="pagination-total-items">(${
        this.totalNumPosts
      } items)</span>`
    })
  },
  setupContentFiltering() {
    if (!this.filterByContentTypes) {
      return
    }

    const checkboxes = document.querySelectorAll(
      '.content-types-filter input[type="checkbox"]'
    )
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', Pagination.filterContent)
    })
  },
  updatePaginationBtns() {
    const oldActiveBtn = this.paginationContainer.querySelector(
      '.page-num.is-active'
    )
    oldActiveBtn.disabled = false
    oldActiveBtn.classList.remove('is-active')

    const newActiveBtn = this.paginationContainer.querySelector(
      '.page-num[data-page="' + this.currentPage + '"]'
    )
    newActiveBtn.disabled = true
    newActiveBtn.classList.add('is-active')

    const prevBtn = this.paginationContainer.querySelector('.pagination-prev')
    prevBtn.disabled = this.currentPage == 1 ? true : false
    prevBtn.setAttribute('data-page', this.currentPage - 1)
    const nextBtn = this.paginationContainer.querySelector('.pagination-next')
    nextBtn.disabled = this.currentPage == this.numberOfPages ? true : false
    nextBtn.setAttribute('data-page', this.currentPage + 1)

    document
      .querySelectorAll('.pagination-current-page')
      .forEach(el => (el.innerHTML = this.currentPage))
  },
  updatePostList() {
    const startVisiblePosts = (this.currentPage - 1) * this.numberPerPage
    const endVisiblePosts = startVisiblePosts + this.numberPerPage

    let postsToFilter = this.postsList

    if (this.selectedContentTypes.length > 0) {
      postsToFilter = []
      this.postsList.forEach(post => {
        const type = post.getAttribute('data-content-type')
        if (this.selectedContentTypes.includes(type)) {
          postsToFilter.push(post)
        } else {
          post.classList.add('is-hidden')
        }
      })
    }

    postsToFilter.forEach((post, i) => {
      if (i == startVisiblePosts) {
        post.classList.add('first-visible-post')
      } else {
        post.classList.remove('first-visible-post')
      }

      if (i >= startVisiblePosts && i < endVisiblePosts) {
        post.classList.remove('is-hidden')
      } else {
        post.classList.add('is-hidden')
      }
    })
  },
  changePage() {
    let pageNum = this.getAttribute('data-page')

    const params = Pagination.getURLParams(window.location.href)
    let paramPrefix = '?'
    let updatedParam = 'page=' + pageNum
    if (params.content_type) {
      paramPrefix = '?content_type=' + params.content_type + '&'
    }
    updatedParam = paramPrefix + updatedParam

    if (history.pushState) {
      history.pushState(null, null, updatedParam)
    } else {
      location.hash = updatedParam
    }
    Pagination.setCurrentPage()
    Pagination.updatePaginationBtns()
    Pagination.updatePostList()
  },
  filterContent() {
    let content_type = this.value
    const index = Pagination.selectedContentTypes.indexOf(content_type)
    if (index !== -1) {
      Pagination.selectedContentTypes.splice(index, 1)
    } else {
      Pagination.selectedContentTypes.push(content_type)
    }

    let updatedParam =
      '?content_type=' + Pagination.selectedContentTypes.join(',')

    if (history.pushState) {
      history.pushState(null, null, updatedParam)
    } else {
      location.hash = updatedParam
    }

    Pagination.getPosts()
    Pagination.setCurrentPage()
    Pagination.setupPaginationBtns()
    Pagination.setupTotalPages()
    Pagination.updatePaginationBtns()
    Pagination.updatePostList()
  },
  getURLParams(url) {
    let params = {}
    const parser = document.createElement('a')
    parser.href = url
    const query = parser.search.substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      params[pair[0]] = decodeURIComponent(pair[1])
    }
    return params
  }
}

function paginationInit() {
  if (!document.querySelector('.archive:not(.no-pagination)')) {
    return
  }

  if (document.querySelector('.content-types-filter')) {
    Pagination.filterByContentTypes = true
    Pagination.getContentTypesFromURL()
    Pagination.selectedContentTypes.forEach(type => {
      document.querySelector(
        '.content-types-filter input[value="' + type + '"]'
      ).checked = true
    })
  }

  Pagination.getPosts()
  Pagination.setCurrentPage()
  Pagination.setupPaginationBtns()
  Pagination.setupTotalPages()
  Pagination.setupContentFiltering()
  Pagination.updatePaginationBtns()
  Pagination.updatePostList()
}

export default paginationInit
