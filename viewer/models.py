from django.db import models
from django.utils import timezone

# Create your models here.
class Photo(models.Model):
	photo = models.ImageField()
	thumbnail = models.ImageField(default="", blank=True, null=True)
	uploaded_at = models.DateTimeField(default=timezone.now)

	def create_thumbnail(self):
		# original code for this method came from
		# http://snipt.net/danfreak/generate-thumbnails-in-django-with-pil/
		
		# If there is no image associated with this.
		# do not create thumbnail
		if not self.photo:
			return

		from PIL import Image
		from io import BytesIO
		from django.core.files.uploadedfile import SimpleUploadedFile
		import os

		# Set our max thumbnail size in a tuple (max width, max height)
		THUMBNAIL_SIZE = (200,200)

		# DJANGO_TYPE = self.photo.file.content_type

		# if DJANGO_TYPE == 'image/jpeg':
		PIL_TYPE = 'jpeg'
		FILE_EXTENSION = 'jpg'
		# elif DJANGO_TYPE == 'image/png':
		# 	PIL_TYPE = 'png'
		# 	FILE_EXTENSION = 'png'

		# Open original photo which we want to thumbnail using PIL's Image
		image = Image.open(BytesIO(self.photo.read()))

		# Convert to RGB if necessary
		# Thanks to Limodou on DjangoSnippets.org
		# http://www.djangosnippets.org/snippets/20/
		#
		# I commented this part since it messes up my png files
		#
		#if image.mode not in ('L', 'RGB'):
		#    image = image.convert('RGB')

		# We use our PIL Image object to create the thumbnail, which already
		# has a thumbnail() convenience method that contrains proportions.
		# Additionally, we use Image.ANTIALIAS to make the image look better.
		# Without antialiasing the image pattern artifacts may result.
		image.thumbnail(THUMBNAIL_SIZE, Image.ANTIALIAS)

		# Save the thumbnail
		temp_handle = BytesIO()
		image.save(temp_handle, PIL_TYPE)
		temp_handle.seek(0)

		# Save image to a SimpleUploadedFile which can be saved into
		# ImageField
		suf = SimpleUploadedFile(os.path.split(self.photo.name)[-1],
			temp_handle.read(), content_type='image/jpeg')
		# Save SimpleUploadedFile into image field
		self.thumbnail.save('%s_thumbnail.%s'%(os.path.splitext(suf.name)[0],FILE_EXTENSION), suf, save=False)

	def save(self, *args, **kwargs):
		# create a thumbnail
		self.create_thumbnail()
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