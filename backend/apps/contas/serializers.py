from rest_framework import serializers

from .models import Usuario


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    senha = serializers.CharField(trim_whitespace=False)


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "nome", "email", "papel", "cargo"]
        read_only_fields = fields
