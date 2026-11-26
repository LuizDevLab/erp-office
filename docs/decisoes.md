# Decisões e questões em aberto

## Decisões tomadas

### 24/11/2026 — Visão e stack

| # | Decisão | Motivo |
|---|---|---|
| D1 | Começar pelo **setor fiscal**; outros setores depois | É o setor que o Luiz conhece melhor e onde a dor da planilha é maior |
| D2 | MVP = **Painel da competência + Demandas** | O trabalho real é a conferência mensal recorrente, mais as tarefas pontuais escondidas nas observações |
| D3 | **Pendência fiscal sai da competência** e vira módulo futuro | É uma rotina de conferência (municipal/estadual/federal) que passa batido; merece solução própria |
| D4 | **Qualquer usuário cria demandas**, com campo "solicitada por"; gestor redistribui e configura | Evita gargalo no gestor e tarefas voltando para o WhatsApp |
| D5 | Empresas **cadastradas manualmente**, sem importar CSV | A base do Acessórias está desatualizada (empresas inativas, responsáveis errados) |
| D6 | Frontend **Next.js**; backend **Python com Django + DRF**; banco **PostgreSQL** | Stack que o Luiz domina. O Django traz login, permissões, migrações e admin prontos. O PostgreSQL é robusto, gratuito e combina com o Django. |
| D7 | Sessão por cookie + proxy do Next para `/api` | Mais simples e seguro que JWT para um sistema interno na mesma origem |
| D8 | Visual: barra lateral preta com logo, área clara, dourado só como marca, Plus Jakarta Sans + Inter | Identidade da T&A com cara corporativa, sem fonte serifada ou cursiva |
| D9 | Nenhum dado real de cliente em seeds/testes; nenhum campo de senha | Segurança e LGPD |

### 24/11/2026 — Questões em aberto resolvidas antes da Fase 0

| # | Decisão | Motivo |
|---|---|---|
| D10 | O setor fiscal tem **até 3 gestores**. O assistente fiscal que desenvolve o sistema também tem papel de **gestor**, combinado para usá-lo só em configuração e suporte (não para redistribuir o trabalho dos colegas). O modelo aceita N gestores. | A configuração (tipos, regras, feriados, vencimentos) é exclusiva do gestor e precisa ser feita durante a implantação pelas telas do sistema |
| D11 | **Colaborador cadastra e edita empresas**, inclusive regime, atividades, contribuinte ICMS, ICMS por fora e vínculos de obrigação. **Trocar responsável fiscal e inativar/reativar** empresa são só do gestor. | Evita gargalo no cadastro; carteira e saída de empresa são decisões de gestão (a carteira define quem marca obrigações) |
| D12 | **Qualquer usuário abre a competência.** Fechar e reabrir: só gestor. | Abrir é idempotente (só acrescenta), então o risco é baixo e ninguém espera gestor na virada do mês. Abertura automática fica no Backlog. |
| D13 | Novo campo **`Empresa.icms_por_fora`** (só para Simples). O tipo passa a se chamar **"ICMS – Simples (recolhimento à parte)"** e é sugerido para Simples Nacional + `icms_por_fora`. | A coluna da planilha é das empresas do Simples (comércio e/ou indústria) que recolhem ICMS por fora; a maioria recolhe por dentro, e o cadastro não tinha como distinguir |
| D14 | **Relatório de acompanhamento**: sugerido para **todos os MEI** | Todos os MEI recebem |
| D15 | **Vencimento no Painel = prazo legal.** Valores iniciais (editáveis): DAS e DAS MEI dia 20, **postergando**; EFD Contribuições 10º dia útil do **2º mês** após a competência; Apuração (PIS/COFINS e demais de apuração normal) **dia 5**, antecipando; EFD ICMS/IPI **dia 15** (regime normal e Simples por fora) ou **dia 20** (Simples por dentro), **sem prorrogação**. | É o prazo que todo mundo confere; o "fazer antes" fica com os alertas de "Vence hoje" e próximos 7 dias |
| D16 | Novo ajuste de dia não útil **`manter`** (a data não muda, mesmo em fim de semana ou feriado), além de antecipar e postergar. `RegraRegime` pode **sobrescrever o vencimento** do tipo de obrigação para as empresas que casam com ela. | A EFD ICMS/IPI não prorroga e tem prazo diferente conforme a empresa; com sobrescrita na regra, isso continua configurável pelo gestor e nada fica fixo no código |
| D17 | **Feriados sem abrangência municipal.** `TipoObrigacao` ganha `esfera` (federal/estadual). O cálculo usa os feriados nacionais, mais os de PB quando a esfera é estadual. O seed traz os feriados de 2026–2027 marcados "a conferir". | Nenhum tipo do catálogo é municipal (o ISS vira demanda); feriado municipal e ISS no catálogo vão para o Backlog |
| D18 | **Hospedagem (local ou nuvem) é decidida na Fase 6.** Requisito fixo desde já: backup diário com `pg_dump` guardado **fora da máquina que roda o sistema**, com teste de restauração. | Não afeta as fases anteriores; decidir agora seria chutar sem conhecer a infraestrutura |
| D19 | As empresas que não estavam na planilha de obrigações viram item do **checklist da Fase 6** (definir regime e obrigações no cadastro manual). | É tarefa de implantação, não decisão de design |

### 26/11/2026 — Fase 0 (esqueleto)

| # | Decisão | Motivo |
|---|---|---|
| D20 | Versões: **Django 5.2 LTS**, **PostgreSQL 17**, **Next.js 16** (com Cache Components e Partial Prefetching, padrão do scaffold), Tailwind v4 | LTS no backend; o Postgres 18 mudou o caminho do volume de dados e o 17 segue estável; Next na versão atual do `create-next-app` |
| D21 | O proxy do Next encaminha `/api/`, `/admin/` e `/django-static/` ao Django **preservando a barra final**, com `skipTrailingSlashRedirect`. `STATIC_URL` do Django é `/django-static/` | O Django exige a barra (APPEND_SLASH) e o Next a removeria, gerando loop; o prefixo próprio evita colisão com rotas e arquivos do Next |
| D22 | `DJANGO_CSRF_TRUSTED_ORIGINS` (em dev: `http://localhost:3000`) | Pelo proxy, o navegador envia a origem do Next; sem isso, POSTs com sessão (login) falham no CSRF |
| D23 | `node_modules` e `.next` só dentro do container; lint e typecheck rodam no container; `.gitattributes` força LF | O repositório está no OneDrive (sincronizar `node_modules` é inviável) e os arquivos rodam em containers Linux |

### 26/11/2026 — Fase 1 (login e permissões)

| # | Decisão | Motivo |
|---|---|---|
| D24 | A sessão dura **um dia de trabalho**: expira 10h após o login (`SESSION_COOKIE_AGE`) | Equilíbrio entre segurança (dados de clientes, LGPD) e não pedir login durante o expediente |
| D25 | O login **exige token CSRF**, obtido em `GET /api/auth/csrf/`. Senha errada, e-mail inexistente e usuário inativo recebem a mesma resposta. O e-mail é guardado em minúsculas e o login não diferencia maiúsculas | O DRF só checa CSRF para usuário já autenticado, o que deixaria o login aberto a login CSRF; resposta única não revela quais e-mails existem |

## Questões em aberto (resolver antes ou durante a fase indicada)

1. Validar com a equipe o vencimento do **ICMS – Simples (recolhimento à parte)** (valor inicial: dia 15) e conferir os demais valores iniciais de D15 *(Fase 3)*
2. Onde o sistema vai rodar: **servidor local do escritório ou nuvem**? Onde ficam os backups? *(Fase 6; ver D18)*
