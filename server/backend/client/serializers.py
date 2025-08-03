from rest_framework import serializers
from .models import Client, Command

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'pcname', 'ip', 'location', 'access', 'useragent', 'antivirus', 'computer', 'status']
        read_only_fields = ['id']

class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Command
        fields = ['id', 'client', 'command', 'timestamp', 'status']
        read_only_fields = ['id', 'timestamp']