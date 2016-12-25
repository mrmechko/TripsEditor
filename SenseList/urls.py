from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^next/$', views.get_one, name='next'),
]
