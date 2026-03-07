import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send, Plus, X, Save, Users, Zap, BarChart3,
} from 'lucide-react';
import { useCampanhas } from '../hooks/useCampanhas';
import {
  Button, Input, Select, FormField,
} from '../components/ui';
import { useTemplates } from '../hooks/useTemplates';
import { CreateCampanhaRequest, CampanhaRelatorio } from '../types/campanha';
import { CATEGORIAS } from '../types/visitante';

export default function CampanhasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    campanhas, loading, error, list, create, send,
  } = useCampanhas();
  const { templates, list: listTemplates } = useTemplates();

  const [showForm, setShowForm] = useState(searchParams.get('novo') === '1');
  const [relatorio, setRelatorio] = useState<CampanhaRelatorio | null>(null);
  const [form, setForm] = useState<CreateCampanhaRequest>({
    titulo: '', templateId: '', segmentacao: {}, envioImediato: true,
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    list();
  }, [list]);

  useEffect(() => {
    if (showForm && templates.length === 0) listTemplates();
  }, [showForm, templates.length, listTemplates]);

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setShowForm(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async () => {
    setFormError('');
    if (!form.titulo || !form.templateId) {
      setFormError('Titulo e template sao obrigatorios');
      return;
    }
    try {
      const campanha = await create(form);
      if (form.envioImediato) {
        const rel = await send(campanha.id);
        setRelatorio(rel);
      }
      setShowForm(false);
      setForm({
        titulo: '', templateId: '', segmentacao: {}, envioImediato: true,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar campanha');
    }
  };

  const handleSend = async (id: string) => {
    try {
      const rel = await send(id);
      setRelatorio(rel);
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
          <p className="text-gray-500 mt-1">Envio em massa de mensagens</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Nova Campanha
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      {/* List */}
      {loading && campanhas.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : campanhas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma campanha criada</p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => setShowForm(true)}>
            + Criar primeira campanha
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {campanhas.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{c.titulo}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {c.destinatarios} destinatarios
                      </span>
                      <span className="capitalize">{c.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.status === 'enviada' ? 'bg-green-100 text-green-700'
                      : c.status === 'criada' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                  >
                    {c.status}
                  </span>
                  {c.status === 'criada' && (
                    <Button size="sm" onClick={() => handleSend(c.id)}>
                      <Zap className="w-3.5 h-3.5" /> Enviar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Nova Campanha</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{formError}</div>}

              <FormField label="Titulo" htmlFor="titulo" required>
                <Input
                  id="titulo"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Nome da campanha"
                />
              </FormField>

              <FormField label="Template" htmlFor="templateId" required>
                <Select
                  id="templateId"
                  value={form.templateId}
                  onChange={(e) => setForm({ ...form, templateId: e.target.value })}
                >
                  <option value="">Selecione um template...</option>
                  {templates.filter((t) => t.ativo).map((t) => (
                    <option key={t.id} value={t.id}>{t.titulo} ({t.canal})</option>
                  ))}
                </Select>
              </FormField>

              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Segmentacao</p>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Categoria" htmlFor="seg-categoria">
                    <Select
                      id="seg-categoria"
                      value={form.segmentacao.categoria || ''}
                      onChange={(e) => setForm({
                        ...form,
                        segmentacao: { ...form.segmentacao, categoria: e.target.value || undefined },
                      })}
                    >
                      <option value="">Todas</option>
                      {CATEGORIAS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Cidade" htmlFor="seg-cidade">
                    <Input
                      id="seg-cidade"
                      value={form.segmentacao.cidade || ''}
                      onChange={(e) => setForm({
                        ...form,
                        segmentacao: { ...form.segmentacao, cidade: e.target.value || undefined },
                      })}
                      placeholder="Filtrar por cidade"
                    />
                  </FormField>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                {/* eslint-disable-next-line no-restricted-syntax -- checkbox nativo: não coberto pelo componente <Input> */}
                <input
                  type="checkbox"
                  checked={form.envioImediato}
                  onChange={(e) => setForm({ ...form, envioImediato: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Enviar imediatamente</span>
              </label>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <Button className="flex-1" onClick={handleSubmit} disabled={loading} isLoading={loading} loadingLabel="Criando...">
                <Save className="w-4 h-4" /> Criar Campanha
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {relatorio && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRelatorio(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Relatorio de Envio
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setRelatorio(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total" value={relatorio.total} color="text-gray-900" />
              <StatCard label="Entregues" value={relatorio.entregues} color="text-green-600" />
              <StatCard label="Falhas" value={relatorio.falhas} color="text-red-600" />
              <StatCard label="Bounces" value={relatorio.bounces} color="text-yellow-600" />
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{relatorio.taxaEntrega.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Taxa de Entrega</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
