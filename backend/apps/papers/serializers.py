from rest_framework import serializers
from .models import Paper


class PaperSerializer(serializers.ModelSerializer):
    conference_name = serializers.CharField(source='conference.name', read_only=True)
    authors_names = serializers.StringRelatedField(source='authors', many=True, read_only=True)

    class Meta:
        model = Paper
        fields = '__all__'