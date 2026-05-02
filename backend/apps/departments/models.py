from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    founded_date = models.DateField(null=True, blank=True)
    contact_email = models.EmailField(blank=True)
    department_image = models.ImageField(
        upload_to='departments/images/',
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name