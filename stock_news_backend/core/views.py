from rest_framework import viewsets
from .models import CustomUser, Stock, NewsSource
from .serializers import UserSerializer, StockSerializer, NewsSourceSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class NewsSourceViewSet(viewsets.ModelViewSet):
    queryset = NewsSource.objects.all()
    serializer_class = NewsSourceSerializer
