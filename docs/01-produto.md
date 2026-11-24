# 01 — Produto

## Problema

O setor fiscal controla as obrigações mensais numa **planilha copiada todo mês**, com uma aba por competência. Isso causa vários problemas:

- **Observações envelhecem.** Uma nota como "sem obrigatoriedade para agosto" é copiada para os meses seguintes.
- **As obrigações de cada empresa são marcadas à mão** ("—" quando não se aplica). Por isso, empresa nova exige lembrar de incluir a linha e definir o que ela tem.
- **Tarefas pontuais ficam escondidas** na coluna Observações ("ENVIAR ISS ATÉ DIA 10", "PEDRO FAZ"), sem prazo, alerta ou responsável formal.
- **Não há visão consolidada** do andamento de cada pessoa da equipe.

## Usuários

| Papel | Quem | O que precisa |
|---|---|---|
| **Colaborador** | Assistentes e analistas fiscais (o Luiz Henrique é assistente fiscal) | Ver o próprio dia, marcar obrigações, criar e acompanhar demandas |
| **Gestor** | Até 3 gestores do setor fiscal, mais o assistente fiscal desenvolvedor (para configuração e suporte; ver D10 em `decisoes.md`) | Tudo o que o colaborador faz, mais redistribuir demandas, gerir carteiras e configurar obrigações e regras |

## Escopo do MVP

1. **Login** com dois papéis (colaborador e gestor)
2. **Cadastro manual de empresas**, com regime, atividades, ICMS por fora (Simples), responsável fiscal e situação ativa/inativa
3. **Catálogo de tipos de obrigação** e **regras padrão por regime**, editáveis pelo gestor
4. **Painel da competência**: matriz empresa × obrigação, gerada automaticamente, com Pendente/Concluído em um clique, filtros e progresso
5. **Observações por empresa**, fixas ou válidas só para uma competência
6. **Demandas**: criar, atribuir, mudar de status (quadro), comentar, com "solicitada por" e recorrência mensal simples
7. **Visão geral**: saudação, atrasadas, vencendo hoje, próximos 7 dias e andamento da competência
8. **Equipe fiscal**: carteira, atrasadas e andamento por pessoa

## Fora do MVP (não implementar sem decisão explícita)

- **Pendência / situação fiscal** (conferência municipal, estadual e federal). Fica para um **módulo futuro** próprio; ver Backlog.
- Importação de CSV ou planilha (as empresas são cadastradas à mão)
- Integração com Domínio, Acessórias, e-CAC, SEFAZ ou e-mail
- Notificações por e-mail ou WhatsApp
- Subtarefas, dependências entre tarefas, Gantt, controle de horas, chat interno, gamificação
- Status, campos ou fluxos personalizáveis pelo usuário
- Aplicativo mobile nativo (a versão web precisa funcionar bem no celular)
- Outros setores (contábil, pessoal). O desenho não deve impedir essa expansão, mas ela não entra agora.

## Backlog (ideias registradas, não priorizadas)

- **Módulo Situação Fiscal:** rotina periódica de conferência de pendências por esfera (municipal, estadual e federal), com histórico de quando cada empresa foi verificada e o resultado. Possível automação de consultas e comunicação com clientes.
- Resumo diário por e-mail (vence hoje / atrasadas)
- Anexos em demandas
- Relatórios de produtividade para o gestor
- Expansão para os outros setores do escritório
- Abertura automática da competência no dia 1º (comando agendado)
- ISS no catálogo de obrigações, com feriados municipais no cálculo de vencimento

## Como saber se deu certo

- A planilha mensal deixa de ser usada pelo setor fiscal.
- Toda tarefa com prazo passa a existir como demanda, e não mais como observação ou mensagem.
- O gestor responde "como está a competência?" sem perguntar para ninguém.
