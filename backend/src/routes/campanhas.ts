// Routes para Campanhas (Story 1.4.3)
import { Router, Request, Response } from 'express';
import { campanhaService } from '../services/campanhaService';

const router = Router();

/**
 * POST /api/campanhas
 * Criar nova campanha
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      titulo, templateId, segmentacao, envioImediato, dataAgendamento,
    } = req.body;

    if (!titulo || !templateId || !segmentacao) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: titulo, templateId, segmentacao',
      });
    }

    // Validar segmentação
    const validacao = await campanhaService.validarSegmentacao(segmentacao);
    if (!validacao.valido) {
      return res.status(400).json({
        erro: `Segmentação deve resultar em 10-10000 destinatários (resultado: ${validacao.count})`,
      });
    }

    const campanha = await campanhaService.criar({
      titulo,
      templateId,
      segmentacao,
      envioImediato,
      dataAgendamento,
    });

    res.status(201).json(campanha);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao criar campanha',
    });
  }
});

/**
 * GET /api/campanhas
 * Listar campanhas
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const _status = req.query.status as string | undefined;
    const limite = Math.min(parseInt(req.query.limite as string) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

    // TODO: Implementar busca no BD
    const campanhas = [
      {
        id: '1',
        titulo: 'Campanha 1',
        status: 'enviada',
        destinatarios: 500,
      },
    ];

    res.json({
      data: campanhas,
      total: campanhas.length,
      limite,
      offset,
    });
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao listar campanhas',
    });
  }
});

/**
 * GET /api/campanhas/:id
 * Obter campanha por ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Implementar busca no BD
    const campanha = {
      id: req.params.id,
      titulo: 'Campanha Teste',
      status: 'enviada',
      destinatarios: 500,
    };

    res.json(campanha);
  } catch (error) {
    res.status(404).json({
      erro: 'Campanha não encontrada',
    });
  }
});

/**
 * PUT /api/campanhas/:id/enviar
 * Enviar campanha imediatamente
 */
router.put('/:id/enviar', async (req: Request, res: Response) => {
  try {
    const relatorio = await campanhaService.enviar(req.params.id);

    res.json({
      mensagem: 'Campanha enviada com sucesso',
      relatorio,
    });
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao enviar campanha',
    });
  }
});

/**
 * GET /api/campanhas/:id/relatorio
 * Obter relatório de envio
 */
router.get('/:id/relatorio', async (req: Request, res: Response) => {
  try {
    const relatorio = await campanhaService.getRelatorio(req.params.id);
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao obter relatório',
    });
  }
});

/**
 * POST /api/campanhas/:id/blacklist
 * Adicionar visitante à blacklist (opt-out)
 */
router.post('/:id/blacklist', async (req: Request, res: Response) => {
  try {
    const { visitanteId } = req.body;

    if (!visitanteId) {
      return res.status(400).json({
        erro: 'Campo obrigatório: visitanteId',
      });
    }

    await campanhaService.addBlacklist(visitanteId);

    res.json({
      mensagem: 'Visitante adicionado à blacklist',
    });
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao adicionar blacklist',
    });
  }
});

export default router;
