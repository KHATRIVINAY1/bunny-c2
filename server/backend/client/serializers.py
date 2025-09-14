from rest_framework import serializers
from .models import Client, Command
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate


class ClientSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    class Meta:
        model = Client
        fields = ['id', 'pcname', 'ip', 'location', 'access', 'useragent', 'antivirus', 'computer', 'status','process']
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



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')
        
        return data