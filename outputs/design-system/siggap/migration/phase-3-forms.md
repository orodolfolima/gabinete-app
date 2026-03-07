# Fase 3 — Migrar Formulários

**Objetivo:** Substituir 33 `<input>`, `<select>` e `<textarea>` inline pelos `<Input>`, `<Select>`, `<Textarea>`, `<FormField>` do design system
**Pré-requisito:** Fase 2 completa. `import { Input, Select, Textarea, FormField } from '../components/ui'`
**Validação:** `npm test && npm run lint && npm run typecheck` após cada arquivo

---

## Regras de Migração de Formulários

| Situação | Use |
|----------|-----|
| Input/Select/Textarea com `<label>` acima | `<FormField label="..." htmlFor="..."><Input id="..." /></FormField>` |
| Campo obrigatório | Adicionar `required` no FormField |
| Mostrar erro de validação | `<FormField error={formError}>` |
| Select/Input de filtro sem label | `<Select>` / `<Input>` standalone |
| Input de busca com ícone | Manter wrapper div com ícone absoluto, usar `<Input className="pl-10">` |
| Input date inline | `<Input type="date" className="w-auto">` |
| Textarea com fonte mono | `<Textarea className="font-mono">` |

---

## Arquivo 1: Visitantes.tsx (10 campos)

### Filtros (sem label)

```tsx
// ANTES — busca com ícone
<div className="flex-1 relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input type="text" placeholder="Buscar por nome..." value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
  />
</div>

// DEPOIS
<div className="flex-1 relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <Input type="text" placeholder="Buscar por nome..." value={busca}
    onChange={(e) => setBusca(e.target.value)} className="pl-10" />
</div>
```

```tsx
// ANTES — select filtro de categoria
<select value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setPage(0); }}
  className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
  ...
</select>

// DEPOIS
<Select value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setPage(0); }}>
  ...
</Select>
```

### Modal Form (6 campos com labels)

```tsx
// ANTES — grid de campos com label+input
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
    <input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}
      placeholder="00000000000" disabled={!!editando}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
    <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
      placeholder="Nome completo"
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</div>

// DEPOIS
<div className="grid grid-cols-2 gap-4">
  <FormField label="CPF" htmlFor="cpf" required>
    <Input id="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}
      placeholder="00000000000" disabled={!!editando} />
  </FormField>
  <FormField label="Nome" htmlFor="nome" required>
    <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
      placeholder="Nome completo" />
  </FormField>
</div>
```

```tsx
// ANTES — campos Email, Telefone, WhatsApp (padrão igual)
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
  <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })}
    placeholder="email@exemplo.com" type="email"
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

// DEPOIS (repetir para Telefone, WhatsApp)
<FormField label="Email" htmlFor="email">
  <Input id="email" type="email" value={form.email || ''}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    placeholder="email@exemplo.com" />
</FormField>
```

```tsx
// ANTES — select de categoria
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
  <select value={form.categoria || ''} onChange={(e) => setForm({ ...form, categoria: e.target.value })}
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    ...
  </select>
</div>

// DEPOIS
<FormField label="Categoria" htmlFor="categoria">
  <Select id="categoria" value={form.categoria || ''}
    onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
    ...
  </Select>
</FormField>
```

### Modal Detail — interação (2 campos sem label)

```tsx
// ANTES
<select value={interacaoTipo} onChange={(e) => setInteracaoTipo(e.target.value)}
  className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
  ...
</select>
<input value={interacaoDesc} onChange={(e) => setInteracaoDesc(e.target.value)}
  placeholder="Descricao..."
  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
/>

// DEPOIS
<Select value={interacaoTipo} onChange={(e) => setInteracaoTipo(e.target.value)}>
  ...
</Select>
<Input value={interacaoDesc} onChange={(e) => setInteracaoDesc(e.target.value)}
  placeholder="Descricao..." />
```

---

## Arquivo 2: Agendamentos.tsx (8 campos)

### Filtros de data e status (3 campos sem label)

```tsx
// ANTES
<input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
<input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
<select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
  ...
</select>

// DEPOIS
<Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-auto" />
<Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-auto" />
<Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
  ...
</Select>
```

### Modal Form — busca de visitante + campos

```tsx
// ANTES — busca com ícone
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Visitante *</label>
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input value={buscaVisitante} onChange={(e) => setBuscaVisitante(e.target.value)}
      placeholder="Buscar visitante..."
      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  ...
</div>

// DEPOIS
<FormField label="Visitante" htmlFor="visitante" required>
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <Input id="visitante" value={buscaVisitante} onChange={(e) => setBuscaVisitante(e.target.value)}
      placeholder="Buscar visitante..." className="pl-10" />
  </div>
  ...
</FormField>
```

```tsx
// ANTES — Data/Hora, Duração, Tipo, Responsável, Assunto (5 campos com label)
// Padrão idêntico — aplicar FormField + Input/Select

// DEPOIS (exemplos)
<FormField label="Data e Hora" htmlFor="dataHora" required>
  <Input id="dataHora" type="datetime-local" value={form.dataHora}
    onChange={(e) => setForm({ ...form, dataHora: e.target.value })} />
</FormField>

<FormField label="Duracao (min)" htmlFor="duracao" required>
  <Input id="duracao" type="number" value={form.duracao} min={1} max={480}
    onChange={(e) => setForm({ ...form, duracao: Number(e.target.value) })} />
</FormField>

<FormField label="Tipo" htmlFor="tipo" required>
  <Select id="tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
    ...
  </Select>
</FormField>

<FormField label="Responsavel" htmlFor="responsavel">
  <Input id="responsavel" value={form.responsavel || ''}
    onChange={(e) => setForm({ ...form, responsavel: e.target.value })} placeholder="Nome..." />
</FormField>

<FormField label="Assunto" htmlFor="assunto" required>
  <Input id="assunto" value={form.assunto}
    onChange={(e) => setForm({ ...form, assunto: e.target.value })}
    placeholder="Motivo do agendamento..." />
</FormField>
```

---

## Arquivo 3: Campanhas.tsx (6 campos)

```tsx
// ANTES — Titulo
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
  <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
    placeholder="Nome da campanha"
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

// DEPOIS
<FormField label="Titulo" htmlFor="titulo" required>
  <Input id="titulo" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
    placeholder="Nome da campanha" />
</FormField>
```

```tsx
// ANTES — Template select
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Template *</label>
  <select value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })}
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
    ...
  </select>
</div>

// DEPOIS
<FormField label="Template" htmlFor="templateId" required>
  <Select id="templateId" value={form.templateId}
    onChange={(e) => setForm({ ...form, templateId: e.target.value })}>
    ...
  </Select>
</FormField>
```

```tsx
// ANTES — Segmentação (2 campos com label xs)
<div>
  <label className="text-xs text-gray-500 mb-1 block">Categoria</label>
  <select value={form.segmentacao.categoria || ''} onChange={...}
    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm">
    ...
  </select>
</div>
<div>
  <label className="text-xs text-gray-500 mb-1 block">Cidade</label>
  <input value={form.segmentacao.cidade || ''} onChange={...}
    placeholder="Filtrar por cidade"
    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
  />
</div>

// DEPOIS
<FormField label="Categoria" htmlFor="seg-categoria">
  <Select id="seg-categoria" value={form.segmentacao.categoria || ''} onChange={...}>
    ...
  </Select>
</FormField>
<FormField label="Cidade" htmlFor="seg-cidade">
  <Input id="seg-cidade" value={form.segmentacao.cidade || ''} onChange={...}
    placeholder="Filtrar por cidade" />
</FormField>
```

```tsx
// ANTES — checkbox envio imediato (manter como <input type="checkbox">)
<label className="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" checked={form.envioImediato}
    onChange={(e) => setForm({ ...form, envioImediato: e.target.checked })}
    className="w-4 h-4 text-indigo-600 rounded border-gray-300"
  />
  <span className="text-sm text-gray-700">Enviar imediatamente</span>
</label>

// DEPOIS — manter como está (checkbox não é coberto pelo componente Input)
// O Input component é apenas para text/email/number/date etc.
```

---

## Arquivo 4: Templates.tsx (4 campos)

```tsx
// ANTES — Titulo
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
  <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
    placeholder="Ex: Confirmacao de Agendamento"
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

// DEPOIS
<FormField label="Titulo" htmlFor="titulo" required>
  <Input id="titulo" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
    placeholder="Ex: Confirmacao de Agendamento" />
</FormField>
```

```tsx
// ANTES — Conteudo (textarea)
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Conteudo *</label>
  <textarea value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
    placeholder="Digite sua mensagem. Use {variavel} para placeholders." rows={6}
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

// DEPOIS
<FormField label="Conteudo" htmlFor="conteudo" required>
  <Textarea id="conteudo" value={form.conteudo}
    onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
    placeholder="Digite sua mensagem. Use {variavel} para placeholders."
    rows={6} className="font-mono" />
</FormField>
```

```tsx
// ANTES — inputs de preview de variáveis (lado direito)
{form.variaveis.map((v) => (
  <div key={v}>
    <label className="text-xs text-gray-500 mb-0.5 block capitalize">{v}</label>
    <input value={variavelMap[v] || ''}
      onChange={(e) => setVariavelMap((prev) => ({ ...prev, [v]: e.target.value }))}
      placeholder={`Valor de {${v}}`}
      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
    />
  </div>
))}

// DEPOIS
{form.variaveis.map((v) => (
  <FormField key={v} label={v} htmlFor={`var-${v}`}>
    <Input id={`var-${v}`} value={variavelMap[v] || ''}
      onChange={(e) => setVariavelMap((prev) => ({ ...prev, [v]: e.target.value }))}
      placeholder={`Valor de {${v}}`} />
  </FormField>
))}
```

---

## Arquivo 5: TemplateEditor.tsx (3 campos + DRIFT FIX)

```tsx
// ANTES — Input titulo (drift: border-gray-300, focus:ring-blue-500, rounded-md)
<input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
  placeholder="Ex: Confirmação de Agendamento"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

// DEPOIS (corrige drift para rounded-lg + indigo via componente)
<FormField label="Título do Template" htmlFor="titulo">
  <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)}
    placeholder="Ex: Confirmação de Agendamento" />
</FormField>
```

```tsx
// ANTES — Select canal (drift: border-gray-300, focus:ring-blue-500, rounded-md)
<select value={canal} onChange={(e) => setCanal(e.target.value as TemplateChannel)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
  ...
</select>

// DEPOIS
<FormField label="Canal de Envio" htmlFor="canal">
  <Select id="canal" value={canal} onChange={(e) => setCanal(e.target.value as TemplateChannel)}>
    ...
  </Select>
</FormField>
```

```tsx
// ANTES — Textarea conteudo (drift: border-gray-300, focus:ring-blue-500, rounded-md)
<textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)}
  placeholder="Digite sua mensagem aqui. Use {variavel} para adicionar placeholders."
  rows={8}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
/>

// DEPOIS
<FormField label="Conteúdo da Mensagem" htmlFor="conteudo">
  <Textarea id="conteudo" value={conteudo} onChange={(e) => setConteudo(e.target.value)}
    placeholder="Digite sua mensagem aqui. Use {variavel} para adicionar placeholders."
    rows={8} className="font-mono" />
</FormField>
```

---

## Arquivo 6: Relatorios.tsx (2 campos)

```tsx
// ANTES — inputs de data com label xs
<div>
  <label className="block text-xs font-medium text-gray-500 mb-1">Data Inicio</label>
  <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)}
    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>
<div>
  <label className="block text-xs font-medium text-gray-500 mb-1">Data Fim</label>
  <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)}
    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

// DEPOIS
<FormField label="Data Inicio" htmlFor="dataInicio">
  <Input id="dataInicio" type="date" value={dataInicio}
    onChange={(e) => setDataInicio(e.target.value)} className="w-auto" />
</FormField>
<FormField label="Data Fim" htmlFor="dataFim">
  <Input id="dataFim" type="date" value={dataFim}
    onChange={(e) => setDataFim(e.target.value)} className="w-auto" />
</FormField>
```
