from rest_framework import viewsets, filters
from rest_framework.exceptions import PermissionDenied

from .models import Paper
from .serializers import PaperSerializer
from apps.researchers.models import Researcher
from apps.authentication.permissions import IsPaperAuthorOrAdmin


class PaperViewSet(viewsets.ModelViewSet):
    queryset = Paper.objects.all()
    serializer_class = PaperSerializer
    permission_classes = [IsPaperAuthorOrAdmin]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'abstract', 'keywords', 'corresponding_email', 'status']
    ordering_fields = ['title', 'publication_date', 'status']

    def perform_create(self, serializer):
        """
        Only users with a researcher profile can create papers.
        The created paper is automatically linked to that researcher as an author.
        """

        # Admin can create papers normally
        if self.request.user.is_staff:
            serializer.save()
            return

        # Normal users must have a linked researcher profile
        try:
            researcher = self.request.user.researcher_profile
        except Researcher.DoesNotExist:
            raise PermissionDenied(
                "You must create a researcher profile before creating papers."
            )

        # Save the paper
        paper = serializer.save()

        # Strict rule:
        # The normal user cannot choose random authors.
        # The current user's researcher profile becomes the author.
        paper.authors.set([researcher])