from django.db import models
from apps.researchers.models import Researcher
from apps.conferences.models import Conference


class Paper(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('accepted', 'Accepted'),
        ('published', 'Published'),
        ('rejected', 'Rejected'),
    ]

    title = models.CharField(max_length=250)
    abstract = models.TextField()
    keywords = models.CharField(max_length=250, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    corresponding_email = models.EmailField()

    conference = models.ForeignKey(
        Conference,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='papers'
    )

    authors = models.ManyToManyField(
        Researcher,
        related_name='papers',
        blank=True
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='draft'
    )

    paper_pdf = models.FileField(
        upload_to='papers/pdfs/',
        null=True,
        blank=True
    )

    paper_image = models.ImageField(
        upload_to='papers/images/',
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-publication_date', 'title']

    def __str__(self):
        return self.title