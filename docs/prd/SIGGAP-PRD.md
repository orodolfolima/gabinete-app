# PRD: Sistema Integrado de Gestão de Gabinete Parlamentar (SIGGAP)

**Version:** 1.0
**Status:** Final
**Date:** 2026-03-03
**PM:** Morgan
**Epic:** EPIC-1-SIGGAP-MVP

---

## 📖 Documento de Requisitos de Produto

### Problema & Oportunidade

**Situação Atual:**
- Gabinetes parlamentares usam múltiplas ferramentas desconectadas
- Dados espalhados entre WhatsApp, Excel, email, Trello
- Falta de automação leva a atrasos e erros
- Impossível ter visão única de performance

**Solução:**
Um sistema web integrado que centraliza todas as operações de gabinete, automatiza comunicações e fornece analytics em tempo real.

**Benefício Esperado:**
- ↓ 70% de tempo em tarefas manuais
- ↑ 50% em taxa de resolução de demandas
- ↑ 40% em engajamento com eleitores

---

## 👥 Públicos-Alvo

| Persona | Perfil | Necessidades |
|---------|--------|-------------|
| **Parlamentar** | Deputado/Senador | Visão executiva, métricas |
| **Coordenador** | Chefe de gabinete | Gestão de equipe + operações |
| **Assessor** | Atendente | Cadastro de visitantes + agendamentos |
| **Analista** | Pesquisador | Relatórios + analytics |

---

## 📋 Requisitos Funcionais (19 Stories)

### SPRINT 0: Setup & Infrastructure

#### Story 1.0.1: Setup Inicial do Projeto
**Executor:** @devops | **Quality Gate:** @architect

**Descrição:**
Criar boilerplate completo do projeto com structure, dependências e configuração local.

**Requisitos:**
- [ ] Repositório Git com branching strategy (main/develop/feature/*)
- [ ] Frontend (React + TypeScript + Tailwind)
- [ ] Backend (Express.js + Prisma)
- [ ] Docker + Docker Compose (local dev)
- [ ] .env.example com todas as variáveis necessárias
- [ ] Documentação de setup (README.md)
- [ ] ESLint + Prettier + Husky pre-commit hooks

**Criteria de Sucesso:**
```bash
npm install && docker-compose up
# Aplicação rodando em http://localhost:3000 (frontend) + 5000 (backend)
```

**Padrões de Código:**
- TypeScript strict mode
- Prettier formatting
- ESLint with Airbnb config

---

#### Story 1.0.2: CI/CD Pipeline
**Executor:** @devops | **Quality Gate:** @architect

**Descrição:**
Configurar GitHub Actions com automações de build, test, lint, security scan.

**Requisitos:**
- [ ] Workflow para PR (lint + typecheck + test)
- [ ] Workflow para merge em develop (build Docker)
- [ ] Workflow para merge em main (build + push Docker Hub)
- [ ] Codecov integration com threshold 80%
- [ ] Dependabot para atualizações de deps
- [ ] CODEOWNERS (code review obrigatório)

**Jobs do Pipeline:**
```yaml
- lint: npm run lint
- typecheck: npm run typecheck
- test: npm test -- --coverage
- build: docker build -t app:latest
- security: npm audit
```

---

### SPRINT 1-2: Módulo 1 - Visitantes & Agendamentos

#### Story 1.1.1: Modelo de Dados + Migrations
**Executor:** @data-engineer | **Quality Gate:** @dev

**Descrição:**
Criar schema PostgreSQL com tabelas de visitantes, agendamentos e relacionadas.

**Requisitos:**
- [ ] Tabela `visitantes` (CPF, RG, contato, endereço, foto, categoria)
- [ ] Tabela `agendamentos` (data/hora, tipo, status, check-in/out)
- [ ] Tabela `interacoes` (histórico de visitas por visitante)
- [ ] Índices em CPF, email, telefone (busca rápida)
- [ ] RLS (Row Level Security) por área de atuação
- [ ] Soft delete (updated_at, deleted_at)
- [ ] Migrations versionadas (Prisma migrations)

**Schema (Prisma):**
```prisma
model Visitante {
  id         String   @id @default(cuid())
  cpf        String   @unique
  rg         String?
  nome       String
  email      String?
  telefone   String?
  whatsapp   String?
  foto_url   String?
  categoria  String   // "lideranca", "empresario", "cidadao", etc
  endereco   Endereco?
  agendamentos Agendamento[]
  demandas   Demanda[]
  deleted_at DateTime?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}

model Agendamento {
  id           String   @id @default(cuid())
  visitante_id String
  visitante    Visitante @relation(fields: [visitante_id], references: [id])
  data_hora    DateTime
  duracao_min  Int
  tipo         String   // "visita", "reuniao", etc
  assunto      String
  status       String   // "agendado", "confirmado", "realizado", "cancelado"
  check_in     DateTime?
  check_out    DateTime?
  responsavel  String   // Usuario responsável
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}

model Endereco {
  id         String   @id @default(cuid())
  visitante_id String @unique
  visitante  Visitante @relation(fields: [visitante_id], references: [id])
  cep        String
  logradouro String
  numero     String
  complemento String?
  bairro     String
  cidade     String
  estado     String
}
```

**Testes:**
- [ ] Teste de constraint CPF unique
- [ ] Teste de cascade delete
- [ ] Teste de índices de performance
- [ ] RLS policy test (dados isolados por usuário)

---

#### Story 1.1.2: API CRUD de Visitantes
**Executor:** @dev | **Quality Gate:** @architect

**Descrição:**
Implementar endpoints REST para gestão completa de visitantes.

**Endpoints:**
```
POST   /api/visitantes                 # Criar
GET    /api/visitantes                 # Listar (com filtro, paginação)
GET    /api/visitantes/:id             # Detalhe
PUT    /api/visitantes/:id             # Atualizar
DELETE /api/visitantes/:id             # Soft delete
GET    /api/visitantes/:id/historico   # Histórico de visitas
```

**Validações:**
- [ ] CPF válido (algoritmo oficial)
- [ ] Email válido
- [ ] Telefone format (11 digits)
- [ ] Endereço CEP válido (API viaCEP)
- [ ] Foto máximo 5MB, format jpg/png

**Autenticação:**
- [ ] JWT obrigatório
- [ ] RLS em query (dados do usuário logado apenas)

**Testes:**
- [ ] Teste CRUD completo
- [ ] Teste de validação
- [ ] Teste de permissões
- [ ] Teste de pagination

---

#### Story 1.1.3: Sistema de Agendamentos
**Executor:** @dev | **Quality Gate:** @architect

**Descrição:**
Implementar gestão completa de agendamentos com confirmação e notificações.

**Endpoints:**
```
POST   /api/agendamentos               # Criar
GET    /api/agendamentos               # Listar (com filtro por data)
GET    /api/agendamentos/:id           # Detalhe
PUT    /api/agendamentos/:id           # Atualizar
DELETE /api/agendamentos/:id           # Cancelar
POST   /api/agendamentos/:id/check-in  # Check-in
POST   /api/agendamentos/:id/check-out # Check-out
```

**Funcionalidades:**
- [ ] Validação de conflito de horário
- [ ] Confirmação automática via SMS (24h antes)
- [ ] Lembretes (2h antes)
- [ ] Exportação para Google Calendar
- [ ] Disponibilidade de slots (parlamentar busy time)
- [ ] Cancelamento automático após 1h sem check-in

**Status de Agendamento:**
```
agendado → confirmado → realizado
   ↓                        ↓
cancelado                concluído
```

**Testes:**
- [ ] Conflito de horário detection
- [ ] Validação de datas passadas
- [ ] Check-in/out sequence validation

---

#### Story 1.1.4: Dashboard de Atendimento
**Executor:** @ux-design-expert | **Quality Gate:** @dev

**Descrição:**
Criar dashboard interativo com métricas de atendimento.

**KPIs Visualizados:**
- [ ] Total de visitantes (mês)
- [ ] Agendamentos (próximos 7 dias)
- [ ] Taxa de presença (presentes vs total)
- [ ] Tempo médio de atendimento
- [ ] Top 10 categorias de visitantes
- [ ] Heatmap de horários (quando mais visitantes chegam)
- [ ] Gráfico de tendência (visitantes por mês)

**Componentes:**
- [ ] Card com KPI principal
- [ ] Calendario com agendamentos
- [ ] Tabela de próximos agendamentos
- [ ] Gráficos Recharts

**Responsividade:**
- [ ] Mobile: 1 coluna
- [ ] Tablet: 2 colunas
- [ ] Desktop: 4 colunas

---

#### Story 1.1.5: Exportação de Relatórios
**Executor:** @dev | **Quality Gate:** @qa

**Descrição:**
Implementar exportação de dados em PDF, Excel e CSV.

**Formatos:**
- [ ] PDF: Relatório mensal com gráficos (usando PDFKit)
- [ ] Excel: Planilha com dados de visitantes + agendamentos
- [ ] CSV: Dados brutos para análise externa

**Relatórios:**
- [ ] Relatório de atendimento (período customizável)
- [ ] Relatório de visitantes por categoria
- [ ] Relatório de performance (SLA)
- [ ] Relatório de ausências

**Segurança:**
- [ ] Audit log de exports
- [ ] Limite de exports/dia (100)
- [ ] Validar permissões do usuário

---

### SPRINT 2-3: Módulo 3 - Controle de Demandas

#### Story 1.2.1: Schema de Demandas + RLS
**Executor:** @data-engineer | **Quality Gate:** @dev

**Descrição:**
Criar modelo completo de demandas com workflow customizável.

**Tabelas:**
```prisma
model Demanda {
  id          String   @id @default(cuid())
  protocolo   String   @unique // "DEM-2026-001"
  visitante_id String
  visitante   Visitante @relation(fields: [visitante_id], references: [id])
  tipo        String   // "saude", "educacao", "infraestrutura", etc
  titulo      String
  descricao   String   @db.Text
  prioridade  String   // "urgente", "alta", "media", "baixa"
  status      String   // "aberta", "em_andamento", "resolvida", "cancelada"
  responsavel String
  prazo_estimado DateTime?
  data_conclusao DateTime?
  tramitacoes Tramitacao[]
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}

model Tramitacao {
  id        String @id @default(cuid())
  demanda_id String
  demanda   Demanda @relation(fields: [demanda_id], references: [id], onDelete: Cascade)
  usuario   String
  status_anterior String
  status_novo String
  descricao String
  created_at DateTime @default(now())
}
```

**RLS Policy:**
```sql
-- Usuários veem apenas demandas do seu setor
CREATE POLICY demanda_isolacao_setor
  ON demanda
  FOR SELECT
  USING (
    setor_responsavel = (
      SELECT setor FROM usuarios WHERE id = current_user_id()
    )
  );
```

---

#### Story 1.2.2: Workflow de Demandas
**Executor:** @dev | **Quality Gate:** @architect

**Descrição:**
Implementar transições de status com validações.

**Estados e Transições:**
```
aberta → em_andamento → aguardando_terceiros → resolvida
  ↓           ↓                                    ↓
cancelada    cancelada                      (fim)
```

**Endpoints:**
```
POST /api/demandas                    # Criar
GET  /api/demandas                    # Listar
GET  /api/demandas/:id                # Detalhe
PUT  /api/demandas/:id                # Atualizar
POST /api/demandas/:id/tramitacao     # Adicionar tramitação
```

**Validações:**
- [ ] Visitante existe
- [ ] Tipo é válido (enum)
- [ ] Prioridade é válida
- [ ] Transições de status válidas
- [ ] Protocolo é único

**Testes:**
- [ ] Teste de estado machine
- [ ] Teste de transições inválidas
- [ ] Teste de cascata de dados

---

#### Story 1.2.3: Sistema de SLA
**Executor:** @dev | **Quality Gate:** @qa

**Descrição:**
Implementar Service Level Agreement com alertas de prazo.

**SLA Rules:**
```
Urgente:    2 dias úteis
Alta:       5 dias úteis
Média:      10 dias úteis
Baixa:      20 dias úteis
```

**Funcionalidades:**
- [ ] Cálculo automático de prazo_estimado
- [ ] Webhook notificação quando 80% do prazo atingido
- [ ] Webhook notificação quando prazo vencido
- [ ] Indicador visual (verde, amarelo, vermelho)
- [ ] Relatório de SLA por período

**Métricas:**
- [ ] % de demandas no prazo
- [ ] Tempo médio de resolução
- [ ] Demandas vencidas (count)

**Testes:**
- [ ] Cálculo correto de dias úteis
- [ ] Notificação dispara corretamente
- [ ] Relatório de SLA accurate

---

#### Story 1.2.4: Dashboard de Demandas
**Executor:** @ux-design-expert | **Quality Gate:** @dev

**Descrição:**
Dashboard com funil de demandas e analytics.

**Visualizações:**
- [ ] Funil por status (aberta → resolvida)
- [ ] Distribuição por tipo
- [ ] Distribuição por prioridade
- [ ] Tempo médio por status
- [ ] SLA compliance % (gauge)
- [ ] Top responsáveis (mais demandas resolvidas)
- [ ] Timeline de demandas (Gantt)

**Filtros:**
- [ ] Por período (data range)
- [ ] Por tipo
- [ ] Por status
- [ ] Por responsável
- [ ] Por visitante

**Responsividade:**
- [ ] Mobile-first design
- [ ] Gráficos com Recharts

---

### SPRINT 3: Módulo 5 - Sistema de Aniversariantes

#### Story 1.3.1: Modelo + Cron Job
**Executor:** @dev | **Quality Gate:** @data-engineer

**Descrição:**
Configurar cron job automático para enviar mensagens de aniversário.

**Funcionalidade:**
- [ ] Identificar aniversariantes do dia
- [ ] Gerar mensagem personalizada
- [ ] Enfileirar para envio (job queue)
- [ ] Log de envios

**Cron Schedule:**
```
0 8 * * * # Executar às 8h todos os dias
```

**Query SQL:**
```sql
SELECT * FROM visitantes
WHERE EXTRACT(MONTH FROM data_nascimento) = EXTRACT(MONTH FROM NOW())
  AND EXTRACT(DAY FROM data_nascimento) = EXTRACT(DAY FROM NOW());
```

**Job Queue:**
- [ ] Redis Bull ou similar
- [ ] Retry automático (3x)
- [ ] Dead letter queue para failures

**Testes:**
- [ ] Cron schedule correto
- [ ] Identificação correta de aniversariantes
- [ ] Personalização de mensagem

---

#### Story 1.3.2: Templates de Mensagens
**Executor:** @dev | **Quality Gate:** @qa

**Descrição:**
Sistema de templates personalizáveis para diferentes categorias.

**Templates:**
```
TEMPLATE_CIVICO: "Feliz aniversário {nome}! Seu representante..."
TEMPLATE_FORMAL: "Estimado(a) {nome}, neste seu aniversário..."
TEMPLATE_INFORMAL: "E aí {nome}, tudo bem? Feliz aniversário! 🎉"
```

**Variáveis:**
- [ ] {nome} - Nome da pessoa
- [ ] {idade} - Idade
- [ ] {parlamentar} - Nome do parlamentar
- [ ] {cidade} - Cidade

**Canais:**
- [ ] WhatsApp
- [ ] SMS
- [ ] Email

**Requisitos:**
- [ ] Editor de template (drag & drop)
- [ ] Preview de mensagem
- [ ] Histórico de templates usados

---

#### Story 1.3.3: Dashboard de Aniversariantes
**Executor:** @ux-design-expert | **Quality Gate:** @dev

**Descrição:**
Dashboard com calendario de aniversários e histórico de envios.

**Visualizações:**
- [ ] Calendario mensal com pontos de aniversariantes
- [ ] Lista dos aniversariantes do mês (próximos 30 dias)
- [ ] Status de envios (entregue, falha, pendente)
- [ ] Histórico de mensagens enviadas
- [ ] Taxa de aceitação (reações em WhatsApp)

**Funcionalidades:**
- [ ] Enviar manualmente (override agendado)
- [ ] Editar mensagem antes de enviar
- [ ] Resend se falhou
- [ ] Exportar lista de aniversariantes

---

### SPRINT 4-5: Módulo 2 - Automação de Comunicação

#### Story 1.4.1: Templates de Mensagens
**Executor:** @dev | **Quality Gate:** @qa

**Descrição:**
Sistema de templates reutilizáveis para SMS, WhatsApp, Email.

**Tipos de Template:**
- [ ] Confirmação de agendamento
- [ ] Lembretes (24h, 2h, 1h antes)
- [ ] Follow-up pós-visita
- [ ] Pesquisa de satisfação
- [ ] Newsletter
- [ ] Avisos (feriado, horário alterado)

**Campos:**
- [ ] Título
- [ ] Conteúdo (com markdown)
- [ ] Variáveis (placeholders)
- [ ] Canal (SMS, WhatsApp, Email)
- [ ] Ativo/Inativo

**Requisitos:**
- [ ] Editor visual
- [ ] Preview
- [ ] Histórico de versões
- [ ] Testes (enviar para usuário teste)

---

#### Story 1.4.2: Integração n8n
**Executor:** @devops | **Quality Gate:** @architect

**Descrição:**
Configurar n8n com triggers e automações.

**Triggers Implementados:**
```
- Novo agendamento criado → confirmar (24h antes)
- Novo agendamento criado → lembrar (2h antes)
- Demanda criada → notificar responsável
- Demanda status muda → notificar visitante
- Aniversariante identificado → enviar saudação
```

**Nós n8n:**
```
Trigger → Filter → Template → WhatsApp/SMS/Email → Log
```

**Requisitos:**
- [ ] n8n self-hosted (Docker)
- [ ] Workflows documentados
- [ ] Notificação de erros (Slack/email)
- [ ] Restart automático

**Testes:**
- [ ] Trigger dispara corretamente
- [ ] Mensagem é personalizada
- [ ] Histórico de execuções

---

#### Story 1.4.3: Envio em Massa + Segmentação
**Executor:** @dev | **Quality Gate:** @qa

**Descrição:**
Sistema para disparar mensagens em massa com segmentação avançada.

**Funcionalidades:**
- [ ] Criar campanha (título, template, segmentação)
- [ ] Segmentar por:
  - Categoria (liderança, empresário, cidadão)
  - Cidade
  - Data de cadastro
  - Última visita (com intervalo)
  - Custom fields (tags)
- [ ] Agendar envio (data/hora específica)
- [ ] Envio imediato vs agendado
- [ ] Limite de envios/dia (rate limiting)
- [ ] Blacklist automático (bounce + opt-out)

**Endpoints:**
```
POST /api/campanhas                # Criar
GET  /api/campanhas                # Listar
GET  /api/campanhas/:id            # Detalhe
PUT  /api/campanhas/:id/enviar     # Enviar
GET  /api/campanhas/:id/relatorio  # Relatório de envio
```

**Validações:**
- [ ] Mínimo 10 destinatários
- [ ] Máximo 10k por dia
- [ ] Template válido
- [ ] Segmentação não vazia

**Testes:**
- [ ] Segmentação accuracy
- [ ] Rate limiting
- [ ] Blacklist behavior
- [ ] Relatório de envio

---

#### Story 1.4.4: Dashboard de Comunicação
**Executor:** @ux-design-expert | **Quality Gate:** @dev

**Descrição:**
Dashboard com métricas de comunicação e engajamento.

**KPIs:**
- [ ] Total de mensagens enviadas (mês)
- [ ] Taxa de entrega (% recebidas)
- [ ] Taxa de abertura (email, WhatsApp)
- [ ] Taxa de clique (CTR)
- [ ] Taxa de bounces
- [ ] Blacklist growth
- [ ] Campanhas ativas
- [ ] Melhor horário para envio (heatmap)
- [ ] Canais mais usados (pizza chart)

**Análises:**
- [ ] Performance por template
- [ ] Performance por segmento
- [ ] Comparação temporal (mês vs mês)

---

### SPRINT 5-6: Módulo 4 - Emendas Parlamentares

#### Story 1.5.1: Schema de Emendas
**Executor:** @data-engineer | **Quality Gate:** @dev

**Descrição:**
Criar schema PostgreSQL para gestão de emendas.

**Tabela Emendas:**
```prisma
model Emenda {
  id             String   @id @default(cuid())
  numero_emenda  String   @unique
  ano_orcamentario Int
  tipo           String   // "individual", "bancada", "comissao", "relator"
  area           String   // "saude", "educacao", etc
  valor_total    BigInt   // em centavos

  beneficiario_municipio String?
  beneficiario_estado    String
  beneficiario_entidade  String?
  beneficiario_cnpj      String?

  objeto         String   @db.Text  // Descrição do que será feito
  status         String   // "cadastrada", "aprovada", "empenhada", "liquidada", "paga"

  valor_empenhado BigInt?
  valor_liquidado BigInt?
  valor_pago      BigInt?

  data_cadastro   DateTime @default(now())
  data_aprovacao  DateTime?
  data_empenho    DateTime?
  data_liquidacao DateTime?
  data_pagamento  DateTime?

  observacoes    String?  @db.Text
  created_at     DateTime @default(now())
  updated_at     DateTime @updatedAt
}

model Documento {
  id        String @id @default(cuid())
  emenda_id String
  emenda    Emenda @relation(fields: [emenda_id], references: [id], onDelete: Cascade)
  tipo      String // "licitacao", "contrato", "comprovante_pagamento"
  url       String
  created_at DateTime @default(now())
}
```

**Índices:**
- [ ] numero_emenda (unique)
- [ ] ano_orcamentario (busca por ano)
- [ ] beneficiario_municipio (busca por cidade)
- [ ] status (filtro por estado)

---

#### Story 1.5.2: API de Emendas
**Executor:** @dev | **Quality Gate:** @architect

**Descrição:**
Implementar endpoints REST para CRUD de emendas.

**Endpoints:**
```
POST   /api/emendas                    # Criar
GET    /api/emendas                    # Listar (com filtro, paginação)
GET    /api/emendas/:id                # Detalhe
PUT    /api/emendas/:id                # Atualizar
DELETE /api/emendas/:id                # Deletar (soft)
POST   /api/emendas/:id/status         # Mudar status
GET    /api/emendas/:id/documentos     # Listar docs
POST   /api/emendas/:id/documentos     # Upload doc
```

**Validações:**
- [ ] Número da emenda é válido
- [ ] Ano orçamentário está entre 2020-2030
- [ ] Valor > 0
- [ ] Tipo é válido (enum)
- [ ] Status é válido (state machine)
- [ ] CNPJ válido se preenchido
- [ ] CEP válido

**Testes:**
- [ ] CRUD completo
- [ ] Validações
- [ ] Filtragem
- [ ] Upload de documentos

---

#### Story 1.5.3: Dashboard Financeiro
**Executor:** @ux-design-expert | **Quality Gate:** @dev

**Descrição:**
Dashboard com análise financeira de emendas.

**KPIs:**
- [ ] Total investido (todos os anos)
- [ ] Total por ano (comparação)
- [ ] Total por área (saúde, educação, etc)
- [ ] Total por status (empenhado, liquidado, pago)
- [ ] Percentual de execução (pago / total)
- [ ] Quantidade de emendas por status
- [ ] Valor médio por emenda
- [ ] Mapa do Brasil (cores por valor investido)

**Gráficos:**
- [ ] Bar chart: Valor por ano
- [ ] Pie chart: Valor por área
- [ ] Funnel: Cadastrada → Aprovada → Paga
- [ ] Heatmap: Municípios com maior investimento

**Filtros:**
- [ ] Ano
- [ ] Área
- [ ] Status
- [ ] Beneficiário

---

#### Story 1.5.4: Integração TSE (Básica)
**Executor:** @dev | **Quality Gate:** @qa

**Descrição:**
Importar dados de votação do TSE e mostrar em mapa.

**Funcionalidades:**
- [ ] Importação manual de CSV do TSE
- [ ] Parse e validação de dados
- [ ] Armazenamento em BD
- [ ] Visualização em mapa (votos por município)
- [ ] Comparação com eleição anterior
- [ ] Relatório de performance

**Data Import Flow:**
```
Upload CSV → Validar → Parse → Store → Visualize
```

**Requisitos:**
- [ ] Admin-only upload
- [ ] Suporte múltiplos anos eleitorais
- [ ] Histórico de imports

**Testes:**
- [ ] Validação de CSV
- [ ] Parse correto
- [ ] Integridade de dados

---

## 🔐 Requisitos Não-Funcionais

### Segurança
- [ ] HTTPS obrigatório
- [ ] JWT + refresh tokens (24h + 7d)
- [ ] 2FA para Admin
- [ ] Rate limiting (100 req/min)
- [ ] CORS restrito
- [ ] Criptografia de dados sensíveis (CPF, RG)
- [ ] Audit log (tabela auditoria)
- [ ] Proteção contra SQL injection (Prisma ORM)
- [ ] Proteção contra XSS (React sanitization)

### Performance
- [ ] API response time < 200ms (p95)
- [ ] Frontend bundle size < 500KB
- [ ] Database queries < 100ms
- [ ] Cache Redis para queries frequentes
- [ ] Paginação em listagens (default 20 por página)
- [ ] Lazy loading de imagens

### Escalabilidade
- [ ] Stateless backend (pronto para horizontal scaling)
- [ ] Database connection pooling
- [ ] CDN para assets estáticos
- [ ] Load balancer ready

### Compliance
- [ ] LGPD (consentimento + direito ao esquecimento)
- [ ] WCAG 2.1 AA (acessibilidade)
- [ ] ISO 27001 (segurança da informação)

---

## 📚 Documentação Necessária

| Documento | Responsável | Status |
|-----------|-------------|--------|
| API Spec (Swagger) | @dev | Será criado |
| Database Schema | @data-engineer | Será criado |
| Architecture | @architect | Será criado |
| Deployment Guide | @devops | Será criado |
| User Manual | @ux-design-expert | Será criado |
| Admin Guide | @pm | Será criado |

---

## ✅ Critérios de Aceita (DoD)

Para cada story ser considerada **DONE**:
- [ ] Código revisado e aprovado (code review)
- [ ] Testes unitários ≥ 80% de cobertura
- [ ] Testes de integração passando
- [ ] Zero linting errors
- [ ] Zero TypeScript errors
- [ ] Documentação atualizada (README, JSDoc)
- [ ] Commit message segue padrão (conventional commits)
- [ ] PR tem descrição clara e screenshots (se UI)

---

## 📅 Cronograma (16 semanas)

```
Sprint 0 (Sem 1):        Setup + CI/CD          | 2 stories
Sprint 1-2 (Sem 2-3):    Visitantes + Dashboard | 5 stories
Sprint 3 (Sem 4):        Demandas + SLA        | 4 stories
Sprint 4 (Sem 5):        Aniversariantes       | 3 stories
Sprint 5 (Sem 6-7):      Comunicação           | 4 stories
Sprint 6 (Sem 8-9):      Emendas + TSE         | 4 stories
Sprint 7 (Sem 10):       Testes + Otimização   | 1 story
```

---

## 🎯 Sucesso = MVP Completo

**Quando o projeto é considerado sucesso:**
- ✅ Todos 7 módulos implementados
- ✅ 19 stories completadas
- ✅ 100% dos requisitos funcionais atendidos
- ✅ Testes ≥ 80% cobertura
- ✅ Zero erros de segurança críticos
- ✅ Performance OK (< 200ms)
- ✅ LGPD compliance passed
- ✅ Documentação completa

**Ao atingir esses critérios: MVP LIBERADO PARA PRODUÇÃO** 🚀

---

**PRD criada por:** Morgan (PM)
**Data:** 2026-03-03
**Próxima revisão:** Após validação de stories com @po
