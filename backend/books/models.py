from django.core.validators import MinValueValidator
from django.db import models


class Author(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200)
    publication_year = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1000)]
    )
    isbn = models.CharField(max_length=13, unique=True, null=True, blank=True)
    author = models.ForeignKey(
        Author, on_delete=models.PROTECT, related_name='books'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title