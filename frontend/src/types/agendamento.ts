import { Visitante } from './visitante';

export interface Agendamento {
  id: string;
  visitanteId: string;
  visitante?: Visitante;
  dataHora: string;
  duracao: number;
  tipo: string;
  assunto: string;
  status: AgendamentoStatus;
  checkIn?: string;
  checkOut?: string;
  responsavel?: string;
  createdAt: string;
  updatedAt: string;
}

export type AgendamentoStatus = 'agendado' | 'confirmado' | 'realizado' | 'cancelado';

export interface CreateAgendamentoRequest {
  visitanteId: string;
  dataHora: string;
  duracao: number;
  tipo: string;
  assunto: string;
  responsavel?: string;
}

export interface AgendamentoListResponse {
  data: Agendamento[];
  total: number;
  periodo: {
    dataInicio: string;
    dataFim: string;
  };
}

export const TIPOS_AGENDAMENTO = [
  { label: 'Visita', value: 'visita' },
  { label: 'Reuniao', value: 'reuniao' },
  { label: 'Audiencia', value: 'audiencia' },
  { label: 'Atendimento', value: 'atendimento' },
] as const;

export const STATUS_LABELS: Record<AgendamentoStatus, string> = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
};

export const STATUS_COLORS: Record<AgendamentoStatus, string> = {
  agendado: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-800',
  realizado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
};
