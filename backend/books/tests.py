from rest_framework import status
from rest_framework.test import APITestCase

from .models import Book


class BookApiTests(APITestCase):
    def setUp(self):
        self.payload = {
            'title': 'Clean Code',
            'author': 'Robert C. Martin',
            'publication_year': 2008,
            'isbn': '9780132350884',
        }

    def create_book(self):
        return self.client.post('/books', self.payload, format='json')

    def test_create_book(self):
        response = self.create_book()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['author'], 'Robert C. Martin')

    def test_list_books(self):
        self.create_book()
        response = self.client.get('/books')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_book(self):
        book_id = self.create_book().data['id']
        self.payload['title'] = 'Clean Code 2nd'
        response = self.client.put(f'/books/{book_id}', self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Clean Code 2nd')

    def test_delete_book(self):
        book_id = self.create_book().data['id']
        response = self.client.delete(f'/books/{book_id}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Book.objects.count(), 0)

    def test_future_year_rejected(self):
        self.payload['publication_year'] = 3000
        response = self.create_book()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_isbn_rejected(self):
        self.create_book()
        response = self.create_book()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_search_by_title_author_and_year(self):
        self.create_book()
        other = {**self.payload, 'title': 'Dune', 'author': 'Frank Herbert',
                 'publication_year': 1965, 'isbn': '9780441172719'}
        self.client.post('/books', other, format='json')

        for term, expected in [('clean', 1), ('herbert', 1), ('1965', 1), ('zzz', 0)]:
            response = self.client.get('/books', {'search': term})
            self.assertEqual(len(response.data), expected, msg=term)

        