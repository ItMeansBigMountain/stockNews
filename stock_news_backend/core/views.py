from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomUser, Stock, NewsSource
from .serializers import UserSerializer, StockSerializer, NewsSourceSerializer


# ViewSet for Stocks
class StockViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

# ViewSet for News Sources
class NewsSourceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  
    queryset = NewsSource.objects.all()
    serializer_class = NewsSourceSerializer

# API View for creating a new user
class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)