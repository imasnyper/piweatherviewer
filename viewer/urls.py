from django.urls import path
from . import views 

appname = 'viewer'

urlpatterns = [
	path('', views.Home.as_view(), name='home'),
	path('history/', views.History.as_view(), name='history'),
]