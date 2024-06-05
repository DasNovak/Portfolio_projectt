from django.contrib import admin
from .models import Cars, User

admin.site.register(User)


class CarsAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand_mark', 'year', 'price', 'user')
    search_fields = ('name', 'brand_mark', 'year', 'price')
    list_filter = ('brand_mark', 'year', 'price')
    ordering = ('-id',)
    fields = ('name', 'brand_mark', 'year', 'price', 'city', 'description', 'mileage', 'photo', 'parametres', 'user')


admin.site.register(Cars, CarsAdmin)
