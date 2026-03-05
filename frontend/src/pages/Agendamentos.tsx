import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar, Plus, X, Save, Clock, User,
  LogIn, LogOut, Search,
} from 'lucide-react';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useVisitantes } from '../hooks/useVisitantes';
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
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos status</option>
          {(Object.entries(STATUS_LABELS) as [AgendamentoStatus, string][]).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
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
                      <button
                        onClick={() => handleCheckIn(ag.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Check-in"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>
                    )}
                    {ag.status === 'confirmado' && (
                      <button
                        onClick={() => handleCheckOut(ag.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Check-out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                    {ag.status !== 'cancelado' && ag.status !== 'realizado' && (
                      <button
                        onClick={() => handleCancel(ag.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
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
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{formError}</div>}

              {/* Visitor select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visitante *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={buscaVisitante}
                    onChange={(e) => setBuscaVisitante(e.target.value)}
                    placeholder="Buscar visitante..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {buscaVisitante && (
                  <div className="mt-1 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                    {visitantesFiltrados.slice(0, 5).map((v) => (
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora *</label>
                  <input
                    type="datetime-local"
                    value={form.dataHora}
                    onChange={(e) => setForm({ ...form, dataHora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duracao (min) *</label>
                  <input
                    type="number"
                    value={form.duracao}
                    onChange={(e) => setForm({ ...form, duracao: Number(e.target.value) })}
                    min={1}
                    max={480}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {TIPOS_AGENDAMENTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsavel</label>
                  <input
                    value={form.responsavel || ''}
                    onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
                    placeholder="Nome..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto *</label>
                <input
                  value={form.assunto}
                  onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                  placeholder="Motivo do agendamento..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Salvando...' : 'Agendar'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
