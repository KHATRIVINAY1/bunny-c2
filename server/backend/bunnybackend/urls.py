from django.contrib import admin
from django.urls import path, include
from client.views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('client.urls')),  # Include client app URLs
    path('login/',LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
