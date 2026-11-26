from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import UsuarioManager


class Usuario(AbstractBaseUser, PermissionsMixin):
    class Papel(models.TextChoices):
        COLABORADOR = "colaborador", "Colaborador"
        GESTOR = "gestor", "Gestor"

    email = models.EmailField("e-mail", unique=True)
    nome = models.CharField("nome", max_length=150)
    papel = models.CharField(
        "papel", max_length=20, choices=Papel.choices, default=Papel.COLABORADOR
    )
    cargo = models.CharField("cargo", max_length=100, blank=True)
    ativo = models.BooleanField("ativo", default=True)
    # Acesso ao Django Admin (apoio técnico); a equipe usa as telas do Next.
    is_staff = models.BooleanField("acesso ao admin", default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["nome"]

    class Meta:
        verbose_name = "usuário"
        verbose_name_plural = "usuários"
        ordering = ["nome"]

    def save(self, *args, **kwargs) -> None:
        # E-mail é o login: guardado sempre sem espaços e em minúsculas.
        self.email = (self.email or "").strip().lower()
        super().save(*args, **kwargs)

    @property
    def eh_gestor(self) -> bool:
        return self.papel == self.Papel.GESTOR

    def __str__(self) -> str:
        return self.nome or self.email

    # O Django espera `is_active`; no domínio o campo é `ativo`.
    @property
    def is_active(self) -> bool:  # type: ignore[override]
        return self.ativo

    @is_active.setter
    def is_active(self, valor: bool) -> None:
        self.ativo = valor

    def get_full_name(self) -> str:
        return self.nome

    def get_short_name(self) -> str:
        return self.nome.split(" ")[0] if self.nome else self.email
