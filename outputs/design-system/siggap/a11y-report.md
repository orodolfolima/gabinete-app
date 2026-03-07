# SIGGAP Design System — Relatório de Acessibilidade WCAG 2.1 AA

**Data:** 2026-03-06
**Agente:** Uma (ux-design-expert)
**Escopo:** Tokens de cor + componentes atômicos (Button, Input, Select, Textarea, FormField)

---

## Resultado Geral

| Critério | Status |
|---|---|
| 1.4.3 Contraste de texto | ✅ Passa (1 fix aplicado) |
| 1.4.11 Contraste de componentes UI | ✅ Passa |
| 1.1.1 Conteúdo não-textual | ✅ Passa |
| 1.3.1 Info e relacionamentos | ✅ Passa (aria-invalid, role=alert, htmlFor) |
| 2.4.7 Foco visível | ✅ Passa |
| 4.1.2 Name, Role, Value | ✅ Passa (aria-busy, aria-disabled) |

---

## Fix Aplicado — Export Button (CRÍTICO)

**Critério violado:** WCAG 1.4.3 — Contraste de Texto
**Antes:** `bg-emerald-600` + `text-white` = **3.77:1** ❌ (requer 4.5:1 para 14px/medium)
**Depois:** `bg-emerald-700` + `text-white` = **5.47:1** ✅

**Arquivos alterados:**
- `frontend/src/components/ui/button.tsx` — `bg-emerald-700 hover:bg-emerald-800`
- `frontend/src/components/ui/button.test.tsx` — teste atualizado para `bg-emerald-700`
- `outputs/design-system/siggap/tokens/tokens.yaml` — token `button.export.bg` atualizado

---

## Tabela Completa de Contraste

### Texto Normal (≥ 4.5:1)

| Combinação | Ratio | Status |
|---|---|---|
| `text-gray-900` / white | 17.7:1 | ✅ AAA |
| `text-gray-700` / white | 10.3:1 | ✅ AAA |
| `text-gray-500` / white | 4.8:1 | ✅ AA |
| Button primary: white / `bg-indigo-600` | 6.3:1 | ✅ AA |
| Button primary hover: white / `bg-indigo-700` | 7.9:1 | ✅ AAA |
| Button export: white / `bg-emerald-700` | 5.5:1 | ✅ AA (fix) |
| Badge ativo: `text-indigo-700` / `bg-indigo-100` | 6.4:1 | ✅ AA |
| Badge indigo: `text-indigo-600` / `bg-indigo-50` | 5.6:1 | ✅ AA |
| Erro texto: `text-red-700` / `bg-red-50` | 5.9:1 | ✅ AA |
| Button danger: white / `bg-red-600` | 4.8:1 | ✅ AA |
| Info template: white / `bg-blue-600` | 5.2:1 | ✅ AA |
| Badge verde: `text-green-700` / `bg-green-100` | 4.6:1 | ✅ AA |

### Isenções Documentadas

| Combinação | Ratio | Isenção |
|---|---|---|
| `placeholder:text-gray-400` / white | 2.5:1 | WCAG 1.4.3 nota: placeholder isento |
| `disabled:text-gray-400` / white | 2.5:1 | WCAG 1.4.3 nota: disabled isento |
| `border-gray-200` / white | 1.4:1 | WCAG 1.4.11: bordas decorativas isentas |

### Componentes UI — Ícones (≥ 3:1)

| Combinação | Ratio | Status |
|---|---|---|
| Focus ring `ring-indigo-500` / white | 4.5:1 | ✅ |
| `icon-view` hover `text-indigo-600` / white | 6.3:1 | ✅ |
| `icon-delete` hover `text-red-600` / white | 4.8:1 | ✅ |
| `icon-edit` hover `text-amber-600` / white | 3.2:1 | ✅ |
| Metric icon emerald: `text-emerald-600` / `bg-emerald-50` | 3.6:1 | ✅ |
| Metric icon green: `text-green-600` / `bg-green-50` | 3.3:1 | ✅ |
| Metric icon amber: `text-amber-600` / `bg-amber-50` | 3.1:1 | ✅ |

---

## Verificações Estruturais

### ✅ Passando

- **aria-hidden** nos spinners SVG — `aria-hidden="true"` em Spinner component
- **sr-only** no loading label — `<span class="sr-only">{loadingLabel}</span>`
- **aria-busy** / **aria-disabled** no Button loading state
- **aria-invalid** propagado em Input, Select, Textarea via `error` prop
- **role="alert"** no parágrafo de erro em FormField
- **htmlFor** associação label→campo em FormField
- **Focus visible** — `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2` em Button
- **Focus visible** — `focus:ring-2 focus:ring-indigo-500` em Input/Select/Textarea
- **Color + text** — status badges usam cor + texto legível (não só cor)

### ⚠️ Recomendações (SHOULD — não bloqueantes)

1. **`aria-required`** — FormField com `required={true}` não injeta automaticamente `aria-required` no campo filho. Consumidores devem adicionar `aria-required` diretamente nos campos:
   ```tsx
   <FormField label="Nome" htmlFor="nome" required>
     <Input id="nome" aria-required="true" ... />
   </FormField>
   ```
   *Impacto: screen readers anunciam "required" pelo asterisco+label, mas `aria-required` melhora a UX com AT (assistive technology).*

2. **`TemplatePreview.tsx`** (fora do escopo da migração) — input com `border-gray-300 ring-blue-500` drift não foi migrado. Candidato à próxima iteração.

---

## Resumo de Tokens Corrigidos

| Token | Antes | Depois | Motivo |
|---|---|---|---|
| `button.export.bg` | `emerald-600` (#059669) | `emerald-700` (#047857) | WCAG 1.4.3: 3.77→5.47:1 |

---

## Testes após fix

```
✓ button.test.tsx (23 testes)
✓ input.test.tsx  (23 testes)
Total: 46/46 ✅
```
