from django.contrib import admin

from .models import Post, User, Follower

# Register your models here.
class FollowerAdmin(admin.ModelAdmin):
    list_display = ("follows_count", "follower_count")
    
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username")

admin.site.register(Post)
admin.site.register(Follower, FollowerAdmin)
admin.site.register(User, UserAdmin)
