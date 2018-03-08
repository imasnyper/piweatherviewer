from django.urls import path
from . import views 

appname = 'viewer'

urlpatterns = [
	path('', views.index, name='index'),
]