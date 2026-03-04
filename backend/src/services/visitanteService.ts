// Service para Visitante CRUD (Story 1.1.2)
import { PrismaClient } from '@prisma/client';
import {
  CreateVisitanteDTO, UpdateVisitanteDTO, validarCPF, validarEmail, validarTelefone,
} from '../types/visitante';

const prisma = new PrismaClient();

interface ListOptions {
  categoria?: string;
  cidade?: string;
  limite?: number;
  offset?: number;
}

export class VisitanteService {
  /**
   * Criar novo visitante
   */
  async create(data: CreateVisitanteDTO): Promise<any> {
    // Validações
    if (!validarCPF(data.cpf)) {
      throw new Error('CPF inválido');
    }

    if (data.email && !validarEmail(data.email)) {
      throw new Error('Email inválido');
    }

    if (data.telefone && !validarTelefone(data.telefone)) {
      throw new Error('Telefone deve ter 11 dígitos');
    }

    // Verificar se CPF já existe
    const existe = await prisma.visitante.findUnique({
      where: { cpf: data.cpf },
    });

    if (existe && !existe.deletedAt) {
      throw new Error('CPF já cadastrado');
    }

    // Criar visitante com endereço
    const visitante = await prisma.visitante.create({
      data: {
        cpf: data.cpf,
        rg: data.rg,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        whatsapp: data.whatsapp,
        categoria: data.categoria,
        endereco: data.endereco
          ? {
            create: {
              cep: data.endereco.cep,
              logradouro: data.endereco.logradouro,
              numero: data.endereco.numero,
              complemento: data.endereco.complemento,
              bairro: data.endereco.bairro,
              cidade: data.endereco.cidade,
              estado: data.endereco.estado,
            },
          }
          : undefined,
      },
      include: { endereco: true },
    });

    return this.sanitize(visitante);
  }

  /**
   * Listar visitantes com filtros e paginação
   */
  async list(options: ListOptions): Promise<{ data: any[]; total: number; limite: number; offset: number; hasMore: boolean }> {
    const limite = Math.min(options.limite || 20, 100); // max 100 por página
    const offset = options.offset || 0;

    const where: any = { deletedAt: null };
    if (options.categoria) where.categoria = options.categoria;
    if (options.cidade) {
      where.endereco = { cidade: options.cidade };
    }

    const [visitantes, total] = await Promise.all([
      prisma.visitante.findMany({
        where,
        include: { endereco: true, interacoes: { take: 3 } }, // últimas 3 interações
        take: limite,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.visitante.count({ where }),
    ]);

    return {
      data: visitantes.map((v) => this.sanitize(v)),
      total,
      limite,
      offset,
      hasMore: offset + limite < total,
    };
  }

  /**
   * Obter visitante por ID
   */
  async getById(id: string): Promise<any> {
    const visitante = await prisma.visitante.findUnique({
      where: { id },
      include: {
        endereco: true,
        interacoes: { orderBy: { data: 'desc' } },
      },
    });

    if (!visitante || visitante.deletedAt) {
      throw new Error('Visitante não encontrado');
    }

    return this.sanitize(visitante);
  }

  /**
   * Buscar visitante por CPF
   */
  async getByCPF(cpf: string): Promise<any> {
    if (!validarCPF(cpf)) {
      throw new Error('CPF inválido');
    }

    const visitante = await prisma.visitante.findUnique({
      where: { cpf },
      include: { endereco: true },
    });

    if (!visitante || visitante.deletedAt) {
      throw new Error('Visitante não encontrado');
    }

    return this.sanitize(visitante);
  }

  /**
   * Atualizar visitante
   */
  async update(id: string, data: UpdateVisitanteDTO): Promise<any> {
    // Validações se campos forem atualizados
    if (data.email && !validarEmail(data.email)) {
      throw new Error('Email inválido');
    }

    if (data.telefone && !validarTelefone(data.telefone)) {
      throw new Error('Telefone inválido');
    }

    const visitante = await prisma.visitante.update({
      where: { id },
      data: {
        rg: data.rg,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        whatsapp: data.whatsapp,
        fotoUrl: data.fotoUrl,
        categoria: data.categoria,
      },
      include: { endereco: true },
    });

    return this.sanitize(visitante);
  }

  /**
   * Soft delete visitante
   */
  async delete(id: string): Promise<void> {
    await prisma.visitante.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Registrar interação
   */
  async addInteracao(visitanteId: string, tipo: string, descricao: string, usuarioId?: string): Promise<any> {
    const interacao = await prisma.interacao.create({
      data: {
        visitanteId,
        tipo,
        descricao,
        usuarioId,
      },
    });

    return interacao;
  }

  /**
   * Obter histórico de interações
   */
  async getInteracoes(visitanteId: string): Promise<any[]> {
    return prisma.interacao.findMany({
      where: { visitanteId },
      orderBy: { data: 'desc' },
    });
  }

  /**
   * Sanitizar dados sensíveis (CPF, RG)
   */
  private sanitize(visitante: any): any {
    const { cpf, rg, ...dados } = visitante;
    return {
      ...dados,
      cpf: `***${cpf.slice(-3)}`, // Mostrar apenas últimos 3 dígitos
      rg: rg ? `***${rg.slice(-3)}` : null,
    };
  }
}

export const visitanteService = new VisitanteService();
