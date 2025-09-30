from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


# Logged-in user profile
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
from .serializers import ProfileSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  # 👈 Add this
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)
        return Response(serializer.data)

