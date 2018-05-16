"""piweatherviewer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

from viewer import views

app_name = 'viewer'

urlpatterns = [
	path('', include('viewer.urls')),
	path('api/add_photo', views.AddPhoto.as_view(), name='api_add_photo'),
    path('api/add_reading', views.AddReading.as_view(), name='api_add_reading'),
    path('stopphoto', views.StopPhotoView.as_view(), name='stop_photo'),
    path('api/isstopped', views.IsStopped.as_view(), name='is_stopped'),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)