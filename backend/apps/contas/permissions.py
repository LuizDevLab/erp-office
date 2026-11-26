"""Classes de permissão por papel (tabela em docs/02-regras-de-negocio.md).

As permissões de objeto (dono da demanda, carteira da empresa) entram junto com
os endpoints que as usam.
"""

from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class EhGestor(BasePermission):
    message = "Ação permitida apenas para gestor."

    def has_permission(self, request: Request, view: APIView) -> bool:
        usuario = request.user
        return bool(usuario and usuario.is_authenticated and usuario.eh_gestor)
