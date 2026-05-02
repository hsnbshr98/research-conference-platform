from rest_framework import viewsets, filters

from .models import Conference
from .serializers import ConferenceSerializer
from apps.authentication.permissions import IsAdminOrReadOnlyAuthenticated


class ConferenceViewSet(viewsets.ModelViewSet):
    queryset = Conference.objects.all()
    serializer_class = ConferenceSerializer
    permission_classes = [IsAdminOrReadOnlyAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location', 'contact_email', 'description']
    ordering_fields = ['name', 'location', 'start_date', 'end_date']