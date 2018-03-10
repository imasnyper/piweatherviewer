from django.db import models
from django.utils import timezone

# Create your models here.
class Photo(models.Model):
	photo = models.ImageField()
	uploaded_at = models.DateTimeField(default=timezone.now())