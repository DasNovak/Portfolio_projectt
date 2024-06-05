from django.urls import path
from .views import *
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', views.ProductAPI.as_view()),
    path('cars/<int:pk>/', ProductAPIView.as_view(), name='car'),
    path('userprofiles/', UserProfileListCreateAPIView.as_view(), name='userprofile-list-create'),
    path('userprofiles/<int:pk>/', UserProfileRetrieveUpdateDestroyAPIView.as_view(), name='userprofile-detail'),
    path('ownprofile/', ProfileViewSet.as_view({'get': 'list'}), name='own-profile'),
    path('api/profile/', user_profile, name='profile'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('register/login/', UserLogin.as_view(), name='login'),
    path('logout/', UserLogout.as_view(), name='logout'),
    path('check-auth/', views.CheckAuthentication.as_view(), name='check-auth'),
    path('cars/filter/', CarsFilter.as_view(), name='cars-filter'),
    path('addcars/', CarsCreateAPIview.as_view(), name='cars-list-create'),
    path('userads/<int:user_id>/', views.UserAdsAPIView.as_view(), name='user_ads'),

]

