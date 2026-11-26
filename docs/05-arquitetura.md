# 05 — Arquitetura

## Visão geral

```
navegador ──► Next.js (frontend, :3000)
                 │  rewrites /api/* e /admin/*
                 ▼
              Django + DRF (backend, :8000) ──► PostgreSQL (:5432)
```

O Next.js faz **proxy** de `/api/*` para o Django. Assim, frontend e API ficam na **mesma origem**: a sessão por cookie e o CSRF funcionam sem configurar CORS.

## Backend — Django + DRF
- Python 3.12+, Django (LTS atual), Django REST Framework, django-filter, psycopg 3
- **Autenticação:** sessão do Django (cookie httpOnly) + CSRF. Endpoints: `POST /api/auth/login/`, `POST /api/auth/logout/`, `GET /api/auth/me/`
- **Permissões:** classes de permissão do DRF que implementam a tabela de `02-regras-de-negocio.md`, com testes
- **Regras de negócio em serviços** (`services.py` de cada app), não em views nem em serializers:
  - `obrigacoes.services.abrir_competencia(ano, mes, usuario)`
  - `obrigacoes.services.calcular_vencimento(empresa, tipo, competencia)` (usa a sobrescrita da `RegraRegime` que casa com a empresa, se houver)
  - `obrigacoes.services.sugerir_obrigacoes(empresa)`
  - `demandas.services.gerar_recorrencias(competencia)`
- Django Admin disponível só para superusuário (apoio técnico). A equipe usa as telas do Next.
- Testes: pytest + pytest-django. Lint/format: ruff.

### Estrutura
```
backend/
  manage.py
  config/            # settings (base/dev/prod), urls, wsgi
  apps/
    contas/
    empresas/
    obrigacoes/
    demandas/
  pyproject.toml
```

## Frontend — Next.js
- App Router + TypeScript `strict` + Tailwind CSS (tokens de `04-telas.md` no tema)
- Dados: **TanStack Query** chamando `/api/*` (cliente fino em `lib/api.ts`, que envia o header CSRF)
- Formulários: react-hook-form + zod
- Proteção de rotas: arquivo `proxy.ts` do Next (no Next 16, o antigo `middleware` passou a se chamar `proxy`) redireciona para `/login` sem sessão
- Sem biblioteca de componentes pesada. Componentes próprios simples (Button, Card, Badge, Table, Drawer).

### Estrutura
```
frontend/
  app/
    (auth)/login/
    (app)/layout.tsx       # barra lateral
    (app)/page.tsx         # Visão geral
    (app)/competencia/[periodo]/
    (app)/demandas/
    (app)/equipe/
    (app)/empresas/
    (app)/configuracoes/
  components/
  lib/
  public/logo-ta.png
```

## Banco — PostgreSQL
- Versão estável atual, em container com volume persistente
- **Backup diário** com `pg_dump`, guardado **fora da máquina que roda o sistema**, com teste de restauração. O destino é definido na Fase 6 junto com a hospedagem (ver D18 em `decisoes.md`)
- Migrações sempre pelo Django; nada de SQL manual no banco de produção

## Ambiente
- `docker-compose.yml` com `db`, `backend` e `frontend`; `.env` (fora do git) e `.env.example`
- Variáveis mínimas (ver `.env.example`): `DATABASE_URL`, `DJANGO_SETTINGS_MODULE`, `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `BACKEND_URL`, `POSTGRES_DB/USER/PASSWORD`, `TZ=America/Fortaleza`
- `node_modules` e `.next` ficam só dentro do container do frontend (o repositório está no OneDrive); lint e typecheck rodam via `docker compose exec frontend`
- Fuso e locale: `America/Fortaleza`, `pt-BR`
- Comando `seed_demo` cria **somente dados fictícios** (usuários, empresas, competência e demandas de exemplo)
