// Service para Relatórios (Story 1.1.5)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RelatorioPeriodo {
  dataInicio: Date;
  dataFim: Date;
}

interface RelatorioAtendimento {
  totalVisitantes: number;
  totalAgendamentos: number;
  agendamentosRealizados: number;
  agendamentosCancelados: number;
  taxaPresenca: number; // %
  tempoMedioAtendimento: number; // minutos
  topCategories: Array<{ categoria: string; count: number }>;
}

interface RelatorioVisitantes {
  totalVisitantes: number;
  novosCadastros: number;
  visitantesAtivos: number;
  porCategoria: Array<{ categoria: string; count: number }>;
  porEstado: Array<{ estado: string; count: number }>;
}

export class RelatorioService {
  /**
   * Gerar relatório de atendimento
   */
  async gerarRelatorioAtendimento(
    periodo: RelatorioPeriodo,
  ): Promise<RelatorioAtendimento> {
    const { dataInicio, dataFim } = periodo;

    // Buscar agendamentos do período
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: { visitante: true },
    });

    const visitantes = new Set(agendamentos.map((a) => a.visitanteId)).size;
    const realizados = agendamentos.filter((a) => a.status === 'realizado').length;
    const cancelados = agendamentos.filter((a) => a.status === 'cancelado').length;
    const taxaPresenca = agendamentos.length > 0
      ? (realizados / agendamentos.length) * 100
      : 0;

    // Tempo médio de atendimento
    const comCheckInOut = agendamentos.filter((a) => a.checkIn && a.checkOut);
    const tempoMedio = comCheckInOut.length > 0
      ? comCheckInOut.reduce((acc, a) => {
        const duracao = a.checkOut!.getTime() - a.checkIn!.getTime();
        return acc + duracao;
      }, 0)
          / comCheckInOut.length
          / 60000
      : 0;

    // Top categorias
    const topCategories = agendamentos
      .reduce(
        (acc, a) => {
          const cat = a.visitante.categoria || 'Sem categoria';
          const existing = acc.find((x) => x.categoria === cat);
          if (existing) existing.count++;
          else acc.push({ categoria: cat, count: 1 });
          return acc;
        },
        [] as Array<{ categoria: string; count: number }>,
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalVisitantes: visitantes,
      totalAgendamentos: agendamentos.length,
      agendamentosRealizados: realizados,
      agendamentosCancelados: cancelados,
      taxaPresenca: Math.round(taxaPresenca * 100) / 100,
      tempoMedioAtendimento: Math.round(tempoMedio * 100) / 100,
      topCategories,
    };
  }

  /**
   * Gerar relatório de visitantes
   */
  async gerarRelatorioVisitantes(
    periodo: RelatorioPeriodo,
  ): Promise<RelatorioVisitantes> {
    const { dataInicio, dataFim } = periodo;

    const visitantes = await prisma.visitante.findMany({
      where: { deletedAt: null },
      include: { endereco: true },
    });

    const novosCadastros = visitantes.filter(
      (v) => v.createdAt >= dataInicio && v.createdAt <= dataFim,
    ).length;

    // Visitantes com agendamentos no período
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: { gte: dataInicio, lte: dataFim },
        status: { not: 'cancelado' },
      },
      select: { visitanteId: true },
    });

    const visitantesAtivos = new Set(agendamentos.map((a) => a.visitanteId))
      .size;

    // Por categoria
    const porCategoria = visitantes
      .reduce(
        (acc, v) => {
          const cat = v.categoria || 'Sem categoria';
          const existing = acc.find((x) => x.categoria === cat);
          if (existing) existing.count++;
          else acc.push({ categoria: cat, count: 1 });
          return acc;
        },
        [] as Array<{ categoria: string; count: number }>,
      )
      .sort((a, b) => b.count - a.count);

    // Por estado
    const porEstado = visitantes
      .filter((v) => v.endereco?.estado)
      .reduce(
        (acc, v) => {
          const est = v.endereco!.estado;
          const existing = acc.find((x) => x.estado === est);
          if (existing) existing.count++;
          else acc.push({ estado: est, count: 1 });
          return acc;
        },
        [] as Array<{ estado: string; count: number }>,
      )
      .sort((a, b) => b.count - a.count);

    return {
      totalVisitantes: visitantes.length,
      novosCadastros,
      visitantesAtivos,
      porCategoria,
      porEstado,
    };
  }

  /**
   * Gerar dados para CSV (visitantes + agendamentos)
   */
  async gerarCSVData(
    periodo: RelatorioPeriodo,
  ): Promise<Array<Record<string, any>>> {
    const { dataInicio, dataFim } = periodo;

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: { gte: dataInicio, lte: dataFim },
      },
      include: { visitante: { include: { endereco: true } } },
      orderBy: { dataHora: 'asc' },
    });

    return agendamentos.map((a) => ({
      agendamento_id: a.id,
      data_hora: a.dataHora.toISOString(),
      visitante_nome: a.visitante.nome,
      visitante_cpf: `***${a.visitante.cpf.slice(-3)}`,
      visitante_categoria: a.visitante.categoria,
      visitante_cidade: a.visitante.endereco?.cidade,
      visitante_estado: a.visitante.endereco?.estado,
      tipo: a.tipo,
      assunto: a.assunto,
      duracao_minutos: a.duracao,
      status: a.status,
      check_in: a.checkIn?.toISOString(),
      check_out: a.checkOut?.toISOString(),
      responsavel: a.responsavel,
    }));
  }

  /**
   * Registrar export no audit log
   */
  async registrarExport(
    formato: string,
    usuarioId: string,
    tipoRelatorio: string,
  ): Promise<void> {
    // TODO: Implementar audit log em tabela
    console.log(`Export: ${formato} - ${tipoRelatorio} by ${usuarioId}`);
  }

  /**
   * Verificar limite de exports/dia
   */
  async verificarLimiteExports(_usuarioId: string): Promise<boolean> {
    // TODO: Implementar limite no BD
    // Por enquanto, sempre retorna true
    return true;
  }
}

export const relatorioService = new RelatorioService();
