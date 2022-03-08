from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import ModelForm
import json


class User(AbstractUser):
    def serialize(self):
        return{
            'username' : self.username,
            'followers': self.followers
        }
    def __str__(self):
        return self.username
      


class Post(models.Model):
    post_user = models.ForeignKey(User, on_delete=models.CASCADE,                                       related_name='poster', null=True )
    post_txt = models.TextField(max_length=150, verbose_name='')
    post_created = models.DateTimeField(auto_now_add=True)
    post_edited = models.DateTimeField(auto_now=True)
    post_page = models.IntegerField(null=True)
    post_like = models.ManyToManyField(User, blank=True, related_name='likes')
    liked = models.TextField(verbose_name='', blank=True),
    likes_count = models.IntegerField(default=0)
    def serialize(self):
        return {
            'post_user': str(self.post_user),
            'post_id': self.id,
            'post_txt': self.post_txt,
            'post_created': self.post_created.strftime('%b %-d %Y, %-H:%M'),
            'post_page': self.post_page,
            'post_like': str(self.post_like),
            'likes_count': self.likes_count,
            'liked': self.liked,
            'following': self.get_followers()
        }
    
    
    def get_followers(self):
        if(Follower.objects.filter(followers=self.post_user).exists()):
            return 'True'
        return 'False'
    

class Follower(models.Model):
    follower_user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    #followers = models.ManyToManyField(User, blank=True, related_name='followers')
    
    followers = models.ManyToManyField(User, related_name = "followers")
    
    #following = models.ManyToManyField(User, blank=True, related_name='following')
    
    following = models.ManyToManyField(User, related_name = "following")
    
    follower_count = models.IntegerField(default=0)
    follows = models.TextField(verbose_name = '', blank = True)
    follows_count = models.IntegerField(default=0)
    def serialize(self):
        return {
            'follows_count': self.follows_count,
            'follower_count': self.follower_count
        }