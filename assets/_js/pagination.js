const Pagination = {
  postsContainer: document.querySelector('.archive'),
  paginationContainer: document.querySelector('.archive-pagination'),
  postsList: null,
  totalNumPosts: 0,
  numberOfPages: 0,
  currentPage: 1,
  numberPerPage: 3,
  getPosts() {
    const posts = this.postsContainer.querySelectorAll('.post-list')
    this.postsList = Array.from(posts)
    this.totalNumPosts = this.postsList.length
    this.numberOfPages = Math.ceil(this.totalNumPosts / this.numberPerPage)
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
      .currentPage - 1}'>Previous</button>`
    for (let i = 1; i <= this.numberOfPages; i++) {
      let btnClass = ''
      if (i == this.currentPage) {
        btnClass = ' is-active'
      }
      btnHTML += `<button class='pagination-page page-num${btnClass}' data-page='${i}'>${i}</button>`
    }
    btnHTML += `<button class='pagination-page pagination-next' data-page='${this
      .currentPage + 1}'>Next</button>`
    this.paginationContainer.innerHTML = btnHTML

    this.paginationContainer
      .querySelectorAll('.pagination-page')
      .forEach(el => {
        el.addEventListener('click', Pagination.changePage)
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
  },
  updatePostList() {
    const startVisiblePosts = (this.currentPage - 1) * this.numberPerPage
    const endVisiblePosts = startVisiblePosts + this.numberPerPage
    for (let i = 0; i <= this.totalNumPosts - 1; i++) {
      if (i >= startVisiblePosts && i < endVisiblePosts) {
        this.postsList[i].classList.add('is-visible')
      } else {
        this.postsList[i].classList.remove('is-visible')
      }
    }
  },
  changePage() {
    let pageNum = this.getAttribute('data-page')
    if (history.pushState) {
      history.pushState(null, null, '?page=' + pageNum)
    } else {
      location.hash = '?page=' + pageNum
    }
    Pagination.setCurrentPage()
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
  if (!document.querySelector('.archive')) {
    return
  }
  Pagination.getPosts()
  Pagination.setCurrentPage()
  Pagination.setupPaginationBtns()
  Pagination.updatePaginationBtns()
  Pagination.updatePostList()
}

export default paginationInit
