# Migration Strategy — SIGGAP Design System

## Executive Summary

| Item | Detalhe |
|------|---------|
| Projeto | SIGGAP — Sistema de Gestão de Gabinete |
| Objetivo | Substituir 72 elementos inline pelos componentes do design system |
| Fase Atual | **Fase 1 COMPLETA** — tokens + átomos construídos |
| Trabalho Restante | Fases 2–4 (~3 sprints) |
| Arquivos a Migrar | 6 páginas + 1 componente |
| Nível de Risco | **BAIXO** — componentes provados em testes, substituição 1:1 |
| ROI Breakeven | Final da Fase 2 (~1 sprint) |

---

## Estado Atual (pós Fase 1)

### Componentes construídos
- `<Button>` — 7 variantes, 3 tamanhos, loading state, asChild, **23 testes** passando
- `<Input>`, `<Select>`, `<Textarea>`, `<FormField>` — com error state, **23 testes** passando

### Design tokens implantados
- **69 tokens** totais (color: 28, spacing: 10, typography: 12, radius: 5, component: 14)
- **5 formatos de export** (YAML, CSS, JSON, Tailwind v3, SCSS)
- Cobertura de 96.8% dos padrões visuais do codebase

### Decisões de consolidação aprovadas
1. `TemplateEditor` drift: `blue-500 + rounded-md` → `indigo-600 + rounded-lg`
2. `emerald` mantido apenas para ações export/download semânticas
3. Padding de icon-actions padronizado em `p-2`

---

## Inventário de Instâncias por Arquivo

| Arquivo | Buttons | Forms | Total | Prioridade |
|---------|---------|-------|-------|-----------|
| Visitantes.tsx | 12 | 10 | **22** | 1 (mais alto) |
| Agendamentos.tsx | 7 | 8 | **15** | 2 |
| Templates.tsx | 9 | 4 | **13** | 3 |
| Campanhas.tsx | 6 | 6 | **12** | 4 |
| TemplateEditor.tsx | 2 | 3 | **5** | 5 (+drift fix) |
| Relatorios.tsx | 3 | 2 | **5** | 6 |
| **TOTAL** | **39** | **33** | **72** | — |

---

## 4 Fases de Migração

### Fase 1 — Foundation ✅ COMPLETA

**Objetivo:** Deploy de tokens + construção de átomos, zero mudanças visuais nas páginas

**Entregáveis concluídos:**
- [x] `tokens.yaml`, `tokens.css`, `tokens.json`, `tokens.tailwind.js`, `tokens.scss`
- [x] `src/components/ui/button.tsx` + testes
- [x] `src/components/ui/input.tsx` + testes
- [x] `src/lib/utils.ts` (helper `cn()`)
- [x] Vitest configurado (`46/46` testes passando)

**Rollback:** N/A — nenhuma mudança nas páginas existentes

---

### Fase 2 — Migrar Botões (1 sprint)

**Objetivo:** Substituir 39 `<button>` inline pelos `<Button>` do design system

**Impacto esperado:**
- 39 blocos de className duplicados eliminados
- Consistência visual 100% nos botões
- Drift do `TemplateEditor` corrigido

**Ordem de execução:**
1. `Visitantes.tsx` — 12 botões
2. `Templates.tsx` — 9 botões
3. `Agendamentos.tsx` — 7 botões
4. `Campanhas.tsx` — 6 botões
5. `TemplateEditor.tsx` — 2 botões + fix drift `blue-500→indigo-600`
6. `Relatorios.tsx` — 3 botões

**Guia detalhado:** `phase-2-buttons.md`

**Critérios de sucesso:**
- Zero `<button className=` no codebase (exceto `ui/button.tsx`)
- Todos os testes continuam passando
- Visual sem regressões

**Rollback:** `git revert` por arquivo — cada arquivo é um commit separado

---

### Fase 3 — Migrar Formulários (1 sprint)

**Objetivo:** Substituir 33 `<input>`, `<select>` e `<textarea>` inline pelos componentes do design system

**Impacto esperado:**
- 33 blocos de className duplicados eliminados
- Acessibilidade melhorada (labels associadas via `htmlFor`)
- Error state padronizado via `<FormField error="...">`

**Ordem de execução:**
1. `Visitantes.tsx` — 10 campos de formulário
2. `Agendamentos.tsx` — 8 campos
3. `Campanhas.tsx` — 6 campos
4. `Templates.tsx` — 4 campos
5. `TemplateEditor.tsx` — 3 campos + fix `rounded-md→rounded-lg`
6. `Relatorios.tsx` — 2 inputs de data

**Guia detalhado:** `phase-3-forms.md`

**Critérios de sucesso:**
- Zero `<input className=`, `<select className=`, `<textarea className=` nas páginas
- FormField sendo usado para todos os campos com label
- Error messages com `role="alert"` funcionando

**Rollback:** `git revert` por arquivo

---

### Fase 4 — Drift + Enforcement (0.5 sprint)

**Objetivo:** Prevenir regressões e eliminar desvios restantes

**Tarefas:**
- [ ] Verificar que todas as drift issues foram corrigidas (TemplateEditor)
- [ ] Adicionar regra ESLint para bloquear `<button>` / `<input>` / `<select>` / `<textarea>` fora de `src/components/ui/`
- [ ] Atualizar README com guia de uso dos componentes
- [ ] Audit visual final (comparar screenshots antes/depois)

**Critérios de sucesso:**
- Zero instâncias de drift no codebase
- ESLint falha se alguém adicionar elemento HTML nativo em página

---

## Projeção de ROI

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| Inline `<button>` | 39 | 0 | **100%** |
| Inline `<input>`/`<select>`/`<textarea>` | 33 | 0 | **100%** |
| Strings de className duplicadas | ~380 | ~15 | **96%** |
| Cobertura de testes de UI | 0% | 100% | — |
| Instâncias de drift de cor | 2 | 0 | **100%** |
| Tempo estimado para adicionar novo botão | 15 min | 30 seg | **97%** |

---

## Estrutura de Imports nas Páginas (pós-migração)

```tsx
// Adicionar no topo de cada arquivo de página migrado:
import { Button } from '../components/ui';
// Para arquivos com formulários:
import { Button, Input, Select, Textarea, FormField } from '../components/ui';
```

---

## Validação Após Cada Fase

1. `npm test` — todos os 46+ testes devem passar
2. `npm run lint` — zero erros de lint
3. `npm run typecheck` — zero erros TypeScript
4. Review visual manual dos formulários e botões modificados
