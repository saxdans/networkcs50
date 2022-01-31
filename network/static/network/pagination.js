  // Assign page number to posts
  var currentPage=1;
  function paginate(id) {

  var nbrOfPages;
  var postsperpage;
  var promise = fetch(`/paginate/${id}`).then(response => response.json()).then(result => {
      nbrOfPages = result["nbrOfPages"];
      postsperpage = result["postsperpage"];
      console.log(nbrOfPages)
      return result;
  });
    console.log('paginatefetch')
    console.log(nbrOfPages)
    return promise;
  }

  // Create the pagination menu
  function pagepointer(direction, nbrOfPages, index, postsperpage, clickType) {
    console.log("PagepointerFunction")
    console.log(clickType)
    console.log(postsperpage)
    console.log(nbrOfPages)
    var arrow = document.createElement('li');
    arrow.className= 'page-link';
    arrow.id = `${direction}`;
    let char = '';
    
    
    if(direction === 'previous') {
        char = '<';
        
    } else if(direction === 'next'){
        char = '>';
    }
    
    arrow.innerHTML = char;

    let nextPage = 1;
    arrow.onclick = function(event){
        if(this.id === 'next'){
            nextPage = currentPage + 1;
            if (nextPage>nbrOfPages){
                nextPage =nbrOfPages;
            }else{
                currentPage += 1;
                
                if(currentPage+4 > nbrOfPages){
                    addPagination(currentPage-1, nbrOfPages, postsperpage, clickType);
                    load_index(nextPage, clickType);
                }else{
                addPagination(index+1, nbrOfPages, postsperpage, clickType);
                load_index(nextPage, clickType);
                }
            }
        }
        if(this.id === 'previous'){
            nextPage = currentPage - 1;
            if(nextPage<1){
                currentPage = 1;
            }else{
                currentPage -= 1;
                console.log(index);
                if(currentPage-3 < 1){
                    addPagination(1,nbrOfPages, postsperpage, clickType);
                    load_index(nextPage, clickType);
                }else{
                console.log(index);
                console.log(index-3);
                addPagination(currentPage-1, nbrOfPages, postsperpage, clickType);
                load_index(nextPage, clickType);
                }
            }
        }
    }
    return Promise.resolve(arrow);
  }

  function addPagination(index, nbrOfPages, postsperpage, clickType) {
    let ppp = postsperpage;
    console.log("addPagination")
    console.log(nbrOfPages)
    console.log(currentPage);
    document.querySelector('#paginationlist').innerHTML = '';
    console.log(index);
    pagepointer('previous',nbrOfPages,parseInt(index), ppp, clickType).then(arrow => {
    document.querySelector('#paginationlist').append(arrow);
    if(index === 0){
        index++;
    }
    for (i=index; i<index+ppp && i<=nbrOfPages; i++){
        var paginator = document.createElement('li');
        paginator.className= 'page-link';
        paginator.id = i;
        paginator.href = i;
        paginator.innerHTML = i;
        if(i===currentPage){
            paginator.classList.add('currentPageColor');
        }else{
        paginator.onclick = function(event){
            currentPage = parseInt(this.id);
            addPagination(Math.floor(currentPage/ppp)*ppp, nbrOfPages, ppp, clickType);
            console.log('math.floor')
            console.log(Math.floor(currentPage/ppp)*ppp)
            load_index(this.id, clickType);
            }
        }
        document.querySelector('#paginationlist').append(paginator);
    }
    }).then(pagepointer('next', nbrOfPages, parseInt(index), ppp, clickType).then(arrow => {
            document.querySelector('#paginationlist').append(arrow);    
        }));
  }
  
  