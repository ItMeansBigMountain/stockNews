from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, Stock, NewsSource
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate(self, data):
        # Check if the username already exists
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
        
        # Check if the email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
        
        return data

    def create(self, validated_data):
        # Hash the user's password
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).create(validated_data)



class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data.get('user')
        ticker_name = validated_data.get('ticker_name')
        amount_invested = validated_data.get('amount_invested')

        # Check if the user already has a stock with the same name
        stock, created = Stock.objects.get_or_create(
            user=user, 
            ticker_name=ticker_name,
            defaults={'amount_invested': amount_invested}
        )

        # If the stock exists (not created), add the new amount to the existing amount
        if not created:
            stock.amount_invested += amount_invested
            stock.save()

        return stock



class NewsSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsSource
        fields = '__all__'
