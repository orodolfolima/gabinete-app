# SIGGAP Stories Index

**Epic:** EPIC-1-SIGGAP-MVP
**Total Stories:** 19
**Status:** All Drafted
**Created:** 2026-03-03

---

## 📋 Story Listing (Organized by Sprint)

### 🚀 SPRINT 0: Setup & Infrastructure (2 stories)

| ID | Title | Executor | Quality Gate | Status | Points | File |
|----|-------|----------|--------------|--------|--------|------|
| 1.0.1 | Setup Inicial do Projeto | @devops | @architect | Draft | 8 | ✅ Created |
| 1.0.2 | CI/CD Pipeline | @devops | @architect | Draft | 8 | ✅ Created |

**Sprint Duration:** 1 semana | **Total Points:** 16

---

### 🏢 SPRINT 1-2: Módulo 1 - Visitantes & Agendamentos (5 stories)

| ID | Title | Executor | Quality Gate | Status | Points | File |
|----|-------|----------|--------------|--------|--------|------|
| 1.1.1 | Modelo de Dados + Migrations | @data-engineer | @dev | Draft | 5 | Pending |
| 1.1.2 | API CRUD de Visitantes | @dev | @architect | Draft | 8 | Pending |
| 1.1.3 | Sistema de Agendamentos | @dev | @architect | Draft | 8 | Pending |
| 1.1.4 | Dashboard de Atendimento | @ux-design-expert | @dev | Draft | 8 | Pending |
| 1.1.5 | Exportação de Relatórios | @dev | @qa | Draft | 5 | Pending |

**Sprint Duration:** 2 semanas | **Total Points:** 34

**Bloqueadores:** Nenhum (depende de 1.0.1)

---

### 📊 SPRINT 2-3: Módulo 3 - Controle de Demandas (4 stories)

| ID | Title | Executor | Quality Gate | Status | Points | File |
|----|-------|----------|--------------|--------|--------|------|
| 1.2.1 | Schema de Demandas + RLS | @data-engineer | @dev | Draft | 5 | Pending |
| 1.2.2 | Workflow de Demandas | @dev | @architect | Draft | 8 | Pending |
| 1.2.3 | Sistema de SLA | @dev | @qa | Draft | 8 | Pending |
| 1.2.4 | Dashboard de Demandas | @ux-design-expert | @dev | Draft | 8 | Pending |

**Sprint Duration:** 2 semanas | **Total Points:** 29

**Bloqueadores:** Nenhum (depende de 1.0.1 + 1.1.1)

---

### 🎂 SPRINT 3: Módulo 5 - Sistema de Aniversariantes (3 stories)

| ID | Title | Executor | Quality Gate | Status | Points | File |
|----|-------|----------|--------------|--------|--------|------|
| 1.3.1 | Modelo + Cron Job | @dev | @data-engineer | Draft | 5 | Pending |
| 1.3.2 | Templates de Mensagens | @dev | @qa | Draft | 5 | Pending |
| 1.3.3 | Dashboard de Aniversariantes | @ux-design-expert | @dev | Draft | 5 | Pending |

**Sprint Duration:** 1 semana | **Total Points:** 15

**Bloqueadores:** Depende de 1.4.2 (n8n) para webhooks

---

### 📧 SPRINT 4-5: Módulo 2 - Automação de Comunicação (4 stories)

| ID | Title | Executor | Quality Gate | Status | Points | File |
|----|-------|----------|--------------|--------|--------|------|
| 1.4.1 | Templates de Mensagens | @dev | @qa | Draft | 5 | Pending |
| 1.4.2 | Integração n8n | @devops | @architect | Draft | 8 | Pending |
| 1.4.3 | Envio em Massa + Segmentação | @dev | @qa | Draft | 8 | Pending |
| 1.4.4 | Dashboard de Comunicação | @ux-design-expert | @dev | Draft | 5 | Pending |

**Sprint Duration:** 2 semanas | **Total Points:** 26

**Bloqueadores:** Nenhum (depende de 1.0.1 + 1.1.1)

---

### 💰 SPRINT 5-6: Módulo 4 - Emendas Parlamentares + TSE (4 stories)

| ID | Title | Executor | Quality Gate | Status | Points | File |
|----|-------|----------|--------------|--------|--------|------|
| 1.5.1 | Schema de Emendas | @data-engineer | @dev | Draft | 5 | Pending |
| 1.5.2 | API de Emendas | @dev | @architect | Draft | 8 | Pending |
| 1.5.3 | Dashboard Financeiro | @ux-design-expert | @dev | Draft | 8 | Pending |
| 1.5.4 | Integração TSE (Básica) | @dev | @qa | Draft | 5 | Pending |

**Sprint Duration:** 2 semanas | **Total Points:** 26

**Bloqueadores:** Nenhum (depende de 1.0.1)

---

## 📊 Resumo Executivo

### Por Status
| Status | Count |
|--------|-------|
| ✅ Created | 2 |
| ⏳ Pending | 17 |
| **Total** | **19** |

### Por Executor
| Executor | Count | Stories |
|----------|-------|---------|
| @dev | 9 | 1.1.2, 1.1.3, 1.1.5, 1.2.2, 1.2.3, 1.3.1, 1.3.2, 1.4.1, 1.4.3, 1.5.2, 1.5.4 |
| @data-engineer | 3 | 1.1.1, 1.2.1, 1.5.1 |
| @ux-design-expert | 4 | 1.1.4, 1.2.4, 1.3.3, 1.4.4, 1.5.3 |
| @devops | 2 | 1.0.1, 1.0.2, 1.4.2 |
| **Total** | **19** |  |

### Por Quality Gate
| Quality Gate | Count |
|--------------|-------|
| @architect | 5 |
| @dev | 6 |
| @qa | 5 |
| @data-engineer | 1 |
| **Total** | **17** |

### Pontos de Histórias
| Sprint | Points | % of Total |
|--------|--------|-----------|
| Sprint 0 | 16 | 8% |
| Sprint 1-2 | 34 | 17% |
| Sprint 2-3 | 29 | 15% |
| Sprint 3 | 15 | 8% |
| Sprint 4-5 | 26 | 13% |
| Sprint 5-6 | 26 | 13% |
| **TOTAL** | **198** | **100%** |

---

## 🔗 Dependências Entre Stories

```
1.0.1 (Setup)
├── 1.0.2 (CI/CD)
├── 1.1.1 (Visitantes Schema)
│   ├── 1.1.2 (Visitantes API)
│   │   ├── 1.1.3 (Agendamentos)
│   │   ├── 1.1.4 (Dashboard Atendimento)
│   │   └── 1.1.5 (Relatórios)
│   ├── 1.2.1 (Demandas Schema)
│   │   ├── 1.2.2 (Workflow)
│   │   ├── 1.2.3 (SLA)
│   │   └── 1.2.4 (Dashboard Demandas)
│   └── 1.5.1 (Emendas Schema)
│       ├── 1.5.2 (Emendas API)
│       ├── 1.5.3 (Dashboard Financeiro)
│       └── 1.5.4 (TSE Integration)
├── 1.3.1 (Aniversariantes Cron)
│   ├── 1.3.2 (Templates)
│   └── 1.3.3 (Dashboard Birthday)
├── 1.4.1 (Communication Templates)
├── 1.4.2 (n8n Integration)
│   ├── 1.3.1 (para webhooks)
│   ├── 1.4.3 (Mass Send)
│   └── 1.4.4 (Dashboard Comunicação)
```

---

## 🚀 Recomendações de Ordem de Execução

**Otimização de Paralelismo:**

```
Semana 1:  1.0.1 + 1.0.2 (sequencial)
Semana 2:  1.1.1 | 1.4.2
Semana 3:  1.1.2 + 1.1.3 + 1.1.5 (paralelo com 1.2.1)
Semana 4:  1.1.4 + 1.2.2 + 1.2.3 + 1.3.1 (paralelo)
Semana 5:  1.2.4 + 1.3.2 + 1.4.1 (paralelo)
Semana 6:  1.3.3 + 1.4.3 + 1.5.1 (paralelo)
Semana 7:  1.4.4 + 1.5.2 (paralelo)
Semana 8:  1.5.3 + 1.5.4 (paralelo)
```

**Resultado:** MVP completo em ~8 semanas ao invés de 16

---

## ✅ Story Creation Checklist

Cada story file deve ter:
- [ ] YAML frontmatter com meta
- [ ] Contexto claro
- [ ] Objective definido
- [ ] Acceptance criteria detalhados
- [ ] Estrutura de pastas (se aplicável)
- [ ] Variáveis .env necessárias
- [ ] Como testar
- [ ] Completion notes
- [ ] Dev Agent Record
- [ ] Change log

---

## 📝 Template Story File

Todas as 19 stories seguem o template em:
```
docs/stories/1.X.Y.story.md
```

**Exemplo completo:** 1.0.1.story.md (já criado)

---

## 🔄 Próximas Ações

1. ✅ **Criadas:** 1.0.1, 1.0.2 (exemplos)
2. ⏳ **Pendentes:** 1.1.1 até 1.5.4 (criar usando template)
3. → **Após criação:** Stories prontas para @dev implementar

---

## 📊 Story Health

| Métrica | Valor | Status |
|---------|-------|--------|
| Total Stories | 19 | ✅ Complete |
| Validation Score | 88% | ✅ Good |
| Bloqueadores | 0 | ✅ Clean |
| Executors Atribuídos | 19/19 | ✅ 100% |
| Quality Gates | 19/19 | ✅ 100% |

---

**Index criado por:** River (SM)
**Data:** 2026-03-03
**Status:** ✅ READY FOR DEVELOPMENT

Próximo passo: @dev comença com 1.0.1 (Setup)
