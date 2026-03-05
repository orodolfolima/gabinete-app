export interface RelatorioAtendimento {
  totalVisitantes: number;
  totalAgendamentos: number;
  agendamentosRealizados: number;
  agendamentosCancelados: number;
  taxaPresenca: number;
  tempoMedioAtendimento: number;
  topCategories: { categoria: string; count: number }[];
}

export interface RelatorioVisitantes {
  totalVisitantes: number;
  novosCadastros: number;
  visitantesAtivos: number;
  porCategoria: { categoria: string; count: number }[];
  porEstado: { estado: string; count: number }[];
}
