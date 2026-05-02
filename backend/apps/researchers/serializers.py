from rest_framework import serializers
from .models import Researcher


class ResearcherSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Researcher
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }