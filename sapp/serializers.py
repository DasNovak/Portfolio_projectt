from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Cars, User
from django.utils.text import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cars
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'token']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {
        'bad_token': _('Token is invalid or expired')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')


class UserProfileLoginSerializer(serializers.Serializer):
        id = serializers.CharField(max_length=255, read_only=True)
        email = serializers.CharField(max_length=255)
        username = serializers.CharField(max_length=255, read_only=True)
        password = serializers.CharField(max_length=128, write_only=True)
        token = serializers.CharField(max_length=255, read_only=True)

        def validate(self, data):
            email = data.get('email', None)
            password = data.get('password', None)

            if email is None:
                raise serializers.ValidationError(
                    'An email address is required to log in.'
                )

            if password is None:
                raise serializers.ValidationError(
                    'A password is required to log in.'
                )

            user = authenticate(username=email, password=password)

            if user is None:
                raise serializers.ValidationError(
                    'A user with this email and password was not found.'
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    'This user has been deactivated.'
                )

            return {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'token': user.token
            }


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserProfileLogoutSerializer(serializers.Serializer):
        refresh = serializers.CharField()


class UserProfileDetailSerializer(serializers.ModelSerializer):
    cars = serializers.PrimaryKeyRelatedField(many=True, queryset=Cars.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'cars']


class OwnProfileSerializer(serializers.HyperlinkedModelSerializer):
    user_url = serializers.HyperlinkedIdentityField(view_name='user-detail')
    user = serializers.ReadOnlyField(source='user.id')
    id = serializers.IntegerField(source='pk', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email')

    class Meta:
        model = User
        depth = 1
        fields = ('id', 'username', 'email')

    def get_full_name(self, obj):
        request = self.context['request']
        return request.user.get_full_name()

    def update(self, instance, validated_data):
        # retrieve the User
        user_data = validated_data.pop('user', None)
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)

        # retrieve Profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.user.save()
        instance.save()
        return instance


class CarsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cars
        fields = "__all__"

