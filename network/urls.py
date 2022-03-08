from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.contrib import admin

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    # API Routes
    path("view_posts/<int:pagenumber>/<str:nav_id>", views.view_posts, name="view_posts"),
    path("post", views.post, name="post"),
    path("set_displayed", views.set_displayed, name="set_displayed"),
    path("paginate/<str:btnId>", views.paginate, name="paginate"),
    path("like_post/<str:id>", views.like_post, name="like_post"),
    path("follow/<str:profile_user>", views.follow, name="follow"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("edit_post/<int:postId>", views.edit_post, name="edit_post"),
    path("save_edit_post/<int:postId>", views.save_edit_post, name="save_edit_post")
    
    #Admin route
    #path('admin/', admin.site.urls)
]
