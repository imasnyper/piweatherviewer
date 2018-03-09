from django.urls import path
from . import views 

appname = 'viewer'

urlpatterns = [
	path('', views.Index.as_view(), name='index'),
]