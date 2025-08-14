from rest_framework import serializers
from .models import Client, Command
from django.utils import timezone
from datetime import timedelta

class ClientSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    class Meta:
        model = Client
        fields = ['id', 'pcname', 'ip', 'location', 'access', 'useragent', 'antivirus', 'computer', 'status']
        read_only_fields = ['id']
    
    def get_status(self, obj):
        now = timezone.now()
        if (now - obj.last_seen) <= timedelta(seconds=70):
            return "active"
        else:
            return "inactive"



class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Command
        fields = ['id', 'client', 'command', 'timestamp', 'status', 'read']
        read_only_fields = ['id', 'timestamp']