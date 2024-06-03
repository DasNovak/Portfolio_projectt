from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.decorators import api_view
from rest_framework.exceptions import ParseError
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions, status, mixins, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Cars, User
from .permissions import IsOwnerOrReadOnly
from .serializers import ProductSerializer, UserProfileSerializer, UserProfileLoginSerializer, RefreshTokenSerializer, \
    ProfileSerializer, RegistrationSerializer, OwnProfileSerializer, CarsSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import CarsFilter


class ProductAPI(generics.ListAPIView):
    queryset = Cars.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cars.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class UserProfileListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]


class UserProfileRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]


class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})

        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        user_instance = serializer.save()

        return Response({
            'token': user_instance.token,
            'email': user_instance.email,
            'username': user_instance.username
        }, status=status.HTTP_201_CREATED)


class UserLogin(APIView):
    permission_classes = (AllowAny,)
    # renderer_classes = (UserJSONRenderer,)
    serializer_class = UserProfileLoginSerializer

    def post(self, request):
        user = request.data.get('user', {})

        # Обратите внимание, что мы не вызываем метод save() сериализатора, как
        # делали это для регистрации. Дело в том, что в данном случае нам
        # нечего сохранять. Вместо этого, метод validate() делает все нужное.
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     viewsets.GenericViewSet):

    queryset = User.objects.all()
    serializer_class = OwnProfileSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)


class UserLogout(APIView):
    serializer_class = RefreshTokenSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args):
        sz = self.get_serializer(data=request.data)
        sz.is_valid(raise_exception=True)
        sz.save()
        return Response(status=status.HTTP_204_NO_CONTENT)



class CheckAuthentication(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({"message": "Authenticated"})
        else:
            return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)


class CarsFilter(generics.ListAPIView):
    queryset = Cars.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)
    filter_backends = [DjangoFilterBackend]
    filterset_class = CarsFilter


class CarsCreateAPIview(generics.ListCreateAPIView):
    queryset = Cars.objects.all()
    serializer_class = CarsSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ParseError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserAdsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user_ads = Cars.objects.filter(user=user)
            serializer = CarsSerializer(user_ads, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def user_profile(request):
    if request.user.is_authenticated:
        # Получаем профиль пользователя на основе текущего пользователя
        user_profile = User.objects.filter(user=request.user).first()
        if user_profile:
            # Сериализуем данные профиля пользователя
            serializer = ProfileSerializer(user_profile)
            return Response(serializer.data)
        else:
            return Response({'error': 'User profile not found'}, status=404)
    else:
        return Response({'error': 'User is not authenticated'}, status=401)
