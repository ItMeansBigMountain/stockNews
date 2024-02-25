# DJANGO
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomUser, Stock, NewsSource
from .serializers import UserSerializer, StockSerializer, NewsSourceSerializer

# ANALYSIS
import json
from . import watson_service as watson
import requests as api_requests
import random
from django.utils import timezone 


# BROKER INTEGRATION
import robin_stocks.robinhood as robin



# SECRETS
import configparser
config = configparser.ConfigParser()
config.read('secrets.ini')


# WATSON API
client = watson.login()



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




class AnalyzeStocksView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # https://newsapi.org/v2/everything?q=bitcoin&from=2022-09-01&to=2022-09-10&sortBy=publishedAt&apiKey=790450dc81754535b73030ac37a0427b

        # https://gnews.io/api/v4/search?q=bitcoin&from=2022-09-01T00:00:00Z&to=2022-09-10T23:59:59Z&token=YOUR_API_KEY

        # https://api.currentsapi.services/v1/search?keywords=bitcoin&start_date=2022-09-01&end_date=2022-09-10&apiKey=YOUR_API_KEY

        # https://api.thenewsapi.com/v1/news/all?api_token=YOUR_API_TOKEN&search=bitcoin&from=2023-01-01&to=2023-02-01

        # http://api.mediastack.com/v1/news?access_key=YOUR_ACCESS_KEY&keywords=bitcoin&languages=en&date=2023-01-01,2023-02-01

        # https://newsdata.io/api/1/news?apikey=YOUR_API_KEY&q=bitcoin&from_date=2023-01-01&to_date=2023-02-01

        # https://api.newscatcherapi.com/v2/search?q=bitcoin&from=2023-01-01&to=2023-02-01


        # WATSON-NEWS ANALYSIS
        print(F"******** STARTING ANALYSIS FOR USER: {request.user} ********")
        stocks_data = request.data.get('stocks', [])
        analysis_results = {}
        averages = {}

        for stock in stocks_data:
            print(F"Fetching news for {request.user}\'s stock: {stock.get('ticker_name')} ")

            topic = stock.get("ticker_name")
            
            # FETCH NEWS ARTICLES FOR EACH STOCK
            data = api_requests.get(f"https://newsapi.org/v2/everything?q={topic}&apiKey=8d8d3c2292a84a44842d0b3ee0f32d6a").json()
            
            # ANALYIZE NEWS ARTICLES 
            count = 0
            for news_article_json in data["articles"]:
                count += 1
                print(F"{request.user}\'s {topic} Article: {news_article_json.get('title')} - {count}")

                debug = news_article_json.get("title") + "\n" + news_article_json.get("content")
                nlu = watson.analyzeText(client, debug)

                news_article_json["nlu"] = nlu
                if analysis_results.get(topic):
                    analysis_results[topic].append(news_article_json)
                else:
                    analysis_results[topic] = [news_article_json]

        # AVERAGE OUT THE ANALYSIS LIST
        average_scores = {}
        for stock, articles in analysis_results.items():
            sentiment_total = 0
            emotion_totals = {'sadness': 0, 'joy': 0, 'fear': 0, 'disgust': 0, 'anger': 0}
            sentiment_count = len(articles)
            emotion_count = len(articles)
            
            # Process each article
            for article in articles:
                nlu = json.loads(article['nlu'])
                sentiment_total += nlu['sentiment']['document']['score']
                # print("\n\n\n")
                # print(nlu)
                # print("\n\n\n")
                if "warnings" not in nlu.keys():
                    for emotion, score in nlu['emotion']['document']['emotion'].items():
                        emotion_totals[emotion] += score
                else:
                    emotion_count -= 1

            # Calculate averages
            average_sentiment = sentiment_total / sentiment_count
            average_emotions = {emotion: total / emotion_count for emotion, total in emotion_totals.items()}
            
            # Store the averages
            average_scores[stock] = {'sentiment': average_sentiment, 'emotions': average_emotions}


        # SAVE RESULTS INTO DATABASE
        for ticker_name, averaged_data in average_scores.items():
            user_stocks = Stock.objects.filter(user=request.user, ticker_name=ticker_name)
            for stock in user_stocks:
                stock.analysis_data = averaged_data
                stock.last_analysis_date = timezone.now()  # Set to current time
                stock.save()  # Save the updated information


        # DEBUG
        with open("analysis.json", "w") as f:
            json.dump(analysis_results , f)
        with open("averages.json", "w") as f:
            json.dump(average_scores , f)

        # Retrieve all stocks associated with the authenticated user
        stocks = Stock.objects.filter(user=request.user)
        serializer = StockSerializer(stocks, many=True)

        # return Response(analysis_results)
        # return Response(average_scores)
        return Response(serializer.data)



class RobinhoodImportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # RobinHood Login
        robin.logout()
        username = request.data.get("username")
        password = request.data.get("password")
        robin.login(username=username, password=password, expiresIn=3600, store_session=False)

        # ACCOUNT DETAILS
        user_robinhood_account = robin.build_user_profile()
        user_robinhood_stocks  = robin.build_holdings(with_dividends=True)

        # print(user_robinhood_account)
        # print(user_robinhood_stocks)

        for stock , data in user_robinhood_stocks:
            stock_serializer = StockSerializer(data=data)
            if stock_serializer.is_valid():
                stock_serializer.save(user=request.user)
            else:
                return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        # UPDATE USER INFORMATION
        user = request.user 
        user.equity = float(user_robinhood_account.get("equity", 0))
        user.cash = float(user_robinhood_account.get("cash", 0))
        user.dividend_total = float(user_robinhood_account.get("dividend_total", 0))
        user.save()
        
        return Response({'message': 'Stocks imported successfully'}, status=status.HTTP_200_OK)