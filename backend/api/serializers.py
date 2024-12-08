from django.contrib.auth.models import User
from rest_framework import serializers
from .models import EnergyAsset, OptimizationResult

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields= ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} 

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class EnergyAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model= EnergyAsset
        fields = ['id', 'name', 'max_capacity', 'cost_per_mwh', 'user']
        extra_kwargs = {'user': {"read_only": True}}

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class OptimizationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptimizationResult
        fields = ['id', 'user', 'demand', 'result', 'total_cost', 'timestamp']
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)