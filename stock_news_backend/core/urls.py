from . import views

from django.urls import path, include
from django.http import HttpResponse 
from rest_framework_simplejwt import views as jwt_views




urlpatterns = [
    path("", lambda request: HttpResponse("Welcome!")),
    
    # INTERACTION DATABASE 
    path('api/stocks/', views.StockView.as_view(), name='stock_list'),
    path('api/stocks/<int:stock_id>/', views.StockView.as_view(), name='stock_detail'),
    path('api/newssources/', views.NewsSourceViewSet.as_view({'get': 'list'}), name='news_sources'),
    
    path('api/stocks/analyze-stocks/', views.AnalyzeStocksView.as_view(), name='analyze_stocks'),

    # JWT USER AUTH
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', views.CreateUserView.as_view(), name='create_user'),
    path('api/user/', views.CurrentUserView.as_view(), name='current_user'),

    # BROKER PLATFORM INTEGRATION
    path('api/robinhood-import', views.RobinhoodImportView.as_view(), name='robinhood-import'),

]