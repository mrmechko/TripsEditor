from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^index$', views.index, name='index'),
    url(r'^ontology/$', views.json_type, name='json_type'),
    url(r'^word/$', views.json_get_word, name='json_get_word')
]
