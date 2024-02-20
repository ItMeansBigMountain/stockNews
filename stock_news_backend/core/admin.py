from django.contrib import admin
from .models import CustomUser, Stock, NewsSource

admin.site.register(CustomUser)
admin.site.register(Stock)
admin.site.register(NewsSource)
