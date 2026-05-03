from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Conference
from .serializers import ConferenceSerializer
from apps.researchers.models import Researcher
from apps.authentication.permissions import IsAdminOrReadOnlyAuthenticated


class ConferenceViewSet(viewsets.ModelViewSet):
    queryset = Conference.objects.all()
    serializer_class = ConferenceSerializer
    permission_classes = [IsAdminOrReadOnlyAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location', 'contact_email', 'description']
    ordering_fields = ['name', 'location', 'start_date', 'end_date']

    def get_permissions(self):
        """
        Admin controls creating, updating, and deleting conferences.
        Logged-in researchers can attend or leave conferences.
        """
        if self.action in ['attend', 'leave']:
            return [IsAuthenticated()]

        return [permission() for permission in self.permission_classes]

    @action(detail=True, methods=['post'])
    def attend(self, request, pk=None):
        """
        Add the current user's researcher profile to this conference's attendees.
        A researcher can attend only one conference at a time.
        """
        conference = self.get_object()

        try:
            researcher = request.user.researcher_profile
        except Researcher.DoesNotExist:
            raise PermissionDenied(
                "You must create a researcher profile before attending conferences."
            )

        # Remove this researcher from every other conference first
        Conference.objects.filter(attendees=researcher).exclude(id=conference.id).update()

        for other_conference in Conference.objects.filter(attendees=researcher).exclude(id=conference.id):
            other_conference.attendees.remove(researcher)

        # Add researcher to the selected conference
        conference.attendees.add(researcher)

        return Response(
            {
                "message": "You are now attending this conference."
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """
        Remove the current user's researcher profile from this conference's attendees.
        """
        conference = self.get_object()

        try:
            researcher = request.user.researcher_profile
        except Researcher.DoesNotExist:
            raise PermissionDenied(
                "You do not have a researcher profile."
            )

        conference.attendees.remove(researcher)

        return Response(
            {
                "message": "You have left this conference."
            },
            status=status.HTTP_200_OK
        )