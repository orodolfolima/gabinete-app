# SIGGAP Design System

Sistema de design extraído do projeto SIGGAP (Sistema de Gestão de Visitantes).

## Visão Geral

| Métrica | Valor |
|---------|-------|
| Elementos inline migrados | 72 / 72 (100%) |
| Testes passando | 46 / 46 |
| Drift fixes aplicados | 5 |
| Tokens extraídos | 24 |
| Componentes atômicos | 5 |

---

## Componentes

### Button

```tsx
import { Button } from '../components/ui';

// Variantes
<Button variant="primary">Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Ação discreta</Button>
<Button variant="outline">Filtro</Button>
<Button variant="export">Exportar CSV</Button>
<Button variant="icon-view" size="icon"><Eye /></Button>
<Button variant="icon-edit" size="icon"><Edit2 /></Button>
<Button variant="icon-delete" size="icon"><Trash2 /></Button>

// Loading state
<Button isLoading={loading} loadingLabel="Salvando...">
  Salvar Template
</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="icon">Ícone</Button>

// Override de cor semântica (ex: canal SMS/WhatsApp/Email)
<Button variant="ghost" className="bg-blue-100 text-blue-700">
  SMS
</Button>
```

**Props:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `primary \| secondary \| ghost \| outline \| export \| icon-view \| icon-edit \| icon-delete` | `primary` | Estilo visual |
| `size` | `default \| sm \| icon` | `default` | Tamanho |
| `isLoading` | `boolean` | `false` | Exibe spinner e desabilita |
| `loadingLabel` | `string` | — | Texto durante loading |
| `asChild` | `boolean` | `false` | Renderiza como filho (Radix Slot) |

---

### Input

```tsx
import { Input } from '../components/ui';

// Texto
<Input type="text" placeholder="Nome" value={nome} onChange={...} />

// Data
<Input type="date" value={data} onChange={...} className="w-auto" />

// Com ícone (wrapper externo)
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <Input className="pl-10" placeholder="Buscar..." />
</div>
```

---

### Select

```tsx
import { Select } from '../components/ui';

<Select value={canal} onChange={(e) => setCanal(e.target.value)}>
  <option value="">Selecione...</option>
  <option value="SMS">SMS</option>
  <option value="WHATSAPP">WhatsApp</option>
</Select>
```

---

### Textarea

```tsx
import { Textarea } from '../components/ui';

<Textarea
  value={conteudo}
  onChange={...}
  rows={6}
  className="font-mono"
  placeholder="Digite sua mensagem..."
/>
```

---

### FormField

Molecule que compõe `label + htmlFor + required + error`.

```tsx
import { FormField, Input, Select, Textarea } from '../components/ui';

// Com Input
<FormField label="Nome" htmlFor="nome" required>
  <Input id="nome" value={nome} onChange={...} />
</FormField>

// Com Select
<FormField label="Canal" htmlFor="canal">
  <Select id="canal" value={canal} onChange={...}>
    ...
  </Select>
</FormField>

// Com Textarea
<FormField label="Mensagem" htmlFor="msg">
  <Textarea id="msg" value={msg} onChange={...} rows={6} />
</FormField>

// Com error
<FormField label="Email" htmlFor="email" error="Email inválido">
  <Input id="email" type="email" />
</FormField>

// Conteúdo extra após o campo (ex: progress bar)
<FormField label="Conteúdo" htmlFor="conteudo">
  <Textarea id="conteudo" ... />
  <div className="mt-2">... barra de progresso ...</div>
</FormField>
```

**Props:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | `string` | — | Texto do label |
| `htmlFor` | `string` | — | Associa ao campo via `id` |
| `required` | `boolean` | `false` | Adiciona asterisco `*` |
| `error` | `string` | — | Mensagem de erro (role="alert") |
| `children` | `ReactNode` | — | Componente de campo |

---

## Regras de Uso (ESLint)

O arquivo `.eslintrc.json` bloqueia o uso de elementos HTML nativos em `src/pages/**` e `src/components/**` (exceto `src/components/ui/**`).

**Elementos bloqueados:** `<button>`, `<input>`, `<select>`, `<textarea>`

Para exceções por design, adicione o comentário:
```tsx
{/* eslint-disable-next-line no-restricted-syntax */}
<input type="checkbox" ... />  // nativo por design (checkbox)
```

**Exceções documentadas por design:**
1. `Campanhas.tsx` — `<input type="checkbox">` (envioImediato) — não coberto pelo `<Input>`
2. `Agendamentos.tsx` — `<button>` em lista dropdown de visitantes — item de lista, não ação

---

## Tokens de Design

Arquivo fonte: `tokens.yaml`

| Categoria | Tokens |
|-----------|--------|
| Cores principais | `indigo-600`, `indigo-50`, `indigo-100` |
| Cores de estado | `green-*`, `red-*`, `yellow-*`, `amber-*` |
| Bordas | `border-gray-200` |
| Arredondamento | `rounded-lg` (padrão), `rounded-xl` (cards) |
| Foco | `ring-indigo-500` |

**Drift corrigido durante migração:**
- `blue-500` → `indigo-600` (cor primária)
- `blue-100` → `indigo-100` (badges ativos)
- `border-gray-300` → `border-gray-200` (inputs)
- `rounded-md` → `rounded-lg` (inputs)
- `ring-blue-500` → `ring-indigo-500` (foco)

---

## Estrutura de Arquivos

```
outputs/design-system/siggap/
├── tokens.yaml              # Tokens de design (fonte da verdade)
├── tokens.css               # CSS custom properties
├── tokens.json              # JSON para ferramentas
├── tokens.tailwind.js       # Extensão Tailwind
├── tokens.scss              # SCSS variables
├── README.md                # Este arquivo
└── migration/
    ├── migration-strategy.md
    ├── migration-progress.yaml
    ├── component-mapping.json
    ├── phase-2-buttons.md
    └── phase-3-forms.md

frontend/src/
├── components/ui/
│   ├── button.tsx           # Atom: Button (CVA + Radix Slot)
│   ├── button.test.tsx      # 32 testes
│   ├── input.tsx            # Atoms: Input, Select, Textarea, FormField
│   ├── input.test.tsx       # 14 testes
│   └── index.ts             # Re-exports
└── lib/
    └── utils.ts             # cn() = clsx + tailwind-merge
```

---

## Fases de Migração

| Fase | Status | Escopo |
|------|--------|--------|
| 1 - Foundation | ✅ Complete | Tokens + atoms + vitest |
| 2 - Buttons | ✅ Complete | 39 botões em 6 arquivos |
| 3 - Forms | ✅ Complete | 33 campos em 6 arquivos |
| 4 - Enforcement | ✅ Complete | ESLint rule + README |

---

## Pendências Documentadas (fora do escopo da migração)

| Arquivo | Elemento | Observação |
|---------|----------|------------|
| `src/components/TemplatePreview.tsx:116` | `<input type="text">` | Drift `border-gray-300`/`ring-blue-500` — candidato à próxima iteração |
| `src/components/layout/Sidebar.tsx` | 3x `<button>` | Navegação — candidato à próxima iteração |
