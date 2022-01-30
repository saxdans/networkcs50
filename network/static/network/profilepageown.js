function profilepageown(name){
    
    currentPage=1;
        document.querySelector('#message').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'block';
        document.querySelector('#profile_name').innerHTML = name;
        
        paginate(name).then(result => addPagination(currentPage, result["nbrOfPages"], result["postsperpage"], name)).then(result => load_index(1,name)).then(load_profilepage(name));
}