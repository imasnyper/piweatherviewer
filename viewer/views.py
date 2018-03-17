from django.views import View
from django.shortcuts import render
from django.utils import timezone

from viewer.models import Photo, Reading
from viewer.serializers import PhotoSerializer, ReadingSerializer

from rest_framework import generics

AWS_MEDIA_LOCATION = 'https://s3.us-east-2.amazonaws.com/piweatherstation/media/'

# Create your views here.
class Home(View):
	title = "Wasa Wasa Weather"
	template = 'viewer/base.html'
	component = 'home.js'

	def get(self, request):
		photo = Photo.objects.last()
		if photo:
			photo = {
						'location': AWS_MEDIA_LOCATION + photo.photo.name,
						'name': photo.photo.name,
					}
		current_timezone = timezone.get_current_timezone()
		reading = Reading.objects.last()
		if reading:
			reading = 	{
							'temperature': reading.temperature,
							'humidity': reading.humidity,
							'pressure': reading.pressure,
							'date_time': str(current_timezone.normalize(reading.date_time.astimezone(current_timezone))),
					   	}
		props = {
			'photos': [photo,],
			'readings': [reading,],
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
		}

		return render(request, self.template, context)

class History(View):
	title = "Wasa Wasa Weather - History"
	template = 'viewer/base.html'
	component = 'history.js'

	def get(self, request):
		photos = Photo.objects.all()
		photos = [{
					'location': AWS_MEDIA_LOCATION + p.photo.name,
					'name': p.photo.name,
				  }
				  for p in photos]
		current_timezone = timezone.get_current_timezone()
		readings = Reading.objects.order_by('-date_time')
		readings = [{
						'temperature': r.temperature,
						'humidity': r.humidity,
						'pressure': r.pressure,
						'date_time': str(current_timezone.normalize(r.date_time.astimezone(current_timezone))),
					}
					for r in readings]
		props = {
			'photos': photos,
			'readings': readings,
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
		}

		return render(request, self.template, context)

class AddPhoto(generics.CreateAPIView):
	queryset = Photo.objects.all()
	serializer_class = PhotoSerializer

class AddReading(generics.CreateAPIView):
	queryset = Reading.objects.all()
	serializer_class = ReadingSerializer