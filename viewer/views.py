from django.views import View
from django.shortcuts import render
from django.utils import timezone

from viewer.models import Photo, Reading
from viewer.serializers import PhotoSerializer, ReadingSerializer

from rest_framework import generics

AWS_MEDIA_LOCATION = 'https://s3.us-east-2.amazonaws.com/piweatherstation/media/'
AWS_STATIC_LOCATION = "https://s3.us-east-2.amazonaws.com/piweatherstation/static/"


def prep_readings(readings):
	current_timezone = timezone.get_current_timezone()
	readings_prop = []
	for reading in readings:
		normalized = current_timezone.normalize(reading.date_time.astimezone(current_timezone))
		date_string = normalized.strftime("%Y-%m-%dT%H:%M:%S")

		reading_dict = {
							'temperature': reading.temperature,
							'humidity': reading.humidity,
							'pressure': reading.pressure,
							'date_string': date_string,
						}

		readings_prop.append(reading_dict)

	return readings_prop

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
		reading = prep_readings([Reading.objects.last()])
		props = {
			'photos': [photo,],
			'readings': reading,
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
			's3_static': AWS_STATIC_LOCATION,
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
		
		readings = prep_readings(Reading.objects.order_by('-date_time'))
		props = {
			'photos': photos,
			'readings': readings,
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
			's3_static': AWS_STATIC_LOCATION,
		}

		return render(request, self.template, context)

class AddPhoto(generics.CreateAPIView):
	queryset = Photo.objects.all()
	serializer_class = PhotoSerializer

class AddReading(generics.CreateAPIView):
	queryset = Reading.objects.all()
	serializer_class = ReadingSerializer