from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
import re

from .models import User, Post, Follower
from .forms import PostForm

@csrf_exempt
@login_required
def post(request):
    data = json.loads(request.body)
    post = Post(
        post_txt = data.get("post_txt", "").replace('\n', '<br>'),
        post_user = request.user
        )
    post.save()
    return JsonResponse({"message": "posted succesfully"}, status=201)

@csrf_exempt
@login_required
def edit_post(request, postId):
    post = Post.objects.get(pk=postId)
    post_txt = post.post_txt.replace('<br>', '\n')
    return JsonResponse({"post_txt": post_txt})

@login_required
@csrf_exempt
def save_edit_post(request, postId):
    postId = int(postId)
    post = Post.objects.get(pk = postId)
    data = json.loads(request.body)
    post_txt = data.get("post_txt", "")
    post_txt = post_txt.replace('\n', '<br>')
    post.post_txt = post_txt
    post.save()
    return JsonResponse({"message": "edited successfully"}, status = 210)

@csrf_exempt
def index(request):
    #if request.user.is_authenticated:
    return render(request, "network/index.html")
    #return HttpResponseRedirect(reverse('login'))


def set_displayed(request, post_id):
    try:
        post = Post.objects.filter(pk = post_id)
    except:
        return JsonResponse({"error": "Post not found"}, status=404)
    if method == 'PUT':
        data = json.loads(request.parameters)
        post.post_displayed = data['post_displayed']
        post.save()
        return HttpResponse(status=201)
    
def paginate(request, btnId):
    try:
        posts = Post.objects.none()
        # if btnid is a profile username
        if (User.objects.filter(username=btnId).exists()):           
            posts = Post.objects.filter(post_user__username=btnId)
            
            #If btnid is 'nav-following'
        elif btnId == 'nav-following':
            req_user = User.objects.get(pk=request.user.id)
            posts = Post.objects.none()
            following = req_user.following.all()
            for follower in following:
                temp_posts = Post.objects.filter(post_user = follower.follower_user)
                posts = posts|temp_posts
                
        #If btnid is from 'all-posts'
        else:
            posts = Post.objects.all()
        
        posts = posts.order_by("-post_created")  
        postsperpage = 10
        pageindex = 1
        postindex = 1
        while(postindex<len(posts)+1):
            posts[postindex-1].post_page = pageindex
            posts[postindex-1].save()
            
            
            if(postindex % postsperpage == 0) and (len(posts) > postindex):
                pageindex+=1
            if(postindex>len(posts)):
                break
            postindex+=1
        
    except:
        pageindex=0
    return JsonResponse({'nbrOfPages':pageindex,
                         'postsperpage':postsperpage
                        })
    
    
def view_posts(request, pagenumber, nav_id):
    posts = Post.objects.none()
     #Check if click is from profileclick
    if User.objects.filter(username=nav_id).exists():

        posts = Post.objects.filter(post_page = pagenumber).filter(post_user__username=nav_id)
        for post in posts:
            print()
    #Check if click is from nav-following
    elif nav_id == 'nav-following':
            req_user = User.objects.get(pk = request.user.id)
            posts = Post.objects.none()
            following = req_user.following.all()
            for follower in following:
                temp_posts = Post.objects.filter(post_user = follower.follower_user).filter(post_page = pagenumber)
                posts = posts|temp_posts


    # If not, then get all posts
    else:
        
        posts = Post.objects.filter(post_page = pagenumber)
    
    posts = posts.order_by("-post_created")
    
    logged_in_user = request.user.username
    if request.user.is_authenticated:
        logged_in_user = request.user.username
    
    
    if request.user.is_authenticated:
        for post in posts:
            if post in request.user.likes.all():
                post.liked = 'True'
                post.save()
            else:
                post.liked = 'False'
                post.save()
    #if user is not logged in, set all the likes to false
    if not request.user.is_authenticated:
        for post in posts: 
                post.liked = 'False'
                post.save()

    return JsonResponse({"posts":[post.serialize() for post in posts], 'logged_in_user': logged_in_user}, safe=False)


@csrf_exempt
def like_post(request, id):
    
    if request.method == 'PUT':
        idNbr = re.sub('[^0-9]','',id)
        post = Post.objects.get(pk=idNbr)
        likeValue = json.loads(request.body)['btnLikeValue']
        
        if(likeValue=='Like'):
            count = post.likes_count + 1
            request.user.likes.add(post)
            likeValue='Unlike'
            post.liked = 'True'
            postLikesCount = post.likes_count
            heartColor = '#FF0000'
        elif(likeValue=='Unlike'):   
            heartColor = '#FFFFFF'
            count = post.likes_count - 1
            request.user.likes.remove(post)
            likeValue = 'Like'
            post.liked = 'False'
            postLikesCount = post.likes_count
        post.likes_count = count
        post.save()
       
        return JsonResponse({'message': likeValue, 'count': count, 'heartColor': heartColor}, status=203)


@csrf_exempt
def follow(request, profile_user):
    profile_user = User.objects.get(username=profile_user)
    req_user = User.objects.get(pk=request.user.id)
    
    #If there is no follower associated with the user created prior to function call
    if not hasattr(req_user, 'follower'):
        follower = Follower(
        follower_user = req_user
    )
        follower.save()
    #If no follower associated with the profile_user, create one
    if not hasattr(profile_user, 'follower'):
        follower = Follower(
        follower_user = profile_user
    )
        follower.save()
    #Get the value from the like button. "Like" or "Unlike"
    btnValue = json.loads(request.body)['btnFollowValue']
    
   
    if request.method == 'PUT':
        # If there is not user attribute to the follower (requser, 'objectType')
        if(btnValue == 'Follow'):
            #Via the req_users related_name, add to following: the profile_user
            req_user.following.add(profile_user.follower)
            
            #Via the profile_users related_name, add to followers: the req_user
            profile_user.followers.add(req_user.follower)
            
            btnValue = 'Unfollow'
        elif(btnValue == 'Unfollow'):
            #Via the req_users related_name, remove from following: the profile_user
            req_user.following.remove(profile_user.follower)
            #Via the profile_users related_name, remove from followers: the req_user
            profile_user.followers.remove(req_user.follower)
            btnValue = 'Follow'
    
    count = len(profile_user.followers.all())
    return JsonResponse({'btnValue': btnValue, 'count': count})
            

def profile(request, username):
    #Declare variable to display followButton or not
    display_followBtn = 'true'
    if request.user.username==username or not request.user.is_authenticated:
        display_followBtn = 'false'
   
    
    #Get first post of user and from that check follower_count
    profile_user = User.objects.get(username = username)
    count_following = len(profile_user.following.all())
    count_followers = profile_user.followers.count()

    #Declare following button text variable
    following = 'True'
    if request.user.is_authenticated:
        req_user = User.objects.get(username = request.user.username)
        if not req_user.following.filter(follower_user__username=username).exists():
            following = 'False'

    return JsonResponse({'profile_user': username,
                        'following': following,
                         'display_followBtn': display_followBtn,
                         'count_following': count_following,
                         'count_followers': count_followers
                        })
    
    
    
def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            """
            follower = Follower(
                follower_user = user
            )
            
            follower.save()
            """
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
