from rest_framework import serializers
from .models import InferenceResult

class InferenceResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = InferenceResult
        fields = [
            'id',
            'image',
            'status',
            'category',
            'confidence',
            'labels',
            'created_at',
        ]
