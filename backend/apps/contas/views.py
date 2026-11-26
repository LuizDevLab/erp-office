from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, UsuarioSerializer

MENSAGEM_LOGIN_INVALIDO = "E-mail ou senha inválidos."


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    """Grava o cookie `csrftoken` para o front usar no login."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        # O DRF só checa CSRF para usuário autenticado; no login checamos explicitamente
        # para evitar login CSRF (D25).
        SessionAuthentication().enforce_csrf(request)

        dados = LoginSerializer(data=request.data)
        dados.is_valid(raise_exception=True)
        usuario = authenticate(
            request,
            username=dados.validated_data["email"],
            password=dados.validated_data["senha"],
        )
        if usuario is None:
            # Mesma resposta para senha errada, e-mail inexistente ou usuário inativo.
            return Response({"detail": MENSAGEM_LOGIN_INVALIDO}, status=status.HTTP_400_BAD_REQUEST)

        login(request, usuario)
        return Response(UsuarioSerializer(usuario).data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(UsuarioSerializer(request.user).data)
