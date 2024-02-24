from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomUser, Stock, NewsSource
from .serializers import UserSerializer, StockSerializer, NewsSourceSerializer


class StockViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class NewsSourceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  
    queryset = NewsSource.objects.all()
    serializer_class = NewsSourceSerializer

class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Serialize the user information
        serializer = UserSerializer(request.user)
        # Return the serialized user data
        return Response(serializer.data)