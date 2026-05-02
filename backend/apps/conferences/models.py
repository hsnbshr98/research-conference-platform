from django.db import models
from apps.researchers.models import Researcher


class Conference(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField()
    contact_email = models.EmailField(blank=True)

    organizers = models.ManyToManyField(
        Researcher,
        related_name='organized_conferences',
        blank=True
    )

    attendees = models.ManyToManyField(
        Researcher,
        related_name='attended_conferences',
        blank=True
    )

    conference_image = models.ImageField(
        upload_to='conferences/images/',
        null=True,
        blank=True
    )

    proceedings_document = models.FileField(
        upload_to='conferences/documents/',
        null=True,
        blank=True
    )

    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.name