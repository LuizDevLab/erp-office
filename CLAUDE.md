# ERP T&A — Gestão Fiscal

Sistema interno da **T&A Contabilidade** (Paraíba) para organizar o trabalho do setor fiscal. Ele faz duas coisas:

1. **Painel da competência**: acompanha as obrigações mensais de cada empresa (DAS, EFD ICMS/IPI, EFD Contribuições…) e substitui a planilha mensal de controle.
2. **Demandas**: tarefas pontuais ou recorrentes, cada uma com responsável, prazo e histórico.

Quem desenvolve é o Luiz Henrique, assistente fiscal e desenvolvedor. Os usuários são a equipe fiscal do escritório. O sistema **complementa** o Domínio Sistemas, o Acessórias e os portais (e-CAC, SEFAZ-PB). Ele não substitui nenhum deles.

## Antes de qualquer tarefa, leia

| Arquivo | Conteúdo |
|---|---|
| `docs/01-produto.md` | Visão, usuários, escopo do MVP, o que fica **fora** |
| `docs/02-regras-de-negocio.md` | Competência, obrigações por regime, vencimentos, demandas, permissões |
| `docs/03-modelo-de-dados.md` | Entidades, campos e relacionamentos |
| `docs/04-telas.md` | Telas, comportamento e identidade visual (protótipo aprovado) |
| `docs/05-arquitetura.md` | Stack, estrutura de pastas, autenticação, convenções |
| `docs/06-plano-de-fases.md` | Ordem de construção e critérios de "pronto" |
| `docs/decisoes.md` | Decisões já tomadas e questões em aberto |

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS, em `frontend/`
- **Backend:** Python + Django + Django REST Framework, em `backend/`
- **Banco:** PostgreSQL
- **Ambiente:** Docker Compose (`db`, `backend`, `frontend`)

## Comandos

> Ainda não existem. São criados na Fase 0 (`docs/06-plano-de-fases.md`). Atualize esta seção quando mudarem.

```bash
docker compose up -d                                        # sobe tudo
docker compose exec backend python manage.py migrate        # migrações
docker compose exec backend python manage.py seed_demo      # dados FICTÍCIOS
docker compose exec backend pytest                          # testes do backend
docker compose exec backend ruff check . && ruff format .   # lint/format Python
cd frontend && npm run lint && npm run typecheck            # checagens do front
```

## Regras de trabalho

- **Planeje antes de codar.** Em toda tarefa que não for trivial, apresente um plano curto e espere aprovação.
- **Um passo de cada vez.** Entregue fatias pequenas e funcionando. Sugira um commit ao fim de cada etapa.
- **Escopo fechado.** Não adicione funcionalidades que não estejam em `docs/01-produto.md`. Se uma ideia parecer boa, registre em "Backlog" e siga. Evite over-engineering e feature creep.
- **Quando houver dúvida sobre um processo do escritório, pergunte.** Não invente como a equipe trabalha. Prazos e regras fiscais são **configuráveis** e validados pela equipe; nunca fixe esses valores no código.
- **Teste as regras de negócio:** geração de obrigações por regime, cálculo de vencimento, recorrência de demandas e permissões. Nessas áreas, o teste vem junto com o código.
- **Mantenha os docs vivos.** Se uma decisão mudar, atualize `docs/decisoes.md` e o doc afetado na mesma tarefa.

## Segurança e dados (inegociável)

- **Nunca use dados reais de clientes** em seeds, fixtures, testes ou exemplos. Use apenas empresas e CNPJs fictícios.
- **Nunca crie campos para guardar senhas** de portais (e-CAC, Empregador Web, SEFAZ etc.), nem em "observações".
- Segredos ficam só em `.env` (fora do git). Mantenha `.env.example` atualizado.
- Empresas são **cadastradas manualmente** pelo sistema. Não há importação de CSV ou planilha no MVP.

## Convenções

- Interface 100% em **pt-BR**. Datas em `dd/mm/aaaa`, valores em `R$`.
- **Domínio em português e sem acento** nos identificadores (`Empresa`, `Competencia`, `Demanda`, `prazo`, `responsavel`). Termos técnicos e de framework continuam em inglês.
- Commits e comentários em português, no imperativo: `adiciona geração de obrigações por regime`.
- Python: ruff (lint + format) e type hints nas funções de domínio. TypeScript em modo `strict`.
- API REST em `/api/`, com recursos no plural: `/api/empresas/`, `/api/competencias/2026-10/`, `/api/demandas/`.
