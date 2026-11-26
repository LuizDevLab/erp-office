import pytest
from rest_framework.test import APIClient

from apps.contas.models import Usuario

pytestmark = pytest.mark.django_db

SENHA = "senha-de-teste-123"


@pytest.fixture
def usuario():
    return Usuario.objects.create_user(
        email="ana@exemplo.com",
        password=SENHA,
        nome="Ana Exemplo",
        cargo="Assistente fiscal",
    )


def cliente_com_csrf() -> tuple[APIClient, str]:
    """Cliente que exige CSRF, já com o cookie obtido em /api/auth/csrf/."""
    cliente = APIClient(enforce_csrf_checks=True)
    resposta = cliente.get("/api/auth/csrf/")
    assert resposta.status_code == 204
    return cliente, cliente.cookies["csrftoken"].value


def fazer_login(cliente: APIClient, token: str, email: str, senha: str):
    return cliente.post(
        "/api/auth/login/",
        {"email": email, "senha": senha},
        format="json",
        HTTP_X_CSRFTOKEN=token,
    )


# --- login ---


def test_login_ok_devolve_usuario_e_abre_sessao(usuario):
    cliente, token = cliente_com_csrf()

    resposta = fazer_login(cliente, token, "ana@exemplo.com", SENHA)

    assert resposta.status_code == 200
    assert resposta.json()["email"] == "ana@exemplo.com"
    assert cliente.get("/api/auth/me/").status_code == 200


def test_login_ignora_maiusculas_no_email(usuario):
    cliente, token = cliente_com_csrf()

    resposta = fazer_login(cliente, token, "ANA@Exemplo.com", SENHA)

    assert resposta.status_code == 200


def test_login_senha_errada(usuario):
    cliente, token = cliente_com_csrf()

    resposta = fazer_login(cliente, token, "ana@exemplo.com", "errada")

    assert resposta.status_code == 400
    assert resposta.json() == {"detail": "E-mail ou senha inválidos."}


def test_login_usuario_inativo_tem_mesma_resposta(usuario):
    usuario.ativo = False
    usuario.save()
    cliente, token = cliente_com_csrf()

    resposta = fazer_login(cliente, token, "ana@exemplo.com", SENHA)

    assert resposta.status_code == 400
    assert resposta.json() == {"detail": "E-mail ou senha inválidos."}


def test_login_email_inexistente_tem_mesma_resposta():
    cliente, token = cliente_com_csrf()

    resposta = fazer_login(cliente, token, "ninguem@exemplo.com", SENHA)

    assert resposta.status_code == 400
    assert resposta.json() == {"detail": "E-mail ou senha inválidos."}


def test_login_sem_token_csrf_e_rejeitado(usuario):
    cliente = APIClient(enforce_csrf_checks=True)

    resposta = cliente.post(
        "/api/auth/login/", {"email": "ana@exemplo.com", "senha": SENHA}, format="json"
    )

    assert resposta.status_code == 403
    assert cliente.get("/api/auth/me/").status_code == 403


def test_sessao_expira_em_10_horas(usuario):
    cliente, token = cliente_com_csrf()

    resposta = fazer_login(cliente, token, "ana@exemplo.com", SENHA)

    assert int(resposta.cookies["sessionid"]["max-age"]) == 10 * 60 * 60


# --- me ---


def test_me_sem_sessao_responde_403():
    assert APIClient().get("/api/auth/me/").status_code == 403


def test_me_devolve_dados_sem_senha(usuario):
    cliente = APIClient()
    cliente.force_login(usuario)

    dados = cliente.get("/api/auth/me/").json()

    assert dados == {
        "id": usuario.id,
        "nome": "Ana Exemplo",
        "email": "ana@exemplo.com",
        "papel": "colaborador",
        "cargo": "Assistente fiscal",
    }


# --- logout ---


def test_logout_encerra_sessao(usuario):
    cliente = APIClient()
    cliente.force_login(usuario)

    resposta = cliente.post("/api/auth/logout/")

    assert resposta.status_code == 204
    assert cliente.get("/api/auth/me/").status_code == 403


def test_logout_exige_csrf(usuario):
    cliente, token = cliente_com_csrf()
    fazer_login(cliente, token, "ana@exemplo.com", SENHA)

    sem_token = cliente.post("/api/auth/logout/")
    novo_token = cliente.cookies["csrftoken"].value
    com_token = cliente.post("/api/auth/logout/", HTTP_X_CSRFTOKEN=novo_token)

    assert sem_token.status_code == 403
    assert com_token.status_code == 204
