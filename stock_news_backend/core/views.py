from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomUser, Stock, NewsSource
from .serializers import UserSerializer, StockSerializer, NewsSourceSerializer


class NewsSourceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  
    queryset = NewsSource.objects.all()
    serializer_class = NewsSourceSerializer


class StockView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, stock_id=None):
        if stock_id:
            # Retrieve a single stock associated with the authenticated user
            stock = Stock.objects.filter(user=request.user, id=stock_id).first()
            if stock:
                serializer = StockSerializer(stock)
                return Response(serializer.data)
            else:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Retrieve all stocks associated with the authenticated user
            stocks = Stock.objects.filter(user=request.user)
            serializer = StockSerializer(stocks, many=True)
            return Response(serializer.data)

    def post(self, request):
        # Create a new stock instance with the user and request data
        data = request.data
        
        # Add the user's ID to the data
        data['user'] = request.user.pk  

        serializer = StockSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, stock_id=None):
            if not stock_id:
                return Response({"detail": "Stock ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

            stock = Stock.objects.filter(user=request.user, id=stock_id).first()
            if not stock:
                return Response({"detail": "Stock not found."}, status=status.HTTP_404_NOT_FOUND)

            # Update stock instance with the provided data
            serializer = StockSerializer(stock, data=request.data, partial=True)  # partial=True allows partial update
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, stock_id):
        stock = Stock.objects.filter(user=request.user, id=stock_id).first()
        if stock:
            stock.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Stock not found."}, status=status.HTTP_404_NOT_FOUND)



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