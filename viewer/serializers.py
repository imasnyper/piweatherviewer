from rest_framework import serializers
from viewer.models import Photo, Reading, StopPhoto

class PhotoSerializer(serializers.ModelSerializer):
	photo = serializers.ImageField() # try taking this out. may not need it
	class Meta:
		model = Photo
		fields = ('photo',)

class ReadingSerializer(serializers.ModelSerializer):
	date_time = serializers.DateTimeField()
	class Meta:
		model = Reading
		fields = ('temperature', 'humidity', 'pressure', 'date_time')

class StopPhotoSerializer(serializers.ModelSerializer):
	start_date = serializers.DateTimeField()
	end_date = serializers.DateTimeField(required=False)
	requested_by = serializers.ReadOnlyField(source='requested_by.username')
	class Meta:
		model = StopPhoto
		fields = ('stopped', 'start_date', 'end_date', 'requested_by')