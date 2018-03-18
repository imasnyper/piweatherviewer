from django.urls import path
from . import views 

app_name = 'viewer'

urlpatterns = [
	path('', views.Home.as_view(), name='home'),
	path('history/', views.History.as_view(), name='history'),
]