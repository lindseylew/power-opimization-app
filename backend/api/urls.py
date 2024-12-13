from django.urls import path
from . import views

urlpatterns = [
    path('user/create/', views.CreateUserView.as_view(), name='create_user'),
    path('energy-asset/create/', views.CreateEnergyAssetView.as_view(), name='create_energy_asset'),
    path('optimize/save/', views.SaveOptimizationResultsView.as_view(), name='optimize_save'),
    path('weather/forecast/<str:city_name>/', views.WeatherForecastView.as_view(), name='weather_forecast'),
]