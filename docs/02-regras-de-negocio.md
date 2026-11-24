# 02 — Regras de negócio

> Prazos e regras fiscais aqui são **valores iniciais configuráveis**. A equipe fiscal valida antes do uso real. Nada disso pode ficar fixo no código.

## Competência

- Uma **competência** é um mês de referência (ex.: `2026-10` = Outubro/2026). As obrigações dela vencem, em regra, no mês seguinte.
- **Abrir uma competência** (qualquer usuário) gera uma `ObrigacaoCompetencia` (status inicial **Pendente**) para cada `EmpresaObrigacao` ativa de cada empresa **ativa** naquele mês.
- Abrir de novo é **idempotente**: não duplica o que já existe e só acrescenta obrigações de empresas ou vínculos novos.
- Empresa que saiu (`data_saida`) antes do início do mês não entra. Empresa que entrou no meio do mês entra.
- Competência pode ser **fechada** pelo gestor. Fechada, vira somente leitura, e só o gestor pode reabrir.

## Obrigações por regime

Cada **tipo de obrigação** tem regras padrão que dizem a quais empresas ele se aplica. Ao cadastrar uma empresa (ou mudar o regime dela), o sistema **sugere** os vínculos `EmpresaObrigacao` com base nessas regras. A pessoa pode ligar ou desligar cada obrigação daquela empresa. Exemplo real: uma empresa do Simples que não tem DAS no mês.

Catálogo inicial, tirado da planilha atual do setor:

| Tipo de obrigação | Aplica-se por padrão a |
|---|---|
| DAS – Simples Nacional | Simples Nacional |
| Apuração PIS/COFINS/IRPJ/CSLL/ICMS | Lucro Presumido |
| ICMS – Simples (recolhimento à parte) | Simples Nacional com `icms_por_fora` (comércio e/ou indústria que recolhem ICMS fora do DAS) |
| EFD ICMS/IPI | Contribuinte de ICMS (comércio/indústria), qualquer regime exceto MEI |
| EFD Contribuições | Lucro Presumido e Lucro Real |
| DAS MEI (envio ao cliente) | MEI |
| Relatório de acompanhamento | MEI (todos) |

Um tipo pode ter **várias regras** (ex.: uma por atividade); a sugestão usa a união delas.

**Pendência fiscal NÃO é uma obrigação da competência.** Ela fica para o módulo futuro (`01-produto.md`, Backlog).

## Vencimentos

Cada tipo de obrigação tem uma **regra de vencimento** configurável:

- `dia_fixo` (ex.: dia 20 do mês seguinte)
- `dia_util` (ex.: 10º dia útil do mês seguinte)
- `ultimo_dia_util` (do mês seguinte)

Contada a partir da competência com `meses_apos_competencia` (padrão 1). Mais um **ajuste quando cai em dia não útil**: antecipar (padrão), postergar ou **manter** (a data não muda).

- O vencimento é o **prazo legal**, não um prazo interno do escritório (exceto a Apuração, que é prazo de trabalho).
- Cada tipo tem uma **esfera**: `federal` ou `estadual`. Dias não úteis = sábados, domingos e feriados **nacionais**; para a esfera estadual, também os feriados **de PB**. Feriados são cadastrados pelo gestor; não há feriado municipal no MVP.
- Uma **regra por regime pode sobrescrever o vencimento** do tipo para as empresas que casam com ela. Sem sobrescrita, vale o vencimento do tipo.

Valores iniciais (editáveis pelo gestor; conferir com a equipe antes do uso real):

| Tipo | Vencimento | Dia não útil | Esfera |
|---|---|---|---|
| DAS – Simples Nacional | dia 20 do mês seguinte | postergar | federal |
| DAS MEI (envio ao cliente) | dia 20 do mês seguinte | postergar | federal |
| Apuração PIS/COFINS/IRPJ/CSLL/ICMS | dia 5 do mês seguinte | antecipar | federal |
| EFD Contribuições | 10º dia útil do **2º mês** seguinte | — | federal |
| EFD ICMS/IPI | dia 15 do mês seguinte (regime normal e Simples por fora); **dia 20** para Simples por dentro (sobrescrita na regra) | manter | estadual |
| ICMS – Simples (recolhimento à parte) | dia 15 do mês seguinte *(a validar)* | antecipar *(a validar)* | estadual |
- **Status visual** de uma obrigação pendente: **Atrasada** (venceu), **Vence hoje**, **No prazo**.

## Observações

- Cada observação pertence a uma empresa e tem um escopo:
  - **Fixa**: aparece em todas as competências até ser removida.
  - **Da competência**: aparece só naquele mês. Isso resolve o problema de notas que envelhecem.
- Uma observação com prazo e ação ("enviar ISS até dia 10") deve virar **demanda**. A interface sugere essa conversão, mas não a obriga.

## Demandas

- **Campos essenciais:** título, descrição (opcional), empresa (opcional), tipo, **responsável** (uma pessoa), **solicitante** (quem criou; automático), prazo, prioridade (baixa/média/alta) e status.
- **Status:** `a_fazer` → `fazendo` → `aguardando` (depende de cliente ou de terceiro) → `concluida`. Qualquer transição é permitida.
- **Tipos iniciais:** Obrigação, Apuração, Envio ao cliente, Notificação, Certidão, Retificação, Parcelamento, Documentos, Outro. São editáveis pelo gestor.
- **Comentários** formam o histórico da demanda. Mudanças de status e de responsável geram uma entrada automática ("Luiz moveu para Aguardando").
- **Recorrência (simples):** um modelo de recorrência mensal (ex.: "Enviar ISS – Construtora X, todo dia 10") gera **uma demanda por mês**. A geração acontece ao abrir a competência e também por um comando diário idempotente (`gerar_recorrencias`). Demandas geradas assim mostram "Solicitada por: Recorrência automática".
- **Atrasada** = prazo vencido e status diferente de concluída.

## Permissões

| Ação | Colaborador | Gestor |
|---|---|---|
| Criar demanda para si mesmo | ✅ | ✅ |
| Criar demanda para um colega | ✅ (registra "solicitada por") | ✅ |
| Editar ou concluir as próprias demandas (é o responsável) | ✅ | ✅ |
| Mudar prazo ou responsável de demanda de outra pessoa | ❌ | ✅ |
| Excluir demanda | só as que criou | ✅ |
| Marcar obrigação da competência (Pendente/Concluído) | ✅ nas empresas da sua carteira | ✅ todas |
| Cadastrar e editar empresas (inclusive regime, atividades e vínculos de obrigação) | ✅ | ✅ |
| Trocar responsável fiscal; inativar ou reativar empresa | ❌ | ✅ |
| Configurar tipos de obrigação, regras, vencimentos, feriados e recorrências | ❌ | ✅ |
| Abrir competência | ✅ | ✅ |
| Fechar e reabrir competência | ❌ | ✅ |
| Ver Equipe fiscal | ✅ (somente leitura) | ✅ |

As permissões são verificadas **no backend**. O frontend apenas esconde os botões.
