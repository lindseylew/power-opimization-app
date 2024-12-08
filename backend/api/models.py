from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

# Create your models here.
class EnergyAsset(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False)
    max_capacity = models.FloatField(null=False) #MW
    cost_per_mwh = models.FloatField(null=False) #$
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="energy_assets")

    def to_dict(self):
        return {
        'id': self.id,
        'name': self.name,
        'max_capacity': self.max_capacity,
        'cost_per_mwh': self.cost_per_mwh,
        }
    
class OptimizationResult(models.Model):
    id = models.AutoField(primary_key=True)
    demand = models.FloatField(null=False)
    result = models.JSONField(null=True, blank=True)
    total_cost = models.FloatField(null=False)
    timestamp = models.DateTimeField(default=now)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'demand': self.demand,
            'result': self.result,
            'total_cost': self.total_cost,
            'timestamp': self.timestamp.isoformat(),
            'user': self.user.id
        }
