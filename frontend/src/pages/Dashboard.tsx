import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, MessageSquare, Send,
  TrendingUp, Clock, ArrowRight, Plus,
} from 'lucide-react';
import { useRelatorios } from '../hooks/useRelatorios';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { RelatorioAtendimento } from '../types/relatorio';
import { Agendamento, STATUS_COLORS } from '../types/agendamento';

export default function Dashboard() {
  const { getAtendimento } = useRelatorios();
  const { list: listAgendamentos } = useAgendamentos();
  const [stats, setStats] = useState<RelatorioAtendimento | null>(null);
  const [agendamentosHoje, setAgendamentosHoje] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hoje = new Date().toISOString().split('T')[0];
        const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0];

        const [statsData, agData] = await Promise.all([
          getAtendimento().catch(() => null),
          listAgendamentos(hoje, amanha).catch(() => ({ data: [] })),
        ]);

        if (statsData) setStats(statsData);
        setAgendamentosHoje(agData.data || []);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAtendimento, listAgendamentos]);

  const cards = [
    {
      title: 'Visitantes',
      value: stats?.totalVisitantes ?? '--',
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      link: '/visitantes',
    },
    {
      title: 'Agendamentos Hoje',
      value: agendamentosHoje.length,
      icon: Calendar,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      link: '/agendamentos',
    },
    {
      title: 'Taxa de Presenca',
      value: stats ? `${stats.taxaPresenca.toFixed(0)}%` : '--',
      icon: TrendingUp,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      link: '/relatorios',
    },
    {
      title: 'Tempo Medio',
      value: stats ? `${stats.tempoMedioAtendimento}min` : '--',
      icon: Clock,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      link: '/relatorios',
    },
  ];

  const quickActions = [
    {
      label: 'Novo Visitante', icon: Users, to: '/visitantes?novo=1', color: 'text-blue-600',
    },
    {
      label: 'Agendar', icon: Calendar, to: '/agendamentos?novo=1', color: 'text-emerald-600',
    },
    {
      label: 'Novo Template', icon: MessageSquare, to: '/templates?novo=1', color: 'text-purple-600',
    },
    {
      label: 'Nova Campanha', icon: Send, to: '/campanhas?novo=1', color: 'text-amber-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visao geral do gabinete</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${card.lightColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agendamentos de Hoje */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Agendamentos de Hoje</h2>
            <Link
              to="/agendamentos"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {agendamentosHoje.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhum agendamento para hoje</p>
              <Link
                to="/agendamentos?novo=1"
                className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:text-indigo-700"
              >
                + Criar agendamento
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {agendamentosHoje.slice(0, 5).map((ag) => (
                <div
                  key={ag.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center min-w-[50px]">
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-400">{ag.duracao}min</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {ag.visitante?.nome || 'Visitante'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{ag.assunto}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[ag.status]}`}>
                    {ag.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acoes Rapidas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acoes Rapidas</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-white">
                  <Plus className={`w-4 h-4 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
