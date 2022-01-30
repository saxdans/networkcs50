function load_edit_button(posterfield, post_id){
    var btnEdit = document.createElement('input');
    btnEdit.className = 'btn-sm btn-outline-none buttonColor float-right';
    btnEdit.type = 'button';
    btnEdit.value = 'Edit';
    btnEdit.addEventListener("click", function(event){
        edit_post(post_id);
        event.preventDefault();
    })
    posterfield.append(btnEdit)
}

function edit_post(postId){
    create_post();
    
    document.querySelector('#create-post-view').style.display = 'none';
    document.querySelector('#edit-post-view').style.display = 'block';
    let editbtn = document.querySelector('#edit-post-btn');
    document.querySelector('#profile-view').style.display = 'none';
    fetch(`/edit_post/${postId}`).then(post => post.json()).then(post => {
              post_txt = post["post_txt"];
              document.querySelector('#edit-post-text').value = post_txt;
              console.log(post_txt);
              return post_txt;
              });
    document.querySelector('#edit-post-view').value = `${postId}`;
    
    
}

function save_edit_post(){
    let postId = document.querySelector('#edit-post-view').value;
    fetch(`/save_edit_post/${postId}` , {
                method: 'POST',
                body: JSON.stringify({
                    post_txt: document.querySelector('#edit-post-text').value.replace(/</g, "&lt;")
                })
            }).then(function(response) {
                return response.json()   
            }).then(result => {
               
                console.log(status);
            document.querySelector('#edit-post-text').value = "";
            paginate('firstload').then(result => addPagination(1, result["nbrOfPages"], result["postsperpage"])).then(result => load_index(1,'nav-all-posts'));
            document.querySelector('#edit-post-view').style.display = 'none';
            
            });
}