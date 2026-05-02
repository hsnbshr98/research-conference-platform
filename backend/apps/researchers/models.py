from django.db import models
from django.contrib.auth.models import User
from apps.departments.models import Department


class Researcher(models.Model):
    ACADEMIC_RANK_CHOICES = [
        ('assistant', 'Assistant Professor'),
        ('associate', 'Associate Professor'),
        ('professor', 'Professor'),
        ('lecturer', 'Lecturer'),
        ('student', 'Graduate Student'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='researcher_profile',
        null=True,
        blank=True
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    academic_rank = models.CharField(
        max_length=30,
        choices=ACADEMIC_RANK_CHOICES,
        default='student'
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='researchers'
    )
    profile_picture = models.ImageField(
        upload_to='researchers/images/',
        null=True,
        blank=True
    )
    cv_document = models.FileField(
        upload_to='researchers/cvs/',
        null=True,
        blank=True
    )
    biography = models.TextField(blank=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"