# 04 — Telas e identidade visual

Protótipo aprovado (referência visual, dados fictícios):
https://claude.ai/artifact/Xs8N7Z71EVHJWEhyGYKM2N

O protótipo é a **referência de layout e comportamento**, não código a copiar. Reconstrua a interface com componentes React e Tailwind.

## Estrutura geral
- **Barra lateral preta** com a logo da T&A (arquivo em `frontend/public/logo-ta.png`), navegação e o usuário logado (nome + cargo) no rodapé.
- Área de trabalho clara. Em telas estreitas, a barra lateral vira menu recolhível e as tabelas rolam na horizontal.

## Telas do MVP

### 1. Visão geral (`/`)
- Saudação conforme o horário ("Bom dia / Boa tarde / Boa noite, {nome}") e a data por extenso
- Cards: **Atrasadas**, **Vencem hoje**, **Próximos 7 dias**, **Competência atual (%)**
- Lista "Minhas demandas", agrupada em Atrasadas / Hoje / Próximos dias, com checkbox para concluir
- Bloco "Fechamento da competência": progresso por tipo de obrigação (feitas/total + vencimento)

### 2. Painel da competência (`/competencia/[aaaa-mm]`)
- Seletor de competência (‹ Outubro/2026 ›) e faixa de progresso (concluídas de total, pendentes, empresas 100%)
- Filtros: regime (Todas / Simples / Lucro Presumido / MEI), "só empresas com pendências" e responsável (gestor)
- Tabela empresa × tipo de obrigação: célula com botão **Pendente / ✓ Concluído** (um clique alterna), **—** quando não se aplica; cabeçalho com feitas/total
- Coluna Observações, com etiqueta "Fixa na empresa" ou "Só este mês"

### 3. Demandas (`/demandas`)
- Alternar **Minhas / Equipe fiscal** + busca por empresa ou título
- Quadro com 4 colunas (A fazer, Fazendo, Aguardando, Concluído). O cartão mostra tipo, título, empresa, prazo (com cor de status) e iniciais do responsável.
- Painel de detalhe: empresa, responsável, **solicitada por**, prazo, prioridade, recorrência, botões "Mover para", histórico e campo de comentário
- Botão **+ Nova demanda** (formulário em modal ou painel)

### 4. Equipe fiscal (`/equipe`)
- Cards: empresas atendidas, demandas atrasadas, concluídas no mês, competência da equipe (%)
- Tabela por pessoa: empresas, atrasadas, para hoje e barra de progresso da competência. Ao clicar, a lista lateral "Atenção: {pessoa}" mostra as atrasadas e as de hoje.

### Telas de cadastro (simples, sem protótipo)
- **Empresas:** lista com busca e filtros + formulário. Ao escolher o regime, mostra as obrigações sugeridas com chaves para ligar e desligar. Para Simples, mostra a opção "Recolhe ICMS por fora". Responsável fiscal e inativar/reativar só ficam editáveis para o gestor.
- **Configurações (gestor):** tipos de obrigação e vencimentos, regras por regime, feriados, tipos de demanda, recorrências, usuários.

## Identidade visual (tokens)

| Token | Valor | Uso |
|---|---|---|
| `preto` | `#0D0D0D` | Barra lateral |
| `grafite` | `#141310` | Botões primários, cards de destaque |
| `fundo` | `#F4F2EE` | Fundo da área de trabalho |
| `superficie` | `#FFFFFF` | Cards e tabelas |
| `borda` | `#E4E0D8` | Bordas de cards |
| `texto` | `#1C1B19` | Texto principal |
| `texto-suave` | `#6B655A` | Legendas |
| `ouro` | `#C9A646` | Barras de progresso, avatar, destaque |
| `ouro-claro` | `#E3C46B` | Texto dourado sobre fundo escuro |
| `ouro-texto` | `#8A6A1F` | Links e texto dourado sobre fundo claro (contraste AA) |
| `atrasada` | fundo `#FDECEA` / texto `#A12A1F` | |
| `hoje` / `pendente` | fundo `#FFF1E0` / texto `#9A4B00` | |
| `concluida` | fundo `#E6F2EC` / texto `#1F5E40` | |

- **Fontes:** Plus Jakarta Sans (títulos, 600–700) + Inter (texto), via `next/font`. Sem fontes serifadas ou cursivas.
- O dourado é da marca. **Não use amarelo para alertas**; use os tons de laranja e vermelho acima.
- Status sempre com **texto ou ícone além da cor**. Contraste mínimo AA. Alvos de toque ≥ 44px.
