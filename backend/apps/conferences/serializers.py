from rest_framework import serializers
from .models import Conference


class ConferenceSerializer(serializers.ModelSerializer):
    organizers_names = serializers.StringRelatedField(source='organizers', many=True, read_only=True)
    attendees_names = serializers.StringRelatedField(source='attendees', many=True, read_only=True)

    class Meta:
        model = Conference
        fields = '__all__'