from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^json/ontology/$', views.json_type, name='json_type'),
    url(r'^json/word/$', views.json_get_word, name='json_get_word')
]
