import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare, Plus, X, Save, Eye,
  Trash2, Edit2, Smartphone, MessageCircle, Mail,
} from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import {
  Template, CreateTemplateRequest, TemplateChannel,
  CANAL_LABELS, VARIAVEIS_DISPONIVEIS,
} from '../types/template';

const CANAL_ICONS: Record<TemplateChannel, typeof Smartphone> = {
  SMS: Smartphone,
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
};

const CANAL_COLORS: Record<TemplateChannel, string> = {
  SMS: 'bg-blue-100 text-blue-700',
  WHATSAPP: 'bg-green-100 text-green-700',
  EMAIL: 'bg-purple-100 text-purple-700',
};

const CANAL_LIMITES: Record<TemplateChannel, number> = {
  SMS: 160,
  WHATSAPP: 4096,
  EMAIL: Infinity,
};

export default function TemplatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    templates, loading, error,
    list, create, update, delete: deleteTemplate,
  } = useTemplates();

  const [showEditor, setShowEditor] = useState(searchParams.get('novo') === '1');
  const [editando, setEditando] = useState<Template | null>(null);
  const [filtroCanal, setFiltroCanal] = useState('');
  const [showPreview, setShowPreview] = useState<Template | null>(null);

  const [form, setForm] = useState<CreateTemplateRequest>({
    titulo: '', conteudo: '', canal: 'SMS', variaveis: [],
  });
  const [formError, setFormError] = useState('');
  const [variavelMap, setVariavelMap] = useState<Record<string, string>>({});

  useEffect(() => {
    list(filtroCanal || undefined);
  }, [list, filtroCanal]);

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setShowEditor(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleEdit = (t: Template) => {
    setEditando(t);
    setForm({
      titulo: t.titulo, conteudo: t.conteudo, canal: t.canal, variaveis: t.variaveis,
    });
    setShowEditor(true);
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!form.titulo.trim() || !form.conteudo.trim()) {
      setFormError('Titulo e conteudo sao obrigatorios');
      return;
    }
    try {
      if (editando) {
        await update(editando.id, form);
      } else {
        await create(form);
      }
      setShowEditor(false);
      setEditando(null);
      setForm({
        titulo: '', conteudo: '', canal: 'SMS', variaveis: [],
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remover este template?')) return;
    try { await deleteTemplate(id); } catch { /* handled */ }
  };

  const toggleVariavel = (v: string) => {
    setForm((prev) => ({
      ...prev,
      variaveis: prev.variaveis.includes(v)
        ? prev.variaveis.filter((x) => x !== v)
        : [...prev.variaveis, v],
    }));
  };

  // Preview rendering
  const conteudoPreview = useMemo(() => {
    let texto = form.conteudo;
    Object.entries(variavelMap).forEach(([key, value]) => {
      if (value) texto = texto.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    return texto;
  }, [form.conteudo, variavelMap]);

  const limite = CANAL_LIMITES[form.canal];
  const percentual = limite === Infinity ? 0 : (form.conteudo.length / limite) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-500 mt-1">Modelos de mensagens</p>
        </div>
        <button
          onClick={() => {
            setShowEditor(true);
            setEditando(null);
            setForm({
              titulo: '', conteudo: '', canal: 'SMS', variaveis: [],
            });
          }}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Novo Template
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['', 'SMS', 'WHATSAPP', 'EMAIL'].map((canal) => (
          <button
            key={canal}
            onClick={() => setFiltroCanal(canal)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroCanal === canal
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {canal || 'Todos'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Grid */}
      {loading && templates.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum template encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => {
            const Icon = CANAL_ICONS[t.canal];
            return (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${CANAL_COLORS[t.canal]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{t.titulo}</h3>
                      <p className="text-xs text-gray-400">{t.canal} | v{t.versao}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    t.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                  >
                    {t.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-3 min-h-[3.5rem]">
                  {t.conteudo}
                </p>

                {t.variaveis.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.variaveis.map((v) => (
                      <span key={v} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-xs">
                        {`{${v}}`}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    {new Date(t.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setShowPreview(t)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(t)}
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditor(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{editando ? 'Editar Template' : 'Novo Template'}</h2>
              <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                {/* Editor Side */}
                <div className="flex-1 p-6 space-y-4">
                  {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{formError}</div>}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
                    <input
                      value={form.titulo}
                      onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                      placeholder="Ex: Confirmacao de Agendamento"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
                    <div className="flex gap-2">
                      {(Object.entries(CANAL_LABELS) as [TemplateChannel, string][]).map(([key]) => {
                        const Icon = CANAL_ICONS[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setForm({ ...form, canal: key })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              form.canal === key
                                ? CANAL_COLORS[key]
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {key}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variaveis</label>
                    <div className="flex flex-wrap gap-2">
                      {VARIAVEIS_DISPONIVEIS.map((v) => (
                        <button
                          key={v.value}
                          onClick={() => toggleVariavel(v.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            form.variaveis.includes(v.value)
                              ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteudo *</label>
                    <textarea
                      value={form.conteudo}
                      onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                      placeholder="Digite sua mensagem. Use {variavel} para placeholders."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {limite !== Infinity && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{form.conteudo.length} / {limite}</span>
                          <span className={percentual > 100 ? 'text-red-600 font-medium' : 'text-gray-400'}>
                            {percentual.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              percentual <= 70 ? 'bg-green-500'
                                : percentual <= 90 ? 'bg-yellow-500'
                                  : percentual <= 100 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(percentual, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Side */}
                <div className="flex-1 p-6 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>

                  {form.variaveis.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {form.variaveis.map((v) => (
                        <div key={v}>
                          <label className="text-xs text-gray-500 mb-0.5 block capitalize">{v}</label>
                          <input
                            value={variavelMap[v] || ''}
                            onChange={(e) => setVariavelMap((prev) => ({ ...prev, [v]: e.target.value }))}
                            placeholder={`Valor de {${v}}`}
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`p-4 rounded-xl text-sm whitespace-pre-wrap break-words ${
                    form.canal === 'SMS' ? 'bg-blue-50 border border-blue-200'
                      : form.canal === 'WHATSAPP' ? 'bg-green-50 border border-green-200'
                        : 'bg-white border border-gray-200'
                  }`}
                  >
                    {conteudoPreview || '(mensagem vazia)'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Salvando...' : 'Salvar Template'}
              </button>
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{showPreview.titulo}</h3>
              <button onClick={() => setShowPreview(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className={`p-4 rounded-xl text-sm whitespace-pre-wrap ${
              showPreview.canal === 'SMS' ? 'bg-blue-50'
                : showPreview.canal === 'WHATSAPP' ? 'bg-green-50' : 'bg-gray-50'
            }`}
            >
              {showPreview.conteudo}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {showPreview.variaveis.map((v) => (
                <span key={v} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-xs">{`{${v}}`}</span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {showPreview.canal} | v{showPreview.versao} | {new Date(showPreview.criadoEm).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
