from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()


# User Registration Serializer
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])  # hash password
        user.save()
        # auto-create profile
        Profile.objects.create(user=user, full_name=user.username)
        return user


# User Serializer (for logged-in user details)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


from .models import Profile
class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = ("id", "user", "full_name", "bio", "skills", "hourly_rate", "availability", "location")
        read_only_fields = ['user'] 