from rest_framework.routers import DefaultRouter
from . import views

from django.urls import path, include
from django.http import HttpResponse 
from rest_framework_simplejwt import views as jwt_views



router = DefaultRouter()
router.register(r'stocks', views.StockViewSet)
router.register(r'newssources', views.NewsSourceViewSet)

urlpatterns = [
    path("", lambda request: HttpResponse("Welcome!")),
    
    # DATABASE 
    path("api/", include(router.urls)), 
    
    # JWT AUTH
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    path('api/users/', views.CreateUserView.as_view(), name='create_user'),

]



