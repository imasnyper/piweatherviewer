import os
import os.path

from django.db import models
from django.utils import timezone
from PIL import Image

# Create your models here.
class Photo(models.Model):
	photo = models.ImageField()
	thumbnail = models.ImageField(default="", blank=True, null=True)
	uploaded_at = models.DateTimeField(default=timezone.now)

	def save(self, *args, **kwargs):
		super(Photo, self).save(*args, **kwargs)
		if self.photo:
			file, ext = os.path.splitext(self.photo.path)
			thumb = Image.open(self.photo.path)
			thumb.thumbnail((128, 128))
			thumb.save(file + "-thumbnail.jpg", "JPEG")
			self.thumbnail = os.path.split(file)[1] + "-thumbnail.jpg"
		super(Photo, self).save(*args, **kwargs)

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