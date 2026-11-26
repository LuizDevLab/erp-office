import pytest
from django.contrib.auth.models import AnonymousUser
from rest_framework.test import APIRequestFactory

from apps.contas.models import Usuario
from apps.contas.permissions import EhGestor

pytestmark = pytest.mark.django_db


def requisicao_de(usuario):
    requisicao = APIRequestFactory().get("/")
    requisicao.user = usuario
    return requisicao


def criar(papel: str) -> Usuario:
    return Usuario.objects.create_user(
        email=f"{papel}@exemplo.com", password="x", nome=papel.title(), papel=papel
    )


def test_eh_gestor_permite_gestor():
    assert EhGestor().has_permission(requisicao_de(criar("gestor")), None) is True


def test_eh_gestor_nega_colaborador():
    assert EhGestor().has_permission(requisicao_de(criar("colaborador")), None) is False


def test_eh_gestor_nega_anonimo():
    assert EhGestor().has_permission(requisicao_de(AnonymousUser()), None) is False
