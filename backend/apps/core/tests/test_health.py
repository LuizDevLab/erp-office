from unittest.mock import patch

import pytest
from django.db import DatabaseError
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_health_responde_ok_com_banco():
    resposta = APIClient().get("/api/health/")

    assert resposta.status_code == 200
    assert resposta.json() == {"status": "ok", "banco": "ok"}


@pytest.mark.django_db
def test_health_responde_503_sem_banco():
    with patch("apps.core.views.connection.cursor", side_effect=DatabaseError):
        resposta = APIClient().get("/api/health/")

    assert resposta.status_code == 503
    assert resposta.json()["banco"] == "indisponivel"
