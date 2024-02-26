# Stock Portfolio Analysis App

## Overview
This application allows users to log in, manage their stock portfolio, and get sentiment analysis on their investments based on recent news. The backend is built with Python Django and the frontend with AngularJS.

## Features
- OAuth2 authentication for secure login/signup.
- Dashboard to manage and view stock portfolio.
- Add or edit investment details.
- Customizable settings for user profiles and news source preferences.
- Automated sentiment analysis of stocks based on news articles.

## User Flow
```markdown
1. Login/Signup Page
   |-> OAuth2 Token Exchange
   |-> User Authentication
   ↓
2. Portfolio Dashboard
   |-> Fetch & Display Investments
   |-> Timeframe Selection
   |-> Add/Edit Investments
   |-> Run Analysis
   |-> Navigate to Settings
   ↓
3. Add/Edit Investments
   |-> Update Backend with Investment Data
   ↓
4. Settings Page
   |-> Update Personal Info & News Sources
   ↓
5. Analysis Process
   |-> Fetch & Analyze News
   |-> Update Dashboard with Sentiment




# JWT TOKEN AUTH DJANGO
- pip install rest_framework_simplejwt 
- urls.py `from rest_framework_simplejwt import views as jwt_views`
- urls.py `path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),`
- urls.py `path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh')`
- have a custom user in your models.py
- config your settings.py with a custom user model
- create a custom user and then make an authentication workflow in your front end to request the `api/token` endpoints
- now just add this code to any class view you want to wall off to authenticated users 
   - `permission_classes = [AllowAny]`