import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar, Plus, X, Save, Clock, User,
  LogIn, LogOut, Search,
} from 'lucide-react';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useVisitantes } from '../hooks/useVisitantes';
import { Button, Input, Select, FormField } from '../components/ui';
import {
  CreateAgendamentoRequest, TIPOS_AGENDAMENTO,
  STATUS_COLORS, STATUS_LABELS, AgendamentoStatus,
} from '../types/agendamento';

export default function AgendamentosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    agendamentos, total, loading, error,
    list, create, checkIn, checkOut, cancel,
  } = useAgendamentos();
  const { visitantes, list: listVisitantes } = useVisitantes();

  const [showForm, setShowForm] = useState(searchParams.get('novo') === '1');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [dataFim, setDataFim] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const [form, setForm] = useState<CreateAgendamentoRequest>({
    visitanteId: '', dataHora: '', duracao: 30, tipo: 'visita', assunto: '', responsavel: '',
  });
  const [formError, setFormError] = useState('');
  const [buscaVisitante, setBuscaVisitante] = useState('');

  useEffect(() => {
    list(dataInicio, dataFim);
  }, [list, dataInicio, dataFim]);

  useEffect(() => {
    if (showForm && visitantes.length === 0) {
      listVisitantes({ limite: 100 });
    }
  }, [showForm, visitantes.length, listVisitantes]);

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setShowForm(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async () => {
    setFormError('');
    if (!form.visitanteId || !form.dataHora || !form.assunto) {
      setFormError('Visitante, data/hora e assunto sao obrigatorios');
      return;
    }
    try {
      await create({ ...form, dataHora: new Date(form.dataHora).toISOString() });
      setShowForm(false);
      setForm({
        visitanteId: '', dataHora: '', duracao: 30, tipo: 'visita', assunto: '', responsavel: '',
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar');
    }
  };

  const handleCheckIn = async (id: string) => {
    try { await checkIn(id); } catch { /* handled */ }
  };

  const handleCheckOut = async (id: string) => {
    try { await checkOut(id); } catch { /* handled */ }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancelar este agendamento?')) return;
    try { await cancel(id); } catch { /* handled */ }
  };

  const agendamentosFiltrados = filtroStatus
    ? agendamentos.filter((a) => a.status === filtroStatus)
    : agendamentos;

  const visitantesFiltrados = buscaVisitante
    ? visitantes.filter((v) => v.nome.toLowerCase().includes(buscaVisitante.toLowerCase()))
    : visitantes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-500 mt-1">{total} no periodo</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          className="w-auto"
        />
        <Input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          className="w-auto"
        />
        <Select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="">Todos status</option>
          {(Object.entries(STATUS_LABELS) as [AgendamentoStatus, string][]).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </Select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      {/* List */}
      {loading && agendamentos.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : agendamentosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agendamentosFiltrados.map((ag) => {
            const dt = new Date(ag.dataHora);
            const isPast = dt < new Date();
            return (
              <div
                key={ag.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Date/Time */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="text-center bg-indigo-50 rounded-lg px-3 py-2 min-w-[70px]">
                      <p className="text-xs text-indigo-600 font-medium uppercase">
                        {dt.toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </p>
                      <p className="text-xl font-bold text-indigo-700">{dt.getDate()}</p>
                      <p className="text-xs text-indigo-500">
                        {dt.toLocaleDateString('pt-BR', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-gray-500">{ag.duracao} minutos</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400" />
                      {ag.visitante?.nome || 'Visitante'}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">{ag.assunto}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{ag.tipo}</p>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[ag.status]}`}>
                      {STATUS_LABELS[ag.status]}
                    </span>

                    {ag.status === 'agendado' && !isPast && (
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleCheckIn(ag.id)} title="Check-in">
                        <LogIn className="w-4 h-4" />
                      </Button>
                    )}
                    {ag.status === 'confirmado' && (
                      <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50" onClick={() => handleCheckOut(ag.id)} title="Check-out">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    )}
                    {ag.status !== 'cancelado' && ag.status !== 'realizado' && (
                      <Button variant="icon-delete" size="icon" onClick={() => handleCancel(ag.id)} title="Cancelar">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Novo Agendamento</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{formError}</div>}

              {/* Visitor select */}
              <FormField label="Visitante" htmlFor="visitante" required>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="visitante"
                    value={buscaVisitante}
                    onChange={(e) => setBuscaVisitante(e.target.value)}
                    placeholder="Buscar visitante..."
                    className="pl-10"
                  />
                </div>
                {buscaVisitante && (
                  <div className="mt-1 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                    {visitantesFiltrados.slice(0, 5).map((v) => (
                      // eslint-disable-next-line no-restricted-syntax -- item de lista dropdown: não é ação semântica, é item de seleção
                      <button
                        key={v.id}
                        onClick={() => { setForm({ ...form, visitanteId: v.id }); setBuscaVisitante(v.nome); }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      >
                        {v.nome} <span className="text-gray-400">({v.cpf})</span>
                      </button>
                    ))}
                  </div>
                )}
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Data e Hora" htmlFor="dataHora" required>
                  <Input
                    id="dataHora"
                    type="datetime-local"
                    value={form.dataHora}
                    onChange={(e) => setForm({ ...form, dataHora: e.target.value })}
                  />
                </FormField>
                <FormField label="Duracao (min)" htmlFor="duracao" required>
                  <Input
                    id="duracao"
                    type="number"
                    value={form.duracao}
                    onChange={(e) => setForm({ ...form, duracao: Number(e.target.value) })}
                    min={1}
                    max={480}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Tipo" htmlFor="tipo" required>
                  <Select
                    id="tipo"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  >
                    {TIPOS_AGENDAMENTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Responsavel" htmlFor="responsavel">
                  <Input
                    id="responsavel"
                    value={form.responsavel || ''}
                    onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
                    placeholder="Nome..."
                  />
                </FormField>
              </div>

              <FormField label="Assunto" htmlFor="assunto" required>
                <Input
                  id="assunto"
                  value={form.assunto}
                  onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                  placeholder="Motivo do agendamento..."
                />
              </FormField>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <Button className="flex-1" onClick={handleSubmit} disabled={loading} isLoading={loading} loadingLabel="Salvando...">
                <Save className="w-4 h-4" /> Agendar
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
