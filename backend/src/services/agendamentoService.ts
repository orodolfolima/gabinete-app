// Service para Agendamento (Story 1.1.3)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateAgendamentoDTO {
  visitanteId: string;
  dataHora: Date;
  duracao: number; // minutos
  tipo: string; // "visita", "reuniao", etc
  assunto: string;
  responsavel?: string;
}

interface UpdateAgendamentoDTO {
  dataHora?: Date;
  duracao?: number;
  tipo?: string;
  assunto?: string;
  responsavel?: string;
  status?: string;
}

export class AgendamentoService {
  /**
   * Criar novo agendamento
   */
  async create(data: CreateAgendamentoDTO): Promise<any> {
    // Validações
    this.validarDados(data);

    // Verificar conflito de horário
    const conflito = await this.detectarConflito(
      data.dataHora,
      data.duracao,
      null, // novo agendamento, sem ID
    );

    if (conflito) {
      throw new Error(
        `Conflito de horário detectado com agendamento ${conflito.id} `
          + `(${conflito.dataHora} - ${new Date(new Date(conflito.dataHora).getTime() + conflito.duracao * 60000).toLocaleTimeString()})`,
      );
    }

    // Verificar se visitante existe
    const visitante = await prisma.visitante.findUnique({
      where: { id: data.visitanteId },
    });

    if (!visitante || visitante.deletedAt) {
      throw new Error('Visitante não encontrado');
    }

    // Criar agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        visitanteId: data.visitanteId,
        dataHora: new Date(data.dataHora),
        duracao: data.duracao,
        tipo: data.tipo,
        assunto: data.assunto,
        responsavel: data.responsavel || 'sistema',
        status: 'agendado',
      },
      include: { visitante: true },
    });

    // Disparar webhook para notificação 24h antes (n8n)
    await this.dispararNotificacao(agendamento, 'agendamento_confirmado');

    return agendamento;
  }

  /**
   * Listar agendamentos por período
   */
  async list(dataInicio: Date, dataFim: Date): Promise<any[]> {
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: {
          gte: dataInicio,
          lte: dataFim,
        },
        status: { not: 'cancelado' },
      },
      include: { visitante: true },
      orderBy: { dataHora: 'asc' },
    });

    return agendamentos;
  }

  /**
   * Obter agendamento por ID
   */
  async getById(id: string): Promise<any> {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: { visitante: { include: { endereco: true } } },
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    return agendamento;
  }

  /**
   * Atualizar agendamento
   */
  async update(id: string, data: UpdateAgendamentoDTO): Promise<any> {
    const agendamento = await this.getById(id);

    // Se mudou data/hora, verificar novos conflitos
    if (data.dataHora || data.duracao) {
      const novaDataHora = data.dataHora || agendamento.dataHora;
      const novaDuracao = data.duracao || agendamento.duracao;

      const conflito = await this.detectarConflito(novaDataHora, novaDuracao, id);

      if (conflito) {
        throw new Error('Conflito de horário detectado');
      }
    }

    this.validarDados({
      visitanteId: agendamento.visitanteId,
      dataHora: data.dataHora || agendamento.dataHora,
      duracao: data.duracao || agendamento.duracao,
      tipo: data.tipo || agendamento.tipo,
      assunto: data.assunto || agendamento.assunto,
    });

    const updated = await prisma.agendamento.update({
      where: { id },
      data: {
        dataHora: data.dataHora,
        duracao: data.duracao,
        tipo: data.tipo,
        assunto: data.assunto,
        responsavel: data.responsavel,
        status: data.status,
      },
      include: { visitante: true },
    });

    return updated;
  }

  /**
   * Cancelar agendamento
   */
  async cancelar(id: string, motivo?: string): Promise<void> {
    await prisma.agendamento.update({
      where: { id },
      data: {
        status: 'cancelado',
      },
    });

    // Registrar interação
    if (motivo) {
      const agendamento = await this.getById(id);
      await prisma.interacao.create({
        data: {
          visitanteId: agendamento.visitanteId,
          tipo: 'cancelamento',
          descricao: motivo,
        },
      });
    }
  }

  /**
   * Check-in: visitante chegou
   */
  async checkIn(id: string): Promise<any> {
    const agendamento = await this.getById(id);

    if (agendamento.status === 'cancelado') {
      throw new Error('Não é possível fazer check-in de agendamento cancelado');
    }

    if (agendamento.checkIn) {
      throw new Error('Check-in já foi realizado');
    }

    const updated = await prisma.agendamento.update({
      where: { id },
      data: {
        checkIn: new Date(),
        status: 'confirmado',
      },
    });

    // Registrar interação
    await prisma.interacao.create({
      data: {
        visitanteId: agendamento.visitanteId,
        tipo: 'check_in',
        descricao: `Check-in realizado para agendamento ${agendamento.assunto}`,
      },
    });

    return updated;
  }

  /**
   * Check-out: visitante saiu
   */
  async checkOut(id: string): Promise<any> {
    const agendamento = await this.getById(id);

    if (!agendamento.checkIn) {
      throw new Error('Check-in não foi realizado');
    }

    if (agendamento.checkOut) {
      throw new Error('Check-out já foi realizado');
    }

    const updated = await prisma.agendamento.update({
      where: { id },
      data: {
        checkOut: new Date(),
        status: 'realizado',
      },
    });

    // Disparar webhook para follow-up
    await this.dispararNotificacao(updated, 'visita_finalizada');

    // Registrar interação
    await prisma.interacao.create({
      data: {
        visitanteId: agendamento.visitanteId,
        tipo: 'check_out',
        descricao: `Check-out realizado após ${Math.round(
          (new Date().getTime() - agendamento.checkIn.getTime()) / 60000,
        )} minutos`,
      },
    });

    return updated;
  }

  /**
   * Detectar conflito de horário
   */
  private async detectarConflito(
    dataHora: Date,
    duracao: number,
    excludeId?: string | null,
  ): Promise<any | null> {
    const inicio = new Date(dataHora);
    const fim = new Date(dataHora.getTime() + duracao * 60000);

    // Buscar agendamentos que se sobrepõem
    const conflitantes = await prisma.agendamento.findMany({
      where: {
        status: { not: 'cancelado' },
        // Agendamento já começou e nosso horário está entre início e fim
        OR: [
          {
            dataHora: { lt: fim },
            // dataHora + duracao > inicio
          },
        ],
      },
      take: 1,
    });

    for (const a of conflitantes) {
      const fimExistente = new Date(
        a.dataHora.getTime() + a.duracao * 60000,
      );
      // Verificar se há sobreposição real
      if (a.dataHora < fim && fimExistente > inicio) {
        // eslint-disable-next-line no-continue
        if (excludeId && a.id === excludeId) continue;
        return a;
      }
    }

    return null;
  }

  /**
   * Validar dados de entrada
   */
  private validarDados(data: CreateAgendamentoDTO): void {
    if (!data.visitanteId || !data.dataHora || !data.duracao) {
      throw new Error('Campos obrigatórios: visitanteId, dataHora, duracao');
    }

    if (data.dataHora < new Date()) {
      throw new Error('Não é possível agendar para data/hora no passado');
    }

    if (data.duracao <= 0 || data.duracao > 480) {
      // max 8h
      throw new Error('Duração deve estar entre 1 e 480 minutos');
    }
  }

  /**
   * Disparar webhook para n8n
   */
  private async dispararNotificacao(
    agendamento: any,
    evento: string,
  ): Promise<void> {
    try {
      const payload = {
        visitanteId: agendamento.visitanteId,
        agendamentoId: agendamento.id,
        data: agendamento.dataHora,
        hora: agendamento.dataHora.toLocaleTimeString(),
        assunto: agendamento.assunto,
      };

      // Dispara para n8n via webhook
      const n8nUrl = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678';
      await fetch(`${n8nUrl}/webhook/${evento}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn(`Webhook não disparou: ${err.message}`);
      });
    } catch (error) {
      console.error('Erro ao disparar notificação:', error);
    }
  }
}

export const agendamentoService = new AgendamentoService();
