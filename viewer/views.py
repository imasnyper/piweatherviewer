import datetime

from django.urls import reverse
from django.views import View
from django.shortcuts import render
from django.utils import timezone
from django.template import RequestContext
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.conf import settings

from viewer.models import Photo, Reading, StopPhoto
from viewer.serializers import PhotoSerializer, ReadingSerializer, StopPhotoSerializer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from dateutil.relativedelta import relativedelta
import pytz

import pyowm

OWM = pyowm.OWM('76a5e7986bbe8c8521399852dc468f2a')

AWS_MEDIA_LOCATION = 'https://s3.us-east-2.amazonaws.com/piweatherstation/media/'
AWS_STATIC_LOCATION = "https://s3.us-east-2.amazonaws.com/piweatherstation/static/"


def prep_readings(readings):
	# current_timezone = timezone.get_current_timezone()
	readings_prop = []
	for reading in readings:
		# print(reading.date_time)
		# normalized = current_timezone.normalize(reading.date_time.astimezone(current_timezone))
		# print(normalized)
		date_string = reading.date_time.strftime("%Y-%m-%dT%H:%M:%S %z") # 2018-06-05T21:06:01 +0000

		reading_dict = {
							'temperature': reading.temperature,
							'humidity': reading.humidity,
							'pressure': reading.pressure,
							'date_string': date_string,
						}

		readings_prop.append(reading_dict)

	return readings_prop

def prep_photos(photos):
	# current_timezone = timezone.get_current_timezone()
	photos_prop = []
	for photo in photos:
		# normalized = current_timezone.normalize(photo.uploaded_at.astimezone(current_timezone))
		date_string = photo.uploaded_at.strftime("%Y-%m-%dT%H:%M:%S %z")
		
		try:
			photo_dict = {
				'location': photo.photo.url,
				'name': photo.photo.name,
				'thumbnail': photo.thumbnail.url,
				'date_string': date_string,
			}
		except ValueError:
			photo_dict = {
				'location': photo.photo.url,
				'name': photo.photo.name,
				'thumbnail': '',
				'date_string': date_string,
			}
		photos_prop.append(photo_dict)

	return photos_prop

# Create your views here.
class Home(View):
	title = "Wasa Wasa Weather"
	template = 'viewer/base.html'
	component = 'home.js'

	def get(self, request):
		photo = Photo.objects.last()
		if request.user.is_authenticated:
			is_authenticated = True
			name = request.user.first_name
		else:
			is_authenticated = False
			name = None
		if photo:
			photo = {
						'location': photo.photo.url,
						'name': photo.photo.name,
					}
		reading = Reading.objects.last()
		if reading:
			reading = prep_readings([reading])[0]
		else:
			reading = {
				"temperature": None,
				"humidity": None,
				"pressure": None,
				"date_sting": None,
			}
		props = {
			'photo': photo,
			'reading': reading,
			'debug': settings.DEBUG,
			'title': self.title,
			'loginURL': reverse('viewer:login'),
			'logInOut': is_authenticated,
			'name': name,
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
			's3_static': AWS_STATIC_LOCATION,
			'debug': settings.DEBUG,
		}

		return render(request, self.template, context)

class History(View):
	title = "Wasa Wasa Weather - History"
	template = 'viewer/history.html'
	component = 'history.js'

	def get(self, request):
		photos = Photo.objects.all()
		photos = [{
					'location': p.photo.url,
					'name': p.photo.name,
				  }
				  for p in photos]
		if request.user.is_authenticated:
			is_authenticated = True
			name = request.user.first_name
		else:
			is_authenticated = False
			name = None
		start_date = datetime.datetime.utcnow()
		end_date = start_date + relativedelta(
			minutes=-min(start_date.minute%5, start_date.minute%10),
			second=0,
			microsecond=0)
		start_date = start_date + relativedelta(
			months=-1, 
			day=1,
			hour=0,
			minute=0,
			second=0,
			microsecond=0)
		start_date = pytz.timezone("UTC").localize(start_date)
		end_date = pytz.timezone("UTC").localize(end_date)
		readings = prep_readings(
			Reading.objects.filter(
				date_time__range=(
					start_date, end_date)).order_by('-date_time')[::5])
		props = {
			'photos': photos,
			'readings': readings,
			'debug': settings.DEBUG,
			'title': self.title,
			'startDate': start_date.strftime("%Y-%m-%dT%H:%M:%S %z"),
			'endDate': end_date.strftime("%Y-%m-%dT%H:%M:%S %z"),
			'loggedIn': is_authenticated,
			'name': name,
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
			's3_static': AWS_STATIC_LOCATION,
			'debug': settings.DEBUG
		}

		return render(request, self.template, context)


class Gallery(View):
	title = "Wasa Wasa Weather - Gallery"
	template = 'viewer/gallery.html'
	component = 'gallery.js'

	def get(self, request):
		photos = Photo.objects.order_by("-uploaded_at")
		photos = prep_photos(photos)
		print(request.user.is_authenticated)
		if request.user.is_authenticated:
			is_authenticated = True
			name = request.user.first_name
		else:
			is_authenticated = False
			name = None
		props = {
			'photos': photos,
			'debug': settings.DEBUG,
			'title': self.title,
			'loggedIn': is_authenticated,
			'name': name,
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
			's3_static': AWS_STATIC_LOCATION,
			'debug': settings.DEBUG,
		}

		return render(request, self.template, context)


class AddPhoto(generics.CreateAPIView):
	queryset = Photo.objects.all()
	serializer_class = PhotoSerializer


class AddReading(generics.CreateAPIView):
	queryset = Reading.objects.all()
	serializer_class = ReadingSerializer


class IsStopped(generics.RetrieveAPIView):
	serializer_class = StopPhotoSerializer

	def get_object(self):
		now = timezone.now()
		obj = StopPhoto.objects.all().last()
		return obj


class StopPhotoView(generics.CreateAPIView):
	# command to post with curl
	# curl -X POST -F start_date='2018-07-12T16:57' http://127.0.0.1:8000/stopphoto -H 'Authorization: Token 2b9f16cb6b1ffc212f781aa5bfcebb6b1713bb25'

	permission_classes = (IsAuthenticated,)

	queryset = StopPhoto.objects.all()
	serializer_class = StopPhotoSerializer

	def perform_create(self, serializer):
		serializer.save(requested_by=self.request.user)			


