from rest_framework import filters, viewsets

from .models import Book
from .serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    """
    CRUD complet : GET/POST /books, GET/PUT/PATCH/DELETE /books/{id}
    Recherche : GET /books?search=<texte> (titre, auteur, année, ISBN)
    """
    queryset = Book.objects.select_related('author')
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author__name', 'publication_year', 'isbn']