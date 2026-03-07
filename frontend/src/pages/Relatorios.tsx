import { useState } from 'react';
import {
  BarChart3, Users, Calendar,
  TrendingUp, Clock, FileDown,
} from 'lucide-react';
import { useRelatorios } from '../hooks/useRelatorios';
import { Button, Input, FormField } from '../components/ui';
import { RelatorioAtendimento, RelatorioVisitantes } from '../types/relatorio';

export default function RelatoriosPage() {
  const {
    loading, error, getAtendimento, getVisitantes, downloadCSV,
  } = useRelatorios();

  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [dataFim, setDataFim] = useState(() => new Date().toISOString().split('T')[0]);
  const [atendimento, setAtendimento] = useState<RelatorioAtendimento | null>(null);
  const [visitantesReport, setVisitantesReport] = useState<RelatorioVisitantes | null>(null);
  const [activeTab, setActiveTab] = useState<'atendimento' | 'visitantes'>('atendimento');

  const handleCarregar = async () => {
    try {
      if (activeTab === 'atendimento') {
        const data = await getAtendimento(dataInicio, dataFim);
        setAtendimento(data);
      } else {
        const data = await getVisitantes(dataInicio, dataFim);
        setVisitantesReport(data);
      }
    } catch {
      // error shown by hook
    }
  };

  const handleExportCSV = async () => {
    try {
      await downloadCSV(dataInicio, dataFim);
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatorios</h1>
          <p className="text-gray-500 mt-1">Analise de atendimento e visitantes</p>
        </div>
        <Button variant="export" onClick={handleExportCSV}>
          <FileDown className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <FormField label="Data Inicio" htmlFor="dataInicio">
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-auto"
            />
          </FormField>
          <FormField label="Data Fim" htmlFor="dataFim">
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-auto"
            />
          </FormField>

          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={activeTab === 'atendimento' ? 'secondary' : 'ghost'}
              className={activeTab === 'atendimento' ? 'shadow-sm' : ''}
              onClick={() => setActiveTab('atendimento')}
            >
              Atendimento
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'visitantes' ? 'secondary' : 'ghost'}
              className={activeTab === 'visitantes' ? 'shadow-sm' : ''}
              onClick={() => setActiveTab('visitantes')}
            >
              Visitantes
            </Button>
          </div>

          <Button onClick={handleCarregar} disabled={loading} isLoading={loading} loadingLabel="Carregando...">
            Gerar Relatorio
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Atendimento Report */}
      {activeTab === 'atendimento' && atendimento && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={Users}
              label="Visitantes Unicos"
              value={String(atendimento.totalVisitantes)}
              color="bg-blue-50 text-blue-600"
            />
            <MetricCard
              icon={Calendar}
              label="Agendamentos"
              value={String(atendimento.totalAgendamentos)}
              color="bg-purple-50 text-purple-600"
            />
            <MetricCard
              icon={TrendingUp}
              label="Taxa de Presenca"
              value={`${atendimento.taxaPresenca.toFixed(1)}%`}
              color="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
              icon={Clock}
              label="Tempo Medio"
              value={`${atendimento.tempoMedioAtendimento} min`}
              color="bg-amber-50 text-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Resumo</h3>
              <div className="space-y-3">
                <BarItem label="Realizados" value={atendimento.agendamentosRealizados} total={atendimento.totalAgendamentos} color="bg-green-500" />
                <BarItem label="Cancelados" value={atendimento.agendamentosCancelados} total={atendimento.totalAgendamentos} color="bg-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Categorias</h3>
              <div className="space-y-3">
                {atendimento.topCategories.map((cat) => (
                  <div key={cat.categoria} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{cat.categoria || 'Sem categoria'}</span>
                    <span className="text-sm font-medium text-gray-900">{cat.count}</span>
                  </div>
                ))}
                {atendimento.topCategories.length === 0 && (
                  <p className="text-sm text-gray-400">Sem dados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visitantes Report */}
      {activeTab === 'visitantes' && visitantesReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              icon={Users}
              label="Total Visitantes"
              value={String(visitantesReport.totalVisitantes)}
              color="bg-blue-50 text-blue-600"
            />
            <MetricCard
              icon={TrendingUp}
              label="Novos Cadastros"
              value={String(visitantesReport.novosCadastros)}
              color="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
              icon={Calendar}
              label="Visitantes Ativos"
              value={String(visitantesReport.visitantesAtivos)}
              color="bg-purple-50 text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Por Categoria</h3>
              <div className="space-y-3">
                {visitantesReport.porCategoria.map((cat) => (
                  <div key={cat.categoria} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{cat.categoria || 'Sem categoria'}</span>
                    <span className="text-sm font-medium text-gray-900">{cat.count}</span>
                  </div>
                ))}
                {visitantesReport.porCategoria.length === 0 && <p className="text-sm text-gray-400">Sem dados</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Por Estado</h3>
              <div className="space-y-3">
                {visitantesReport.porEstado.map((est) => (
                  <div key={est.estado} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{est.estado}</span>
                    <span className="text-sm font-medium text-gray-900">{est.count}</span>
                  </div>
                ))}
                {visitantesReport.porEstado.length === 0 && <p className="text-sm text-gray-400">Sem dados</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!atendimento && !visitantesReport && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            Selecione o periodo e clique em &quot;Gerar Relatorio&quot;
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, color,
}: {
  icon: typeof Users; label: string; value: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-10 h-10 ${color.split(' ')[0]} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function BarItem({
  label, value, total, color,
}: {
  label: string; value: number; total: number; color: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
