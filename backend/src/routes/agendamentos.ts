// Routes para Agendamentos (Story 1.1.3)
import { Router, Request, Response } from 'express';
import { agendamentoService } from '../services/agendamentoService';

const router = Router();

/**
 * POST /api/agendamentos
 * Criar novo agendamento
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      visitanteId, dataHora, duracao, tipo, assunto, responsavel,
    } = req.body;

    if (!visitanteId || !dataHora || !duracao || !tipo || !assunto) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: visitanteId, dataHora, duracao, tipo, assunto',
      });
    }

    const agendamento = await agendamentoService.create({
      visitanteId,
      dataHora: new Date(dataHora),
      duracao,
      tipo,
      assunto,
      responsavel,
    });

    res.status(201).json(agendamento);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao criar agendamento',
    });
  }
});

/**
 * GET /api/agendamentos?dataInicio=...&dataFim=...
 * Listar agendamentos por período
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const dataInicio = req.query.dataInicio
      ? new Date(req.query.dataInicio as string)
      : new Date();
    const dataFim = req.query.dataFim
      ? new Date(req.query.dataFim as string)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

    const agendamentos = await agendamentoService.list(dataInicio, dataFim);
    res.json({
      data: agendamentos,
      total: agendamentos.length,
      periodo: { dataInicio, dataFim },
    });
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao listar agendamentos',
    });
  }
});

/**
 * GET /api/agendamentos/:id
 * Obter agendamento por ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const agendamento = await agendamentoService.getById(req.params.id);
    res.json(agendamento);
  } catch (error) {
    res.status(404).json({
      erro: error instanceof Error ? error.message : 'Agendamento não encontrado',
    });
  }
});

/**
 * PUT /api/agendamentos/:id
 * Atualizar agendamento
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const agendamento = await agendamentoService.update(req.params.id, req.body);
    res.json(agendamento);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao atualizar agendamento',
    });
  }
});

/**
 * DELETE /api/agendamentos/:id
 * Cancelar agendamento
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { motivo } = req.body;
    await agendamentoService.cancelar(req.params.id, motivo);
    res.json({ mensagem: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao cancelar agendamento',
    });
  }
});

/**
 * POST /api/agendamentos/:id/check-in
 * Registrar check-in do visitante
 */
router.post('/:id/check-in', async (req: Request, res: Response) => {
  try {
    const agendamento = await agendamentoService.checkIn(req.params.id);
    res.json({
      mensagem: 'Check-in realizado com sucesso',
      agendamento,
    });
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao realizar check-in',
    });
  }
});

/**
 * POST /api/agendamentos/:id/check-out
 * Registrar check-out do visitante
 */
router.post('/:id/check-out', async (req: Request, res: Response) => {
  try {
    const agendamento = await agendamentoService.checkOut(req.params.id);
    res.json({
      mensagem: 'Check-out realizado com sucesso',
      agendamento,
    });
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao realizar check-out',
    });
  }
});

export default router;
