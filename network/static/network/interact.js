function like(id) {
    console.log('functionlike')
    console.log(id)
    let status = 0;
    console.log(document.getElementById(id).value);
    fetch(`/like_post/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            btnLikeValue : document.querySelector('#' + `${id}`).value
        })
    }).then(function(response){
        status = response.status;
        console.log(status);
        return response.json()
    }).then(result => {
        likeValue = result["message"];
        likesCount = result["count"];
        heartColor = result["heartColor"];
        console.log(likeValue);
        console.log('interact');
        console.log(likesCount);
        console.log(likeValue);
        console.log(id)
       
        document.querySelector('#likescount' + `${id}`).innerHTML = likesCount;
        document.querySelector('#'+id).value = likeValue;
        document.querySelector(`#${id}`).style.color = heartColor;
    });
}

function follow(btnId, profile_user) {
    let status=0;
    console.log(profile_user)
    fetch(`/follow/${profile_user}`, {
        method: 'PUT',
        headers : { 
        Accept: 'application/json',
        'Content-Type': 'application/json'
       },
        body: JSON.stringify({
            btnFollowValue : document.querySelector('#'+btnId).value
            //profile_user : profile_user
        })
    }).then(function(response){
        status = response.status;
        console.log(status);
        return response.json()
    }).then(result => {
        followValue = result["btnValue"];
        followerCount = result["count"];
        console.log(followValue);
        console.log(followerCount)
        document.querySelector('#btnFollow').value = followValue;
        document.querySelector('#followerscount').innerHTML = "Followers " + followerCount
    });
}