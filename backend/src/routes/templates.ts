// Routes para Templates (Story 1.4.1)
import { Router, Request, Response } from 'express';
import { templateService } from '../services/templateService';
import { CreateTemplateDTO, UpdateTemplateDTO } from '../types/template';

const router = Router();

/**
 * POST /api/templates
 * Criar novo template
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreateTemplateDTO = req.body;
    const criadorId = req.user?.id || 'sistema'; // TODO: implementar autenticação

    // Validar campos obrigatórios
    if (!data.titulo || !data.conteudo || !data.canal) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: titulo, conteudo, canal',
      });
    }

    const template = await templateService.create(data, criadorId);
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao criar template',
    });
  }
});

/**
 * GET /api/templates
 * Listar templates com filtros
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const canal = req.query.canal as string | undefined;
    const ativo = req.query.ativo === 'true' ? true : req.query.ativo === 'false' ? false : undefined;
    const skip = Math.max(0, parseInt(req.query.skip as string) || 0);
    const take = Math.min(100, parseInt(req.query.take as string) || 20);

    const result = await templateService.list(canal, ativo, skip, take);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao listar templates',
    });
  }
});

/**
 * GET /api/templates/:id
 * Obter template por ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const template = await templateService.getById(req.params.id);
    if (!template) {
      return res.status(404).json({ erro: 'Template não encontrado' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao obter template',
    });
  }
});

/**
 * PUT /api/templates/:id
 * Atualizar template (cria nova versão)
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data: UpdateTemplateDTO = req.body;
    const criadorId = req.user?.id || 'sistema'; // TODO: implementar autenticação

    const template = await templateService.update(req.params.id, data, criadorId);
    res.json(template);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao atualizar template',
    });
  }
});

/**
 * DELETE /api/templates/:id
 * Deletar template (soft delete)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await templateService.delete(req.params.id);
    res.json({ mensagem: 'Template deletado' });
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao deletar template',
    });
  }
});

/**
 * GET /api/templates/:id/versoes
 * Obter histórico de versões
 */
router.get('/:id/versoes', async (req: Request, res: Response) => {
  try {
    const versoes = await templateService.getVersions(req.params.id);
    res.json(versoes);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao obter versões',
    });
  }
});

/**
 * POST /api/templates/:id/preview
 * Gerar preview com substituição de variáveis
 */
router.post('/:id/preview', async (req: Request, res: Response) => {
  try {
    const variavelMap = req.body.variaveis || {};
    const preview = await templateService.preview(req.params.id, variavelMap);
    res.json(preview);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao gerar preview',
    });
  }
});

export default router;
