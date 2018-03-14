from django.db import models
from django.utils import timezone

# Create your models here.
class Photo(models.Model):
	photo = models.ImageField()
	uploaded_at = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return self.photo.name

	def __repr__(self):
		return self.photo.name

class Reading(models.Model):
	temperature = models.FloatField()
	humidity = models.FloatField()
	pressure = models.FloatField()
	date_time = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return str(self.date_time)

	def __repr__(self):
		return str(self.date_time)