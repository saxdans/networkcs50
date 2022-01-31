document.addEventListener('DOMContentLoaded', function (){
  let postbtn = document.querySelector('#post-btn');
  let status = 0;
  
 
  postbtn.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('/post', {
        method: 'POST',
        body: JSON.stringify({
            post_txt: document.querySelector('#post-text').value.replace(/</g, "&lt;")
        })
    }).then(function(response) {
        status = response.status;
        console.log(status);
        return response.json()
    }).then(result => {
        console.log(result.message)
        if(status === 201){
            console.log(status);
            document.querySelector('#post-text').value = "";
            paginate('firstload').then(result => addPagination(1, result["nbrOfPages"], result["postsperpage"])).then(result => load_index(1,'nav-all-posts'));
    }
    });
  })
  
});
    
