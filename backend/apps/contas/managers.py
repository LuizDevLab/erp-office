from typing import Any

from django.contrib.auth.base_user import BaseUserManager


class UsuarioManager(BaseUserManager):
    use_in_migrations = True

    def _criar(self, email: str, password: str | None, **campos: Any):
        if not email:
            raise ValueError("Informe o e-mail.")
        usuario = self.model(email=self.normalize_email(email), **campos)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_user(self, email: str, password: str | None = None, **campos: Any):
        campos.setdefault("is_staff", False)
        campos.setdefault("is_superuser", False)
        return self._criar(email, password, **campos)

    def create_superuser(self, email: str, password: str | None = None, **campos: Any):
        campos.setdefault("is_staff", True)
        campos.setdefault("is_superuser", True)
        if campos["is_staff"] is not True or campos["is_superuser"] is not True:
            raise ValueError("Superusuário precisa de is_staff=True e is_superuser=True.")
        return self._criar(email, password, **campos)
