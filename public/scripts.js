// Selected Menu
const currentURL = location.pathname
const menuItems   = document.querySelectorAll("header .links a")

for (item of menuItems) {
  if (currentURL.includes(item.getAttribute("href"))) item.classList.add('active')        
}

// Pagination

function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const twoFirstAndTwoLast = currentPage == 1 ||
                               currentPage == 2 ||
                               currentPage == totalPages ||
                               currentPage == totalPages - 1

    const pageBeforeSelectedPage = currentPage >= selectedPage - 1
    const pageAfterSelectedPage  = currentPage <= selectedPage + 1

    if (totalPages > 7) {
      if(twoFirstAndTwoLast || pageBeforeSelectedPage && pageAfterSelectedPage) {
      
        if (oldPage && currentPage - oldPage >  2) pages.push('...')
  
        if (oldPage && currentPage - oldPage == 2) pages.push(oldPage + 1)
    
        pages.push(currentPage)
        oldPage = currentPage
      }
    } else {
      if(twoFirstAndTwoLast || currentPage == selectedPage) {
      
        if (oldPage && currentPage - oldPage >  2) pages.push('...')
  
        if (oldPage && currentPage - oldPage == 2) pages.push(oldPage + 1)
  
        pages.push(currentPage)
        oldPage = currentPage
      }
    }
  }
  
  return pages
}

function createPagination(pagination) {
  const selectedPage = +pagination.dataset.page
  const totalPages   = +pagination.dataset.total
  const filter       = pagination.dataset.filter

  const pages = paginate(selectedPage, totalPages)

  let elements = ""

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`
    } else {
      if (filter) {
        if (page == selectedPage) {
          elements += `<a class="selected" href="?page=${page}&filter=${filter}">${page}</a>`
        } else {
          elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
        }
      } else {
        if (page == selectedPage) {
          elements += `<a class="selected" href="?page=${page}">${page}</a>`
        } else {
          elements += `<a href="?page=${page}">${page}</a>`
        }
      }
    }
  }

  pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) createPagination(pagination)

//Alert when delete a teacher or student

const formDelete = document.querySelector(".form-delete")
if(formDelete) {
  formDelete.addEventListener("submit", (event) => {
    const confirmation = confirm('Deseja Deletar?')
    if (!confirmation) 
      event.preventDefault()
  })
}