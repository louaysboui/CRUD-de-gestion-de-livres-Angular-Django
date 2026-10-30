from rest_framework.routers import DefaultRouter

from .views import BookViewSet

# trailing_slash=False => routes exactes /books et /books/1 comme dans le sujet
router = DefaultRouter(trailing_slash=False)
router.register('books', BookViewSet, basename='book')

urlpatterns = router.urls