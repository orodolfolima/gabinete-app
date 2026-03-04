// Routes para Visitantes (Story 1.1.2)
import { Router, Request, Response } from 'express';
import { visitanteService } from '../services/visitanteService';
import { CreateVisitanteDTO, UpdateVisitanteDTO } from '../types/visitante';

const router = Router();

/**
 * POST /api/visitantes
 * Criar novo visitante
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreateVisitanteDTO = req.body;

    // Validar campos obrigatórios
    if (!data.cpf || !data.nome) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: cpf, nome',
      });
    }

    const visitante = await visitanteService.create(data);
    res.status(201).json(visitante);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao criar visitante',
    });
  }
});

/**
 * GET /api/visitantes
 * Listar visitantes com filtros e paginação
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const categoria = req.query.categoria as string | undefined;
    const cidade = req.query.cidade as string | undefined;
    const limite = Math.min(parseInt(req.query.limite as string) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

    const result = await visitanteService.list({ categoria, cidade, limite, offset });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao listar visitantes',
    });
  }
});

/**
 * GET /api/visitantes/cpf/:cpf
 * Buscar visitante por CPF
 */
router.get('/cpf/:cpf', async (req: Request, res: Response) => {
  try {
    const visitante = await visitanteService.getByCPF(req.params.cpf);
    res.json(visitante);
  } catch (error) {
    res.status(404).json({
      erro: error instanceof Error ? error.message : 'Visitante não encontrado',
    });
  }
});

/**
 * GET /api/visitantes/:id
 * Obter visitante por ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const visitante = await visitanteService.getById(req.params.id);
    res.json(visitante);
  } catch (error) {
    res.status(404).json({
      erro: error instanceof Error ? error.message : 'Visitante não encontrado',
    });
  }
});

/**
 * PUT /api/visitantes/:id
 * Atualizar visitante
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data: UpdateVisitanteDTO = req.body;
    const visitante = await visitanteService.update(req.params.id, data);
    res.json(visitante);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao atualizar visitante',
    });
  }
});

/**
 * DELETE /api/visitantes/:id
 * Soft delete visitante
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await visitanteService.delete(req.params.id);
    res.json({ mensagem: 'Visitante deletado com sucesso' });
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao deletar visitante',
    });
  }
});

/**
 * POST /api/visitantes/:id/interacao
 * Registrar interação com visitante
 */
router.post('/:id/interacao', async (req: Request, res: Response) => {
  try {
    const { tipo, descricao } = req.body;
    const usuarioId = req.user?.id || 'sistema'; // TODO: implementar auth

    if (!tipo || !descricao) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: tipo, descricao',
      });
    }

    const interacao = await visitanteService.addInteracao(
      req.params.id,
      tipo,
      descricao,
      usuarioId
    );

    res.status(201).json(interacao);
  } catch (error) {
    res.status(400).json({
      erro: error instanceof Error ? error.message : 'Erro ao registrar interação',
    });
  }
});

/**
 * GET /api/visitantes/:id/interacoes
 * Obter histórico de interações
 */
router.get('/:id/interacoes', async (req: Request, res: Response) => {
  try {
    const interacoes = await visitanteService.getInteracoes(req.params.id);
    res.json(interacoes);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao obter interações',
    });
  }
});

export default router;
