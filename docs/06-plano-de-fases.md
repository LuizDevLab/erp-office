# 06 — Plano de fases

Cada fase termina com algo **funcionando e testado**, seguido de um commit. Não comece uma fase antes de a anterior estar pronta.

## Fase 0 — Esqueleto
- Monorepo: `backend/`, `frontend/`, `docker-compose.yml`, `.env.example`, `.gitignore`
- Django com custom user (`contas.Usuario`) **antes da primeira migração**; PostgreSQL conectado
- Next.js com Tailwind, tokens de cor, fontes e layout com barra lateral vazia
- Proxy `/api` funcionando (`GET /api/health/` responde do Django)
- ruff, pytest, eslint e typecheck rodando
- **Pronto quando:** `docker compose up` sobe tudo e a página mostra a barra lateral com a logo.

## Fase 1 — Login e permissões
- Login/logout por sessão, `/api/auth/me/`, proteção de rota no Next (`proxy.ts`)
- Papéis colaborador e gestor + classes de permissão
- **Pronto quando:** existem testes cobrindo cada linha da tabela de permissões que já tem endpoint.

## Fase 2 — Empresas e configuração de obrigações
- CRUD de empresas (cadastro manual), com validação de CNPJ/CPF
- Tipos de obrigação, regras por regime e feriados (telas do gestor)
- `sugerir_obrigacoes(empresa)` + chaves para ligar/desligar por empresa
- `seed_demo` com empresas fictícias
- Seed de feriados nacionais e de PB de 2026–2027, marcados "a conferir"
- **Pronto quando:** cadastrar uma empresa do Simples sugere DAS (e EFD ICMS/IPI se for contribuinte; ICMS – Simples se `icms_por_fora`), e os testes da sugestão e das permissões de empresa passam.

## Fase 3 — Painel da competência
- `abrir_competencia` (idempotente) + `calcular_vencimento` (com dia útil, feriado e antecipação)
- Tela da matriz com alternância Pendente/Concluído, filtros, progresso e observações (fixa / da competência)
- Fechar e reabrir competência (gestor)
- Antes de começar: validar com a equipe o vencimento do ICMS – Simples e conferir os valores iniciais (D15)
- **Pronto quando:** a equipe consegue fazer um mês inteiro no sistema **em paralelo com a planilha**, e os testes de vencimento cobrem fim de semana, feriado nacional e estadual por esfera, "último dia útil", antecipar/postergar/manter e a sobrescrita por regra (EFD ICMS/IPI dia 15 × dia 20).

## Fase 4 — Demandas
- CRUD, quadro de 4 colunas, detalhe com "solicitada por", comentários e histórico automático
- Recorrência mensal + comando `gerar_recorrencias`
- **Pronto quando:** as observações com prazo da planilha atual estão recriadas como demandas, e a recorrência gera uma única demanda por mês.

## Fase 5 — Visão geral e Equipe fiscal
- Endpoints agregados (contagens por status/prazo, progresso por tipo e por pessoa)
- Telas Visão geral e Equipe fiscal
- **Pronto quando:** os números batem com o Painel e o quadro de Demandas.

## Fase 6 — Implantação interna
- Decidir hospedagem (servidor local ou nuvem) e destino do backup (D18)
- Build de produção, backup diário do banco fora da máquina do sistema + teste de restauração
- Usuários reais criados (gestores do setor + desenvolvedor como gestor, D10)
- Cadastro manual das empresas da carteira, incluindo conferir as empresas que não estavam na planilha de obrigações (definir regime e obrigações)
- Um mês em paralelo com a planilha → aposentar a planilha
- **Pronto quando:** a planilha mensal deixa de ser usada.
