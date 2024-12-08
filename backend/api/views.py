from rest_framework.views import APIView
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import EnergyAsset, OptimizationResult
from .serializers import EnergyAssetSerializer, OptimizationResultSerializer
from .utils import optimize_cost
# Create your views here.


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreateEnergyAssetView(generics.CreateAPIView):
    queryset = EnergyAsset.objects.all()
    serializer_class = EnergyAssetSerializer
    permission_classes = [IsAuthenticated]

class SaveOptimizationResultsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        result = optimize_cost(data)

        if 'total_cost' not in result or 'allocations' not in result:
            return Response(
                {"error": "Optimization result is incomplete or infeasible."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        total_cost = result['total_cost']
        allocations = result['allocations']

        optimization_data = {
            'demand': data['demand'],
            'result': allocations,
            'total_cost': total_cost,
        }

        serializer = OptimizationResultSerializer(data=optimization_data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)