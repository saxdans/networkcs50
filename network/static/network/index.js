document.addEventListener('DOMContentLoaded', function () { 
    // Default action, add pagination panel and 
    // give all posts a page number
    // and then load first page
    document.querySelector('#edit-post-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#create-post-view').style.display = 'none';
    document.querySelector('#message').style.display = 'block';
    document.querySelector('#pagination').style.display = 'none';
    paginate('firstload').then(result => addPagination(1, result["nbrOfPages"], result["postsperpage"])).then(result => load_index(1,'nav-all-posts'));
    
})


function create_post() {    
    //Display create post only
document.querySelector('#profile-view').style.display = 'none';
document.querySelector('#create-post-view').style.display = 'block';
document.querySelector('#index-view').style.display = 'none';
document.querySelector('#pagination').style.display = 'none';
    
}

function load_index(pagenumber, nav_id) {  
console.log(nav_id);
document.querySelector('#edit-post-view').style.display = 'none';
document.querySelector('#create-post-view').style.display = 'none';
document.querySelector('#index-view').style.display = 'none';
document.querySelector('#pagination').style.display = 'none';
let width = 25;
let height = 25;
let innerWidth = width-2;
let innerHeight = height-5;
document.getElementById('index-view').innerHTML = '';
var element = document.createElement('div');
element.className = 'widthHeightRem d-lg-block';
let promise = fetch(`/view_posts/${pagenumber}/${nav_id}`).then(response => response.json()).then(posts => { 
    
      //Logged in user from views:
      logged_in_user = posts["logged_in_user"];
      console.log(logged_in_user);
    
      posts["posts"].forEach(post => {
      
      console.log("here load_index starts");
      console.log(post.likes_count);
      url = post.post_url;
      txt = post.post_txt;
      poster = post.post_user;
      timestamp = post.post_created;
      post_id = post.post_id;
      
      
      // Who posted the post and display of it
      var posterfield = document.createElement('div');
      var posterfield_txt = document.createElement('span');
      posterfield.className = 'mx-auto text-start mb-1 mt-3';
      posterfield_txt.style = `width: ${width}rem;`+'cursor:pointer';
      posterfield.style = `width: ${width}rem;`;
      posterfield_txt.innerHTML = `${poster}`;
      posterfield_txt.name = `${poster}`;
      posterfield_txt.id = 'profile_click';
          //Add a href to view function profile()
      posterfield.href = `{% url 'login' %}`
      posterfield.append(posterfield_txt);
      element.append(posterfield);
          
      //Container for the post
      var container = document.createElement('div');
      container.className = 'card mx-auto p-1 mb-5 mt-3 containerColor';
      container.style = `width:${width}rem; height:${height}rem`;
      //Container with textfield
      var container2 = document.createElement('div');
      container2.className = 'card my-auto mx-auto p-0';
      container2.style = `width:${innerWidth}rem; height:${innerHeight}rem`;
      var item = document.createElement('div');
      item.className = 'overflow:auto card-body border-secondary';
      item.style = `overflow:auto; width:${innerWidth}rem; height:${innerHeight}rem `;
      item.innerHTML = (`${post.post_txt}`);

      container2.append(item);
      container.append(container2);
      element.append(container);

      document.getElementById("index-view").append(element);
          
      //Create div for buttons
      var btncol = document.createElement('div');
      btncol.className = 'container';
      //btncol.className =  'ms-auto mx-3';
      //btncol.style = 'width: 10rem'
      
      var dateandlike = document.createElement('div')
      dateandlike.className = 'row';
      
     //Add date
      var timediv = document.createElement('div');
      timediv.innerHTML = post.post_created;
      timediv.style.fontSize = "10px";
      timediv.className = 'col-6';
      dateandlike.append(timediv);
          
      // Add like button
      btnLike = load_like_button(post_id, post.liked, post);
      btnlike = btnLike;
      
      dateandlike.append(btnLike);
      var likescount = document.createElement('b');
      likescount.innerHTML =`  ${post.likes_count}`;
      likescount.id = 'likescountbtnLike' + `${post_id}`;
      dateandlike.append(likescount)
          
          
      //Add to btncol
      btncol.append(dateandlike);
          
     //Add Edit button if logged in user is same as post_user:
      if (logged_in_user===poster){
              load_edit_button(posterfield, post_id);
      }
      
    //Add buttonpanel
      container.append(btncol); 
      
      });  
  })/*.then(function () {
    window.scrollTo(0, document.body.scrollHeight)
}) */
    
  document.querySelector('#index-view').append(element);
  document.querySelector('#create-post-view').style.display = 'none';
  document.querySelector('#index-view').style.display = 'block';
  //document.querySelector('#message').style.display = 'block';
  document.querySelector('#pagination').style.display = 'block';
  return promise;
}

function load_like_button(id, liked, post) {
    const whiteheart = '#FFFFFF';
    const redheart = '#FF0000';
    var heart = document.createElement('b');
    console.log('loadlikebutton')
    console.log(id)
    heart.innerHTML = '♥ ';
    
    
      if(liked === 'True'){
          heart.value = 'Unlike';
          heart.style.color = `${redheart}`;
         
      }else{
          heart.value = 'Like';
          heart.style.color = `${whiteheart}`;
      }
      heart.id = 'btnLike' + `${id}`;
      console.log(heart.id)
    return heart;
}


