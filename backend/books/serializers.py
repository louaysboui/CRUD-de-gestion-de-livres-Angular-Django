from django.utils import timezone
from rest_framework import serializers

from .models import Author, Book


class BookSerializer(serializers.ModelSerializer):
    # Le front envoie/reçoit le nom de l'auteur sous forme de texte
    author = serializers.CharField(max_length=200)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'publication_year',
            'isbn', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_publication_year(self, value):
        if value > timezone.now().year:
            raise serializers.ValidationError(
                "L'année de publication ne peut pas être dans le futur."
            )
        return value

    def validate_isbn(self, value):
        # Une chaîne vide est traitée comme "pas d'ISBN"
        if value in ('', None):
            return None
        if not value.isdigit() or len(value) not in (10, 13):
            raise serializers.ValidationError(
                "L'ISBN doit contenir 10 ou 13 chiffres."
            )
        return value

    def create(self, validated_data):
        name = validated_data.pop('author').strip()
        author, _ = Author.objects.get_or_create(name=name)
        return Book.objects.create(author=author, **validated_data)

    def update(self, instance, validated_data):
        name = validated_data.pop('author', None)
        if name:
            instance.author, _ = Author.objects.get_or_create(name=name.strip())
        return super().update(instance, validated_data)