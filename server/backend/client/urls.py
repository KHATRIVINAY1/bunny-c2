from django.urls import path
from .views import (ClientListView, ClientEdit, CommandAPI,
                    ClientCommand)

urlpatterns = [
    path('clients/', ClientListView.as_view(), name='client-list'),
    path('clients/<str:id>/', ClientEdit.as_view(), name='client-update'),
    path('commands/', CommandAPI.as_view(), name='command'),
    path('client-commands/<str:client_id>/', ClientCommand.as_view(), name='client-commands'),
]
