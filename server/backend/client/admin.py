from django.contrib import admin

# Register your models here.
from .models import Client,Command

admin.site.register(Client)
admin.site.register(Command)