from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",
        related_query_name="user",
    )

class Stock(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ticker_name = models.CharField(max_length=10)
    amount_invested = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.ticker_name} : ${self.amount_invested} - {self.user}"

class NewsSource(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    source_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    # Add other necessary fields
