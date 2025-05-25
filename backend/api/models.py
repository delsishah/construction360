from django.db import models

class InferenceResult(models.Model):
    image = models.ImageField(upload_to='uploads/')
    status = models.CharField(max_length=20)
    category = models.CharField(max_length=20)
    confidence = models.FloatField()
    labels = models.JSONField()  # Requires PostgreSQL or Django 3.1+ with SQLite

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.status} ({self.created_at})"
