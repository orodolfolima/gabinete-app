// Routes para Webhooks (Story 1.4.2 - n8n Integration)
import { Router, Request, Response } from 'express';
import { n8nService } from '../services/n8nService';

const router = Router();

/**
 * POST /api/webhooks/n8n/:event
 * Dispara workflow n8n para evento específico
 */
router.post('/:event', async (req: Request, res: Response) => {
  try {
    const { event } = req.params;
    const data = req.body;

    // Validar evento
    const validEvents = [
      'agendamento_confirmado',
      'agendamento_lembrete_24h',
      'agendamento_lembrete_2h',
      'visita_finalizada',
      'demanda_criada',
      'aviso_geral',
    ];

    if (!validEvents.includes(event)) {
      return res.status(400).json({
        erro: `Evento inválido. Permitidos: ${validEvents.join(', ')}`,
      });
    }

    // Validar dados obrigatórios por evento
    const validation = n8nService.validarPayload(event, data);
    if (!validation.valido) {
      return res.status(400).json({ erro: validation.erro });
    }

    // Disparar workflow
    const resultado = await n8nService.disparar(event, data);

    res.json({
      mensagem: 'Workflow disparado com sucesso',
      executionId: resultado.executionId,
      workflow: resultado.workflowName,
    });
  } catch (error) {
    console.error('Erro ao disparar workflow:', error);
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao disparar workflow',
    });
  }
});

/**
 * GET /api/webhooks/n8n/status/:executionId
 * Obter status de execução do workflow
 */
router.get('/status/:executionId', async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;
    const status = await n8nService.obterStatus(executionId);

    if (!status) {
      return res.status(404).json({ erro: 'Execução não encontrada' });
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao obter status',
    });
  }
});

/**
 * GET /api/webhooks/n8n/health
 * Health check de n8n
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = await n8nService.health();
    const status = health.ok ? 200 : 503;
    res.status(status).json(health);
  } catch (error) {
    res.status(503).json({
      ok: false,
      erro: 'n8n não está respondendo',
    });
  }
});

export default router;
