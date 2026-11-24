# 03 — Modelo de dados

Banco: **PostgreSQL**. Todos os modelos têm `criado_em` e `atualizado_em`. Exclusão de empresas é lógica (`ativa=False` + `data_saida`); nunca apague histórico.

## App `contas`

**Usuario** (custom user do Django, criado já na Fase 0)
- `nome`, `email` (login), `papel`: `colaborador` | `gestor`, `cargo` (texto livre, ex.: "Assistente fiscal"), `ativo`

## App `empresas`

**Empresa**
- `razao_social`, `apelido` (nome curto usado no dia a dia, ex.: "DOMPACK")
- `cnpj` (único, validado; aceitar CPF para empresário pessoa física → campo `documento` + `tipo_documento`)
- `regime`: `simples_nacional` | `lucro_presumido` | `lucro_real` | `mei` | `outro`
- `atividades`: comércio, serviço, indústria (múltipla escolha)
- `contribuinte_icms` (bool), `inscricao_estadual`, `inscricao_municipal`
- `icms_por_fora` (bool; só relevante para Simples Nacional: recolhe ICMS fora do DAS)
- `municipio`, `uf`
- `responsavel_fiscal` → Usuario
- `grupo` (texto opcional, para agrupar matriz/filiais)
- `ativa` (bool), `data_inicio`, `data_saida`
- ⚠️ **Sem nenhum campo de senha ou credencial**

**ObservacaoEmpresa**
- `empresa` →, `texto`, `escopo`: `fixa` | `competencia`, `competencia` → (nulo se fixa), `autor` → Usuario

## App `obrigacoes`

**TipoObrigacao**
- `nome`, `nome_curto` (cabeçalho da coluna), `ordem`, `ativo`, `esfera`: `federal` | `estadual`
- `regra_vencimento`: `dia_fixo` | `dia_util` | `ultimo_dia_util`, `dia` (int, nulo para último dia útil)
- `meses_apos_competencia` (padrão 1), `ajuste_nao_util`: `antecipar` | `postergar` | `manter`

**RegraRegime** (sugestão padrão de vínculo; um tipo pode ter várias, e a sugestão usa a união)
- `tipo_obrigacao` →, `regime`, `exige_contribuinte_icms` (bool/nulo), `exige_icms_por_fora` (bool/nulo), `atividade` (opcional)
- Sobrescrita opcional do vencimento (todos nulos = usa o do tipo): `regra_vencimento`, `dia`, `meses_apos_competencia`, `ajuste_nao_util`. Ex.: EFD ICMS/IPI dia 20 para Simples por dentro.

**EmpresaObrigacao** (o que cada empresa realmente tem)
- `empresa` →, `tipo_obrigacao` →, `ativa` (bool). Único por (empresa, tipo).

**Competencia**
- `ano`, `mes` (único por ano+mês), `status`: `aberta` | `fechada`, `aberta_por`, `fechada_por`, `fechada_em`

**ObrigacaoCompetencia**
- `competencia` →, `empresa` →, `tipo_obrigacao` →. Único pelo trio.
- `status`: `pendente` | `concluida`, `vencimento` (data calculada e gravada ao gerar), `concluida_por` →, `concluida_em`

**Feriado**
- `data`, `descricao`, `abrangencia`: `nacional` | `estadual` (PB). Sem feriado municipal no MVP.

## App `demandas`

**TipoDemanda** — `nome`, `ativo`

**Demanda**
- `titulo`, `descricao`, `tipo` →, `empresa` → (opcional)
- `responsavel` → Usuario, `solicitante` → Usuario (nulo = recorrência automática)
- `prazo` (data), `prioridade`: `baixa` | `media` | `alta`
- `status`: `a_fazer` | `fazendo` | `aguardando` | `concluida`, `concluida_em`
- `recorrencia` → RecorrenciaDemanda (nulo se pontual), `competencia` → (quando gerada por recorrência; garante idempotência)

**RecorrenciaDemanda** (modelo)
- `titulo`, `descricao`, `tipo` →, `empresa` →, `responsavel` →, `dia_do_mes`, `prioridade`, `ativa`
- Único: uma Demanda por (recorrência, competência)

**Comentario**
- `demanda` →, `autor` → (nulo = sistema), `texto`, `automatico` (bool)

## Índices importantes
- `ObrigacaoCompetencia(competencia, status)`, `(empresa)`
- `Demanda(responsavel, status, prazo)`
- `Empresa(responsavel_fiscal, ativa)`
