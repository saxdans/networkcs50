function load_profilepage(username){
    let following;
    let profile_user;
    console.log(username)
   fetch(`/profile/${username}`).then(response => response.json())
        .then(result => {
        
       following = result["following"];
       profile_user = result["profile_user"]
       display_followBtn = result["display_followBtn"]
       count_following = result["count_following"]
       count_followers = result["count_followers"]
       
       console.log(typeof display_followBtn)
       if(display_followBtn==="true"){
           console.log(display_followBtn)
           load_follow_button(following, profile_user);
       }
       
       document.querySelector('#followingcount').innerHTML = "Following " + count_following;
       document.querySelector('#followerscount').innerHTML = "Followers " + count_followers;
       
       return result;
    });
   
}

function load_follow_button(following, profile_user){
    console.log(profile_user)
    var btnFollow = document.createElement('input');
      btnFollow.className = 'btn btn-outline-primary buttonColor mx-3 shadow-none';
      btnFollow.type = 'button';
      if(following === 'True'){
          btnFollow.value = 'Unfollow';
      }else{
          btnFollow.value = 'Follow'; 
      }
      btnFollow.id = "btnFollow";
      btnFollow.name = `${profile_user}`;
    document.querySelector('#profile_name').append(btnFollow)
    //return btnFollow
}
