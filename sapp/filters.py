import django_filters
from .models import Cars


class CarsFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    brand_mark = django_filters.CharFilter(lookup_expr='icontains')
    year = django_filters.CharFilter(field_name='year', lookup_expr='icontains')

    class Meta:
        model = Cars
        fields = ['brand_mark', 'year', 'min_price', 'max_price']
