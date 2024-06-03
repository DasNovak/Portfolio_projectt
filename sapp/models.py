import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class Cars(models.Model):
    name = models.CharField(max_length=255, verbose_name="Титул", null=True)
    number_of_post = models.CharField(verbose_name="Номер публикации", null=True)
    brand_mark = models.CharField(null=True, verbose_name="Бренды  марки")
    time_create_update = models.CharField(null=True, auto_created=True, verbose_name="Время создания и обновления")
    description = models.CharField(null=True, verbose_name="Описание")
    mileage = models.CharField(null=True, verbose_name="Пробег")
    year = models.CharField(null=True, verbose_name="Год")
    price = models.IntegerField(verbose_name="Цена", null=True)
    city = models.CharField(null=True, verbose_name="Города")
    photo = models.CharField(verbose_name="Фото", null=True)
    parametres = models.CharField(null=True, verbose_name="Описание техническое")
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='user', verbose_name="Пользователь", null=True)

    class Meta:
        verbose_name = 'Авто'
        verbose_name_plural = 'Авто'
        ordering = ['-id']


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password):
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def token(self):
        return self._generate_jwt_token()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=1)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%S'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token





