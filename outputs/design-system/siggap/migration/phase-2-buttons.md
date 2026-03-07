# Fase 2 — Migrar Botões

**Objetivo:** Substituir 39 `<button>` inline pelo `<Button>` do design system
**Pré-requisito:** `import { Button } from '../components/ui'` em cada arquivo
**Validação:** `npm test && npm run lint && npm run typecheck` após cada arquivo

---

## Arquivo 1: Visitantes.tsx (12 botões)

### Botão "Novo Visitante" (header CTA)
```tsx
// ANTES
<button
  onClick={() => { setShowForm(true); setEditando(null); setForm({ cpf: '', nome: '' }); }}
  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
>
  <Plus className="w-4 h-4" /> Novo Visitante
</button>

// DEPOIS
<Button onClick={() => { setShowForm(true); setEditando(null); setForm({ cpf: '', nome: '' }); }}>
  <Plus className="w-4 h-4" /> Novo Visitante
</Button>
```

### Botão empty-state ghost
```tsx
// ANTES
<button
  onClick={() => setShowForm(true)}
  className="mt-3 text-indigo-600 font-medium text-sm hover:text-indigo-700"
>
  + Cadastrar primeiro visitante
</button>

// DEPOIS
<Button variant="ghost" size="sm" className="mt-3" onClick={() => setShowForm(true)}>
  + Cadastrar primeiro visitante
</Button>
```

### Botões icon-view, icon-edit, icon-delete (tabela)
```tsx
// ANTES
<button onClick={() => handleViewDetail(v)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Ver detalhes">
  <Eye className="w-4 h-4" />
</button>
<button onClick={() => handleEdit(v)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
  <MessageCircle className="w-4 h-4" />
</button>
<button onClick={() => handleDelete(v.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remover">
  <Trash2 className="w-4 h-4" />
</button>

// DEPOIS
<Button variant="icon-view" size="icon" onClick={() => handleViewDetail(v)} title="Ver detalhes">
  <Eye className="w-4 h-4" />
</Button>
<Button variant="icon-edit" size="icon" onClick={() => handleEdit(v)} title="Editar">
  <MessageCircle className="w-4 h-4" />
</Button>
<Button variant="icon-delete" size="icon" onClick={() => handleDelete(v.id)} title="Remover">
  <Trash2 className="w-4 h-4" />
</Button>
```

### Botões de paginação
```tsx
// ANTES
<button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
  <ChevronLeft className="w-4 h-4" />
</button>
<button onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * limite >= total}
  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
  <ChevronRight className="w-4 h-4" />
</button>

// DEPOIS
<Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
  <ChevronLeft className="w-4 h-4" />
</Button>
<Button variant="outline" size="icon" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * limite >= total}>
  <ChevronRight className="w-4 h-4" />
</Button>
```

### Modal Form — fechar, Salvar, Cancelar
```tsx
// ANTES
<button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
  <X className="w-4 h-4" />
</button>
// ...
<button onClick={handleSubmit} disabled={loading}
  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium text-sm">
  <Save className="w-4 h-4" />
  {loading ? 'Salvando...' : 'Salvar'}
</button>
<button onClick={() => setShowForm(false)}
  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
  Cancelar
</button>

// DEPOIS
<Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
  <X className="w-4 h-4" />
</Button>
// ...
<Button className="flex-1" onClick={handleSubmit} disabled={loading} isLoading={loading} loadingLabel="Salvando...">
  <Save className="w-4 h-4" /> Salvar
</Button>
<Button variant="secondary" onClick={() => setShowForm(false)}>
  Cancelar
</Button>
```

### Modal Detail — fechar, Adicionar interação, fechar detail
```tsx
// ANTES (fechar detail)
<button onClick={() => setShowDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg">
  <X className="w-4 h-4" />
</button>
// ...
<button onClick={handleAddInteracao} disabled={!interacaoTipo || !interacaoDesc}
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300">
  Adicionar
</button>

// DEPOIS
<Button variant="ghost" size="icon" onClick={() => setShowDetail(null)}>
  <X className="w-4 h-4" />
</Button>
// ...
<Button size="sm" onClick={handleAddInteracao} disabled={!interacaoTipo || !interacaoDesc}>
  Adicionar
</Button>
```

---

## Arquivo 2: Templates.tsx (9 botões)

### Botão "Novo Template" (header CTA)
```tsx
// ANTES
<button onClick={...} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
  <Plus className="w-4 h-4" /> Novo Template
</button>

// DEPOIS
<Button onClick={...}>
  <Plus className="w-4 h-4" /> Novo Template
</Button>
```

### Botões de filtro de canal (tabs)
```tsx
// ANTES
{['', 'SMS', 'WHATSAPP', 'EMAIL'].map((canal) => (
  <button key={canal} onClick={() => setFiltroCanal(canal)}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      filtroCanal === canal ? 'bg-indigo-100 text-indigo-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
    }`}>
    {canal || 'Todos'}
  </button>
))}

// DEPOIS
{['', 'SMS', 'WHATSAPP', 'EMAIL'].map((canal) => (
  <Button
    key={canal}
    variant={filtroCanal === canal ? 'primary' : 'outline'}
    size="sm"
    onClick={() => setFiltroCanal(canal)}
  >
    {canal || 'Todos'}
  </Button>
))}
```

### Botões icon no card do template (hover group)
```tsx
// ANTES
<button onClick={() => setShowPreview(t)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Preview">
  <Eye className="w-4 h-4" />
</button>
<button onClick={() => handleEdit(t)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Editar">
  <Edit2 className="w-4 h-4" />
</button>
<button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Remover">
  <Trash2 className="w-4 h-4" />
</button>

// DEPOIS
<Button variant="icon-view" size="icon" onClick={() => setShowPreview(t)} title="Preview">
  <Eye className="w-4 h-4" />
</Button>
<Button variant="icon-edit" size="icon" onClick={() => handleEdit(t)} title="Editar">
  <Edit2 className="w-4 h-4" />
</Button>
<Button variant="icon-delete" size="icon" onClick={() => handleDelete(t.id)} title="Remover">
  <Trash2 className="w-4 h-4" />
</Button>
```

### Modal fechar, Salvar, Cancelar, fechar preview
```tsx
// ANTES (padrão repetido de modais)
<button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
// ...
<button onClick={handleSubmit} disabled={loading}
  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium text-sm">
  <Save className="w-4 h-4" />{loading ? 'Salvando...' : 'Salvar Template'}
</button>
<button onClick={() => setShowEditor(false)}
  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
  Cancelar
</button>
<button onClick={() => setShowPreview(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>

// DEPOIS
<Button variant="ghost" size="icon" onClick={() => setShowEditor(false)}><X className="w-4 h-4" /></Button>
// ...
<Button className="flex-1" onClick={handleSubmit} disabled={loading} isLoading={loading} loadingLabel="Salvando...">
  <Save className="w-4 h-4" /> Salvar Template
</Button>
<Button variant="secondary" onClick={() => setShowEditor(false)}>Cancelar</Button>
<Button variant="ghost" size="icon" onClick={() => setShowPreview(null)}><X className="w-4 h-4" /></Button>
```

---

## Arquivo 3: Agendamentos.tsx (7 botões)

### Header CTA, fechar modal, Agendar, Cancelar
```tsx
// Header CTA
<Button onClick={() => setShowForm(true)}>
  <Plus className="w-4 h-4" /> Novo Agendamento
</Button>

// Fechar modal
<Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
  <X className="w-4 h-4" />
</Button>

// Salvar
<Button className="flex-1" onClick={handleSubmit} disabled={loading} isLoading={loading} loadingLabel="Salvando...">
  <Save className="w-4 h-4" /> Agendar
</Button>

// Cancelar
<Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
```

### Botões de ação inline (check-in, check-out, cancelar agendamento)
```tsx
// ANTES
<button onClick={() => handleCheckIn(ag.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Check-in">
  <LogIn className="w-4 h-4" />
</button>
<button onClick={() => handleCheckOut(ag.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Check-out">
  <LogOut className="w-4 h-4" />
</button>
<button onClick={() => handleCancel(ag.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancelar">
  <X className="w-4 h-4" />
</button>

// DEPOIS
// Nota: estes têm cores semânticas específicas (blue, green) — usar icon-view/icon-delete como aproximação
// ou manter com className customizado por ser semanticamente diferente dos padrões de CRUD
<Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleCheckIn(ag.id)} title="Check-in">
  <LogIn className="w-4 h-4" />
</Button>
<Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50" onClick={() => handleCheckOut(ag.id)} title="Check-out">
  <LogOut className="w-4 h-4" />
</Button>
<Button variant="icon-delete" size="icon" onClick={() => handleCancel(ag.id)} title="Cancelar">
  <X className="w-4 h-4" />
</Button>
```

### Busca de visitante no form (dropdown item buttons)
```tsx
// ANTES
<button key={v.id}
  onClick={() => { setForm({ ...form, visitanteId: v.id }); setBuscaVisitante(v.nome); }}
  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">
  {v.nome} <span className="text-gray-400">({v.cpf})</span>
</button>

// DEPOIS — manter como está (é um item de lista, não um botão semântico de ação)
// Opcional: usar Button variant="ghost" com asChild se necessário
<button key={v.id}
  onClick={() => { setForm({ ...form, visitanteId: v.id }); setBuscaVisitante(v.nome); }}
  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">
  {v.nome} <span className="text-gray-400">({v.cpf})</span>
</button>
```

---

## Arquivo 4: Campanhas.tsx (6 botões)

### Header CTA
```tsx
<Button onClick={() => setShowForm(true)}>
  <Plus className="w-4 h-4" /> Nova Campanha
</Button>
```

### Botão Enviar campanha (inline no card)
```tsx
// ANTES
<button onClick={() => handleSend(c.id)}
  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
  <Zap className="w-3.5 h-3.5" /> Enviar
</button>

// DEPOIS
<Button size="sm" onClick={() => handleSend(c.id)}>
  <Zap className="w-3.5 h-3.5" /> Enviar
</Button>
```

### Modal fechar, Criar Campanha, Cancelar, fechar relatório
```tsx
<Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>

<Button className="flex-1" onClick={handleSubmit} disabled={loading} isLoading={loading} loadingLabel="Criando...">
  <Save className="w-4 h-4" /> Criar Campanha
</Button>

<Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>

<Button variant="ghost" size="icon" onClick={() => setRelatorio(null)}><X className="w-4 h-4" /></Button>
```

---

## Arquivo 5: TemplateEditor.tsx (2 botões + DRIFT FIX)

```tsx
// ANTES (drift: blue-500, rounded-md)
<button onClick={handleSave} disabled={loading}
  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 font-medium">
  {loading ? 'Salvando...' : 'Salvar Template'}
</button>
<button onClick={onCancel} disabled={loading}
  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-200 font-medium">
  Cancelar
</button>

// DEPOIS (corrige drift para indigo + rounded-lg via Button)
<Button className="flex-1" onClick={handleSave} disabled={loading} isLoading={loading} loadingLabel="Salvando...">
  Salvar Template
</Button>
<Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
  Cancelar
</Button>
```

---

## Arquivo 6: Relatorios.tsx (3 botões)

### Botão Exportar CSV
```tsx
// ANTES
<button onClick={handleExportCSV}
  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
  <FileDown className="w-4 h-4" /> Exportar CSV
</button>

// DEPOIS
<Button variant="export" onClick={handleExportCSV}>
  <FileDown className="w-4 h-4" /> Exportar CSV
</Button>
```

### Botão Gerar Relatório
```tsx
// ANTES
<button onClick={handleCarregar} disabled={loading}
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400">
  {loading ? 'Carregando...' : 'Gerar Relatorio'}
</button>

// DEPOIS
<Button onClick={handleCarregar} disabled={loading} isLoading={loading} loadingLabel="Carregando...">
  Gerar Relatorio
</Button>
```

### Botões de tab (Atendimento / Visitantes)
```tsx
// ANTES
<button onClick={() => setActiveTab('atendimento')}
  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
    activeTab === 'atendimento' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
  }`}>
  Atendimento
</button>
<button onClick={() => setActiveTab('visitantes')}
  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
    activeTab === 'visitantes' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
  }`}>
  Visitantes
</button>

// DEPOIS — os tabs têm fundo bg-gray-100 como wrapper, manter className para shadow-sm
// Usar Button mas preservar o shadow-sm do tab ativo
<Button size="sm" variant={activeTab === 'atendimento' ? 'secondary' : 'ghost'}
  className={activeTab === 'atendimento' ? 'shadow-sm' : ''}
  onClick={() => setActiveTab('atendimento')}>
  Atendimento
</Button>
<Button size="sm" variant={activeTab === 'visitantes' ? 'secondary' : 'ghost'}
  className={activeTab === 'visitantes' ? 'shadow-sm' : ''}
  onClick={() => setActiveTab('visitantes')}>
  Visitantes
</Button>
```
