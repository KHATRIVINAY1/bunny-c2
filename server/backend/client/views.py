from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ClientSerializer, CommandSerializer
from .models import Client, Command
from rest_framework.response import Response
# Create your views here.


class ClientListView(APIView):
    serializer_class = ClientSerializer
    def get(self, request):
        clients = Client.objects.all()
        serializer = self.serializer_class(clients, many=True)
        return Response(serializer.data, status=200)


class ClientEdit(APIView):
    serializer_class = ClientSerializer

    def get(self, request, id):
        try:
            client = Client.objects.get(id=id)
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=404)
        except:
            return Response({"error": "Bad Request"}, status=400)
        
        serializer = self.serializer_class(client)
        return Response(serializer.data, status=200)

    def put(self, request, id):
        try:
            client = Client.objects.get(id=id)
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=404)
        except:
            return Response({"error": "Bad Request"}, status=400)
        
        serializer = self.serializer_class(client, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


class CommandAPI(APIView):
    serializer_class = CommandSerializer

    def get(self, request):
        commands = Command.objects.all()
        serializer = self.serializer_class(commands, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ClientCommand(APIView):
    serializer_class = CommandSerializer

    def get(self, request, client_id):
        try:
            commands = Command.objects.filter(client=client_id)
        except Command.DoesNotExist:
            return Response({"error": "Commands not found for this client"}, status=404)
        
        serializer = self.serializer_class(commands, many=True)
        return Response(serializer.data, status=200)