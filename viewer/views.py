from django.views import View
from django.shortcuts import render

from viewer.models import Photo, Reading
from viewer.serializers import PhotoSerializer, ReadingSerializer

from rest_framework import generics

AWS_MEDIA_LOCATION = 'https://s3.us-east-2.amazonaws.com/piweatherstation/media/'

# Create your views here.
class Index(View):
	title = "Wasa Wasa Weather"
	template = 'viewer/index.html'
	component = 'bundle.js'

	def get(self, request):
		photos = Photo.objects.all()
		photos = [{
					'location': AWS_MEDIA_LOCATION + p.photo.name,
					'name': p.photo.name,
				  }
				  for p in photos]
		readings = Reading.objects.order_by('date_time')
		readings = [{
						'temperature': r.temperature,
						'humidity': r.humidity,
						'pressure': r.pressure,
						'date_time': str(r.date_time),
					}
					for r in readings]
		props = {
			'test': 'this is my test prop',
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