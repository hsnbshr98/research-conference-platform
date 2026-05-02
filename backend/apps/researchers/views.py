from rest_framework import viewsets, filters, parsers
#from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

from .models import Researcher
from .serializers import ResearcherSerializer
from apps.authentication.permissions import IsResearcherOwnerOrAdmin

class ResearcherViewSet(viewsets.ModelViewSet):

    queryset = Researcher.objects.all()
    serializer_class = ResearcherSerializer
    permission_classes = [IsResearcherOwnerOrAdmin]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'academic_rank', 'department__name']
    ordering_fields = ['first_name', 'last_name', 'email', 'date_of_birth', 'academic_rank']

    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def perform_create(self, serializer):
        """
        Normal users can create only one researcher profile for themselves.
        Admin can create researcher profiles too.
        """
        if self.request.user.is_staff:
            serializer.save()
            return

        if Researcher.objects.filter(user=self.request.user).exists():
            raise PermissionDenied("You already have a researcher profile.")

        serializer.save(user=self.request.user)