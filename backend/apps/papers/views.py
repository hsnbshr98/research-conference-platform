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
        Normal users can create papers only if they have a researcher profile.
        The logged-in user's researcher profile is automatically added as the author.
        Normal users cannot choose status or authors manually.
        Admin users can create papers and choose status/authors from the request.
        """

        # Admin can create papers normally
        if self.request.user.is_staff:
            serializer.save()
            return

        # Normal users must have a researcher profile
        try:
            researcher = self.request.user.researcher_profile
        except Researcher.DoesNotExist:
            raise PermissionDenied(
                "You must create a researcher profile before creating papers."
            )

        # Force normal-user paper status to draft
        # Even if the frontend/Postman sends accepted/rejected/published, it is ignored.
        paper = serializer.save(status='draft')

        # Force the current researcher as the only author
        paper.authors.set([researcher])

    def perform_update(self, serializer):
        """
        Admin users can update all paper fields, including status and authors.
        Normal users can update only paper information.
        Normal users cannot change status or authors.
        """

        paper = self.get_object()

        # Admin can update everything, including status and authors
        if self.request.user.is_staff:
            serializer.save()
            return

        # Save old protected values before update
        old_status = paper.status
        old_authors = list(paper.authors.all())

        # Save allowed paper fields
        updated_paper = serializer.save()

        # Restore protected fields for normal users
        updated_paper.status = old_status
        updated_paper.save(update_fields=['status'])
        updated_paper.authors.set(old_authors)