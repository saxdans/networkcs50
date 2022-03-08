document.addEventListener('click', function (event) {
    let id = event.target.getAttribute('id');
    let name = event.target.name;
    
    if (id===null){
        return false;
    }
    if (id.match('btnLike')){
        const logged_in = JSON.parse(document.getElementById('user_id').textContent);
        console.log(logged_in)
        if (logged_in != null){
            like(id);
        }
        else{
            //variable a in layout.html
         document.location.href = a;

        }
    }
    if (id.match('nav-all-posts')){
        document.querySelector('#edit-post-view').style.display = 'none';
        document.querySelector('#message').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';
        document.querySelector('#message').style.display = 'block';
        currentPage=1;
        paginate().then(result => addPagination(currentPage, result["nbrOfPages"], result["postsperpage"], id)).then(result => load_index(1,'nav-all-posts'));
    }
    if (id.match('nav-following')){
        document.querySelector('#edit-post-view').style.display = 'none';
        document.querySelector('#message').style.display = 'block';
        document.querySelector('#profile-view').style.display = 'none';
        currentPage=1;
        paginate(id).then(result => addPagination(currentPage, result["nbrOfPages"], result["postsperpage"], id)).then(result => load_index(1,'nav-following'));

    }
    if (id.match('nav-create-post')){
        document.querySelector('#edit-post-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';
        create_post();
    }
    if (id.match('btnFollow')){
        
        follow(id, name);
    }
    if (id.match('profile_click')){
        document.querySelector('#edit-post-view').style.display = 'none';
        currentPage=1;
        document.querySelector('#message').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'block';
        document.querySelector('#profile_name').innerHTML = name;
        
        paginate(name).then(result => addPagination(currentPage, result["nbrOfPages"], result["postsperpage"], name)).then(result => load_index(1,name)).then(load_profilepage(name));
    }
},false);
