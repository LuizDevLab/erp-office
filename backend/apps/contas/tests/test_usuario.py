import pytest
from django.contrib.auth import authenticate

from apps.contas.models import Usuario

pytestmark = pytest.mark.django_db


def test_create_user_usa_email_como_login_e_papel_colaborador():
    usuario = Usuario.objects.create_user(
        email="ana@exemplo.com", password="senha-de-teste-123", nome="Ana Exemplo"
    )

    assert usuario.papel == Usuario.Papel.COLABORADOR
    assert usuario.ativo is True
    assert usuario.is_staff is False
    assert usuario.is_superuser is False
    assert authenticate(username="ana@exemplo.com", password="senha-de-teste-123") == usuario


def test_create_user_exige_email():
    with pytest.raises(ValueError):
        Usuario.objects.create_user(email="", password="x", nome="Sem Email")


def test_create_superuser_liga_staff_e_superuser():
    admin = Usuario.objects.create_superuser(
        email="suporte@exemplo.com", password="senha-de-teste-123", nome="Suporte"
    )

    assert admin.is_staff is True
    assert admin.is_superuser is True


def test_usuario_inativo_nao_autentica():
    usuario = Usuario.objects.create_user(
        email="bia@exemplo.com", password="senha-de-teste-123", nome="Bia Exemplo"
    )
    usuario.ativo = False
    usuario.save()

    assert authenticate(username="bia@exemplo.com", password="senha-de-teste-123") is None
