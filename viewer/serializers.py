from rest_framework import serializers
from viewer.models import Photo, Reading

class PhotoSerializer(serializers.ModelSerializer):
	photo = serializers.ImageField() # try taking this out. may not need it
	class Meta:
		model = Photo
		fields = ('photo',)

class ReadingSerializer(serializers.ModelSerializer):
	class Meta:
		model = Reading
		fields = ('temperature', 'humidity', 'pressure',)