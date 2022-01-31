from django import forms
from django.forms import ModelForm
from django.forms.widgets import FileInput
from .models import Post

class PostForm(ModelForm):
    class Meta:
        model = Post
        style = 'form-control w-50'
        exclude = []
        widgets = {
            'post_txt': forms.Textarea(attrs={'label':'', 'class': style})
        }