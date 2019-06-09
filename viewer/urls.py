from django.urls import path, include
from . import views 

app_name = 'viewer'

urlpatterns = [
	path('', views.Home.as_view(), name='home'),
	path('history/', views.History.as_view(), name='history'),
	path('gallery/', views.Gallery.as_view(), name='gallery'),
	path('accounts/', include('django.contrib.auth.urls')),
]