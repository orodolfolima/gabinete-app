// Service para Templates de Mensagens (Story 1.4.1)
import { PrismaClient } from '@prisma/client';
import {
  Template,
  TemplateVersao,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  TemplatePreview,
  CANAL_LIMITES,
  VARIAVEIS_DISPONIVEIS,
} from '../types/template';

const prisma = new PrismaClient();

export class TemplateService {
  /**
   * Criar novo template
   */
  async create(data: CreateTemplateDTO, criadorId: string): Promise<Template> {
    // Validar variáveis
    this.validarVariaveis(data.variaveis);

    // Validar comprimento por canal
    this.validarComprimentoCanal(data.conteudo, data.canal);

    const template = await prisma.template.create({
      data: {
        titulo: data.titulo,
        conteudo: data.conteudo,
        canal: data.canal,
        variaveis: data.variaveis,
        ativo: true,
        versao: 1,
        criadorId,
      },
    });

    // Criar versão inicial
    await prisma.templateVersao.create({
      data: {
        templateId: template.id,
        numero: 1,
        conteudo: data.conteudo,
        mudancas: 'Versão inicial',
      },
    });

    return template as Template;
  }

  /**
   * Listar templates com filtros
   */
  async list(
    canal?: string,
    ativo?: boolean,
    skip = 0,
    take = 20
  ): Promise<{ templates: Template[]; total: number }> {
    const where: any = {};
    if (canal) where.canal = canal;
    if (ativo !== undefined) where.ativo = ativo;

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take,
        orderBy: { criadoEm: 'desc' },
      }),
      prisma.template.count({ where }),
    ]);

    return {
      templates: templates as Template[],
      total,
    };
  }

  /**
   * Obter template por ID
   */
  async getById(id: string): Promise<Template | null> {
    return (await prisma.template.findUnique({
      where: { id },
    })) as Template | null;
  }

  /**
   * Atualizar template (cria nova versão)
   */
  async update(
    id: string,
    data: UpdateTemplateDTO,
    criadorId: string
  ): Promise<Template> {
    const template = await this.getById(id);
    if (!template) throw new Error('Template não encontrado');

    if (data.variaveis) this.validarVariaveis(data.variaveis);
    if (data.conteudo && data.canal)
      this.validarComprimentoCanal(data.conteudo, data.canal);

    // Atualizar template
    const updated = await prisma.template.update({
      where: { id },
      data: {
        titulo: data.titulo ?? template.titulo,
        conteudo: data.conteudo ?? template.conteudo,
        canal: data.canal ?? template.canal,
        variaveis: data.variaveis ?? template.variaveis,
        ativo: data.ativo ?? template.ativo,
        versao: template.versao + 1,
      },
    });

    // Criar nova versão
    await prisma.templateVersao.create({
      data: {
        templateId: id,
        numero: updated.versao,
        conteudo: updated.conteudo,
        mudancas: this.gerarMudancas(template, data),
      },
    });

    return updated as Template;
  }

  /**
   * Deletar template (soft delete)
   */
  async delete(id: string): Promise<void> {
    await prisma.template.update({
      where: { id },
      data: { ativo: false },
    });
  }

  /**
   * Obter histórico de versões
   */
  async getVersions(templateId: string): Promise<TemplateVersao[]> {
    return (await prisma.templateVersao.findMany({
      where: { templateId },
      orderBy: { numero: 'desc' },
    })) as TemplateVersao[];
  }

  /**
   * Preview de template com substituição de variáveis
   */
  async preview(
    templateId: string,
    variavelMap: Record<string, string>
  ): Promise<TemplatePreview> {
    const template = await this.getById(templateId);
    if (!template) throw new Error('Template não encontrado');

    let conteudo = template.conteudo;

    // Substituir variáveis
    for (const [key, value] of Object.entries(variavelMap)) {
      conteudo = conteudo.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    const caracteresUsados = conteudo.length;
    const limiteCanal = CANAL_LIMITES[template.canal];

    return {
      conteudo,
      caracteresUsados,
      limiteCanal,
      avisos: this.gerarAvisos(template.canal, caracteresUsados),
    };
  }

  // === PRIVADOS ===

  private validarVariaveis(variaveis: string[]): void {
    const invalidos = variaveis.filter(
      (v) => !VARIAVEIS_DISPONIVEIS.includes(v as any)
    );
    if (invalidos.length > 0) {
      throw new Error(
        `Variáveis inválidas: ${invalidos.join(', ')}. Permitidas: ${VARIAVEIS_DISPONIVEIS.join(', ')}`
      );
    }
  }

  private validarComprimentoCanal(conteudo: string, canal: string): void {
    const limite = CANAL_LIMITES[canal as keyof typeof CANAL_LIMITES];
    if (conteudo.length > limite) {
      throw new Error(
        `Conteúdo excede limite de ${limite} caracteres para ${canal}`
      );
    }
  }

  private gerarMudancas(
    template: Template,
    data: UpdateTemplateDTO
  ): string {
    const mudancas: string[] = [];
    if (data.titulo && data.titulo !== template.titulo)
      mudancas.push(`Título: "${template.titulo}" → "${data.titulo}"`);
    if (data.conteudo && data.conteudo !== template.conteudo)
      mudancas.push('Conteúdo atualizado');
    if (data.canal && data.canal !== template.canal)
      mudancas.push(`Canal: ${template.canal} → ${data.canal}`);
    if (data.ativo !== undefined && data.ativo !== template.ativo)
      mudancas.push(`Status: ${template.ativo ? 'ativo' : 'inativo'}`);

    return mudancas.length > 0 ? mudancas.join('; ') : 'Sem alterações';
  }

  private gerarAvisos(canal: string, caracteres: number): string[] {
    const avisos: string[] = [];
    const limite = CANAL_LIMITES[canal as keyof typeof CANAL_LIMITES];

    if (limite !== Infinity) {
      const percentual = (caracteres / limite) * 100;
      if (percentual > 90) avisos.push(`Próximo ao limite (${percentual.toFixed(0)}%)`);
      if (percentual > 100)
        avisos.push(`EXCEDE LIMITE em ${caracteres - limite} caracteres`);
    }

    return avisos;
  }
}

export const templateService = new TemplateService();
