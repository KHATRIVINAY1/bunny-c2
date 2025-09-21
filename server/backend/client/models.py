from django.db import models

# Create your models here.
class Client(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    pcname = models.CharField(max_length=100, blank=True, null=True)
    ip = models.CharField(max_length=45, blank=True, null=True)  # IPv4 and IPv6 supported
    location = models.CharField(max_length=100, blank=True, null=True)
    access = models.CharField(max_length=100, blank=True, null=True)
    useragent = models.CharField(max_length=255, blank=True, null=True)
    antivirus = models.CharField(max_length=100, blank=True, null=True)
    computer = models.CharField(max_length=100, blank=True, null=True)
    process= models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=8,
        choices=STATUS_CHOICES,
        blank=True,
        null=True
    )
    last_seen = models.DateTimeField(auto_now=True)
    sleep_time = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return self.pcname or "Unnamed Client"

class Command(models.Model):
    client = models.CharField(max_length=100, blank=True, null=True)
    command = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)
    read = models.BooleanField(default=False)
    result = models.TextField(default="")
    temp = models.BooleanField(default=False) 

    def __str__(self):
        return f"Command for {self.client} at {self.timestamp}" if self.client else "Unnamed Command"