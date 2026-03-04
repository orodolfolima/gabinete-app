// Service para Campanhas (Story 1.4.3)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CriarCampanhaDTO {
  titulo: string;
  templateId: string;
  segmentacao: {
    categoria?: string;
    cidade?: string;
    dataMinima?: Date;
    ultVisita?: number; // dias desde última visita
    tags?: string[];
  };
  envioImediato?: boolean;
  dataAgendamento?: Date;
}

interface RelatorioEnvio {
  total: number;
  entregues: number;
  falhas: number;
  bounces: number;
  taxaEntrega: number; // %
}

export class CampanhaService {
  private readonly LIMITE_DIARIO = 10000; // 10k envios/dia

  private readonly BLACKLIST = new Set<string>(); // Em produção usar DB

  /**
   * Criar nova campanha
   */
  async criar(data: CriarCampanhaDTO): Promise<any> {
    if (!data.titulo || !data.templateId) {
      throw new Error('Campos obrigatórios: titulo, templateId');
    }

    // Validar template existe
    const template = await prisma.template.findUnique({
      where: { id: data.templateId },
    });

    if (!template) {
      throw new Error('Template não encontrado');
    }

    // Segmentar visitantes
    const visitantes = await this.segmentar(data.segmentacao);

    if (visitantes.length === 0) {
      throw new Error('Nenhum visitante corresponde aos critérios de segmentação');
    }

    if (visitantes.length < 10) {
      throw new Error('Mínimo 10 destinatários para campanha');
    }

    if (visitantes.length > 10000) {
      throw new Error('Máximo 10.000 destinatários por campanha');
    }

    // Criar campanha
    const campanha = {
      id: Math.random().toString(36).substring(7),
      titulo: data.titulo,
      templateId: data.templateId,
      destinatarios: visitantes.length,
      segmentacao: JSON.stringify(data.segmentacao),
      status: 'criada',
      dataAgendamento: data.dataAgendamento,
      criadoEm: new Date(),
    };

    // Se envio imediato, disparar agora
    if (data.envioImediato) {
      await this.enviar(campanha.id);
    }

    return campanha;
  }

  /**
   * Segmentar visitantes pelos critérios
   */
  private async segmentar(criterios: any): Promise<string[]> {
    const where: any = { deletedAt: null };

    if (criterios.categoria) {
      where.categoria = criterios.categoria;
    }

    if (criterios.cidade) {
      where.endereco = { cidade: criterios.cidade };
    }

    if (criterios.dataMinima) {
      where.createdAt = { gte: criterios.dataMinima };
    }

    // Filtro de última visita (dias)
    if (criterios.ultVisita) {
      const dateLimite = new Date(
        Date.now() - criterios.ultVisita * 24 * 60 * 60 * 1000,
      );
      where.agendamentos = {
        some: { dataHora: { gte: dateLimite } },
      };
    }

    const visitantes = await prisma.visitante.findMany({
      where,
      select: { id: true },
    });

    return visitantes
      .map((v) => v.id)
      .filter((id) => !this.BLACKLIST.has(id));
  }

  /**
   * Enviar campanha
   */
  async enviar(campanhaId: string): Promise<RelatorioEnvio> {
    // Verificar limite diário
    const enviohoje = Math.random() * 5000; // Simulado
    if (enviohoje > this.LIMITE_DIARIO) {
      throw new Error(`Limite diário de ${this.LIMITE_DIARIO} envios atingido`);
    }

    // Simular envio
    const total = 500;
    const entregues = Math.floor(total * 0.95);
    const falhas = Math.floor(total * 0.03);
    const bounces = total - entregues - falhas;

    // Adicionar bounces à blacklist
    for (let i = 0; i < bounces; i++) {
      this.BLACKLIST.add(`bounced_${i}`);
    }

    const relatorio: RelatorioEnvio = {
      total,
      entregues,
      falhas,
      bounces,
      taxaEntrega: (entregues / total) * 100,
    };

    console.log(
      `Campanha ${campanhaId}: ${relatorio.entregues}/${relatorio.total} entregues`,
    );

    return relatorio;
  }

  /**
   * Obter relatório de campanha
   */
  async getRelatorio(_campanhaId: string): Promise<RelatorioEnvio> {
    // TODO: Implementar busca no BD
    return {
      total: 500,
      entregues: 475,
      falhas: 15,
      bounces: 10,
      taxaEntrega: 95,
    };
  }

  /**
   * Adicionar à blacklist (opt-out)
   */
  async addBlacklist(visitanteId: string): Promise<void> {
    this.BLACKLIST.add(visitanteId);
  }

  /**
   * Obter tamanho da blacklist
   */
  getBlacklistSize(): number {
    return this.BLACKLIST.size;
  }

  /**
   * Validar segmentação (mínimo 10, máximo 10k)
   */
  async validarSegmentacao(criterios: any): Promise<{ count: number; valido: boolean }> {
    const visitantes = await this.segmentar(criterios);
    const count = visitantes.length;
    const valido = count >= 10 && count <= 10000;

    return { count, valido };
  }
}

export const campanhaService = new CampanhaService();
