# EPIC 1: SIGGAP MVP - Sistema Integrado de Gestão de Gabinete Parlamentar

**Epic ID:** EPIC-1
**Status:** Draft
**Priority:** P0 (Critical)
**Scope:** Full-Stack Web Application
**Timeline:** 12-16 weeks

---

## 📋 Epic Goal

Criar um sistema completo, robusto e inteligente para gestão de gabinetes parlamentares, integrando relacionamento com cidadãos, controle de demandas, automação de comunicação e análise eleitoral em uma única plataforma moderna e escalável.

---

## 🏗️ Epic Description

### Contexto Existente
- **Problema:** Gabinetes parlamentares usam múltiplas ferramentas desconectadas (planilhas, WhatsApp, emails)
- **Impacto:** Ineficiência, perda de dados, comunicação inconsistente
- **Oportunidade:** Sistema integrado que automatiza 80% dos processos

### O que será entregue

O SIGGAP v1.0 (MVP) incluirá:
- ✅ 7 módulos completos e funcionais
- ✅ Frontend moderno (React + TypeScript + Tailwind)
- ✅ API REST documentada (Swagger)
- ✅ Banco de dados PostgreSQL com RLS
- ✅ Automação via n8n/Zapier
- ✅ Dashboards analíticos
- ✅ Autenticação JWT + OAuth2
- ✅ Compliance LGPD

### Integração e Compatibilidade

**Stack Tecnológico (Escolhido):**
```
Frontend: React 18 + TypeScript + Tailwind CSS + Shadcn/UI
Backend: Node.js + Express.js + Prisma ORM
Database: PostgreSQL 15+
Cache: Redis
Automação: n8n (self-hosted)
Messaging: WhatsApp Business API
Analytics: Recharts
Auth: JWT + OAuth2 (Google/GitHub)
```

**Padrões de Projeto:**
- MVC para backend
- Component-driven para frontend
- Repository pattern para data access
- Service layer para business logic
- Middleware pattern para auth/validation

**Considerações Arquiteturais:**
- API separada do frontend (SPA)
- Autoscaling ready (stateless)
- Containerização Docker
- CI/CD pipeline (GitHub Actions)
- Monitoramento básico (Winston logs)

---

## 📊 Priorização de Módulos (MoSCoW)

### 🟢 MUST HAVE (Sprint 1-3 = 6 semanas)
1. **Módulo 1:** Visitantes & Agendamentos (Core)
2. **Módulo 3:** Controle de Demandas (Core)
3. **Módulo 5:** Sistema de Aniversariantes (Engagement)

### 🟡 SHOULD HAVE (Sprint 4-5 = 4 semanas)
4. **Módulo 2:** Automação de Comunicação (Amplificador)
5. **Módulo 4:** Emendas Parlamentares (Financeiro)

### 🔵 COULD HAVE (Sprint 6+ = 4+ semanas)
6. **Módulo 6:** Monitor WhatsApp (Inovação)
7. **Módulo 7:** Análise Eleitoral TSE (Analytics)

### ⚪ WON'T HAVE (Post-MVP)
- Integração com Jira/Azure DevOps
- Machine Learning para recomendações
- App mobile nativo (será SPA responsivo)

---

## 📈 Métricas de Sucesso

| KPI | Meta | Avaliação |
|-----|------|-----------|
| Tempo de resposta API (p95) | < 200ms | /api/health endpoint |
| Uptime | 99.5% | Monitoring dashboard |
| Cobertura de testes | ≥ 80% | Coverage report |
| Taxa de entrega no prazo | 100% | Sprint completion |
| Linting + TypeCheck | 0 erros | Pre-commit hook |
| LGPD Compliance | 100% | Security audit |

---

## 🎯 Estratégia de Decomposição em Stories

O epic será dividido em **19 stories** organizadas em 6 fases:

### Fase 0: Setup & Infrastructure (Sprint 0 = 1 semana)
- Story 1.0.1: Setup inicial (boilerplate + docker)
- Story 1.0.2: CI/CD pipeline (GitHub Actions)

### Fase 1: Módulo Visitantes & Agendamentos (Sprint 1-2 = 2 semanas)
- Story 1.1.1: Modelo de dados + Migrations
- Story 1.1.2: API CRUD de Visitantes
- Story 1.1.3: Sistema de Agendamentos
- Story 1.1.4: Dashboard de Atendimento
- Story 1.1.5: Exportação de Relatórios

### Fase 2: Módulo Demandas (Sprint 2-3 = 2 semanas)
- Story 1.2.1: Schema de Demandas + RLS
- Story 1.2.2: Workflow de Demandas
- Story 1.2.3: Sistema de SLA
- Story 1.2.4: Dashboard de Demandas

### Fase 3: Sistema de Aniversariantes (Sprint 3 = 1 semana)
- Story 1.3.1: Modelo + Cron job
- Story 1.3.2: Templates de mensagens
- Story 1.3.3: Dashboard de Aniversariantes

### Fase 4: Automação de Comunicação (Sprint 4-5 = 2 semanas)
- Story 1.4.1: Templates de mensagens
- Story 1.4.2: Integração n8n
- Story 1.4.3: Envio em massa + Segmentação
- Story 1.4.4: Dashboard de Comunicação

### Fase 5: Emendas & Analytics (Sprint 5-6 = 2 semanas)
- Story 1.5.1: Schema de Emendas
- Story 1.5.2: API de Emendas
- Story 1.5.3: Dashboard Financeiro
- Story 1.5.4: Integração TSE (básica)

### Fase 6: Refinamento & Qualidade (Sprint 7 = 1 semana)
- Story 1.6.1: Testes E2E
- Story 1.6.2: Otimização de performance
- Story 1.6.3: Documentação final

---

## 🎬 Roadmap Executivo

```
┌─ SEMANA 1 ─┬─ SEMANA 2 ─┬─ SEMANA 3 ─┬─ SEMANA 4 ─┬─ SEMANA 5 ─┬─ SEMANA 6 ─┐
│ Setup      │ Visitantes │ Visitantes │ Demandas   │ Comunica.  │ Emendas    │
│ CI/CD      │ + Agendar  │ Dashboard  │ + SLA      │ + Birthday │ + TSE      │
└────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
     │             │              │            │            │             │
     └─────────────────────────────────────────────────────────────────────┘
                              16 semanas = MVP completo
```

---

## 👥 Atribuição de Agentes & Quality Gates

### Distribuição por Story (Estratégia de Equipe)

**Padrão de Execução:**
```
@dev (Dex)             → Implementation (Features, APIs, Logic)
@data-engineer (Dara)  → Database (Schema, Migrations, RLS)
@devops (Gage)        → Infrastructure (Docker, CI/CD, Deployment)
@ux-design-expert (Uma) → Frontend (Components, Design, UX)
@architect (Aria)     → Design decisions, pattern validation
@qa (Quinn)           → Testing, quality review
```

### Quality Gate Matriz

| Tipo de Story | Executor | Quality Gate | Tools |
|---------------|----------|--------------|-------|
| Backend API | @dev | @architect | code_review, security_scan |
| Database | @data-engineer | @dev | schema_validation, migration_test |
| Frontend | @ux-design-expert | @dev | a11y_check, component_test |
| DevOps | @devops | @architect | infra_review, security_audit |
| All | — | @qa (final) | e2e_test, regression_test |

---

## 🔐 Considerações de Segurança & Compliance

### LGPD Compliance
- [ ] Consentimento explícito (checkbox em cadastros)
- [ ] Direito ao esquecimento (soft delete + backup cleanup)
- [ ] Portabilidade de dados (export em JSON)
- [ ] Notificação de breach (log + alert)

### Segurança
- [ ] Criptografia de dados sensíveis (CPF, RG) em BD
- [ ] Rate limiting (100 req/min por IP)
- [ ] JWT com refresh tokens (24h + 7d)
- [ ] CORS restrito apenas a domínios autorizados
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (React sanitization)

### Autenticação & Autorização
- [ ] 2FA obrigatório para Admin
- [ ] Roles: Admin, Coordenador, Assessor, Visualizador
- [ ] RLS em PostgreSQL para isolamento de dados
- [ ] Audit log para todas as ações (tabela auditoria)

---

## 📦 Dependências Externas

**APIs & Serviços:**
- WhatsApp Business API (messaging)
- Google Calendar API (agendamentos)
- TSE API (dados eleitorais)
- n8n (automação)

**Bibliotecas Críticas:**
- React 18, TypeScript, Tailwind, Shadcn/UI (frontend)
- Express.js, Prisma, PostgreSQL (backend)
- Jest, Playwright (testes)
- Docker, Docker Compose (containerização)

**Instalação Prévia Necessária:**
- Node.js 18+
- PostgreSQL 15+
- Docker + Docker Compose
- Git

---

## ⚠️ Riscos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Integração WhatsApp falhar | Alta | Alto | Investigar cedo (Sprint 0) |
| Performance BD com muitos dados | Média | Alto | Indexação + caching Redis |
| Scope creep de requisitos | Alta | Médio | MoSCoW rigoroso + Sprint planning |
| Falta de testes unitários | Baixa | Alto | Codecov + pre-commit hooks |

---

## 📋 Critérios de Definição de Concluído

Para o epic ser considerado **DONE**:
- [ ] Todas 19 stories completadas e mergeadas
- [ ] Cobertura de testes ≥ 80%
- [ ] Zero erros de linting/typecheck
- [ ] PRD 100% implementado
- [ ] Documentação API (Swagger) completa
- [ ] Manual de usuário + guia admin
- [ ] Teste de performance (< 200ms p95)
- [ ] Teste de segurança (OWASP top 10)
- [ ] LGPD audit passed

---

## 📚 Documentação de Referência

- **PRD Completo:** `docs/prd/SIGGAP-PRD.md` (será criado)
- **Arquitetura:** `docs/architecture/SIGGAP-ARCHITECTURE.md` (será criado)
- **API Spec:** `docs/api/openapi.yaml` (Swagger)
- **DB Schema:** `docs/database/schema.md`
- **Guia de Dev:** `docs/guides/DEVELOPER-GUIDE.md`

---

## 🚀 Próximos Passos

**→ Step 1:** Criar PRD detalhado (19 stories) com @pm
**→ Step 2:** Validar stories com @po (10-point checklist)
**→ Step 3:** Criar task de arquitetura com @architect
**→ Step 4:** Iniciar Sprint 0 com @dev (setup)

**Estimativa Total:** 16 semanas / 4 meses

---

**Epic criada por:** Morgan (PM)
**Data:** 2026-03-03
**Status:** ✅ PRONTA PARA REFINAMENTO
