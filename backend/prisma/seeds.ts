// Seeds para templates padrão (Story 1.4.1)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTemplates() {
  // Obter ou criar user sistem
  let sistemUser = await prisma.user.findFirst();
  if (!sistemUser) {
    sistemUser = await prisma.user.create({
      data: {
        email: 'sistema@siggap.local',
        name: 'Sistema SIGGAP',
      },
    });
  }

  const templatesDefault = [
    {
      titulo: 'Confirmação de Agendamento',
      canal: 'SMS',
      conteudo:
        'Seu agendamento foi confirmado para {data} às {hora}. Compareça com antecedência.',
      variaveis: ['data', 'hora'],
      descricao: 'Enviado quando agendamento é criado',
    },
    {
      titulo: 'Lembrete 24 Horas Antes',
      canal: 'WHATSAPP',
      conteudo:
        'Olá {nome}! Lembrando que você tem um agendamento amanhã às {hora} com {parlamentar}. Confirme sua presença.',
      variaveis: ['nome', 'hora', 'parlamentar'],
      descricao: 'Enviado 24h antes do agendamento',
    },
    {
      titulo: 'Lembrete 2 Horas Antes',
      canal: 'SMS',
      conteudo:
        'Último lembrete! Seu agendamento é em 2 horas às {hora}. Não falte!',
      variaveis: ['hora'],
      descricao: 'Enviado 2h antes do agendamento',
    },
    {
      titulo: 'Follow-up Pós-Visita',
      canal: 'EMAIL',
      conteudo:
        'Obrigado pela sua visita, {nome}!\n\nSua demanda foi registrada e será atendida no prazo de até 5 dias úteis.\n\nNecessita de algo mais? Responda este email ou acesse nosso portal.\n\nAtenciosamente,\nGabinete do Deputado {parlamentar}',
      variaveis: ['nome', 'parlamentar'],
      descricao: 'Enviado após visita realizada',
    },
    {
      titulo: 'Pesquisa de Satisfação',
      canal: 'WHATSAPP',
      conteudo:
        'Olá {nome}! Como foi sua experiência conosco? Sua opinião nos ajuda a melhorar.\n\n1. Excelente\n2. Bom\n3. Regular\n4. Ruim',
      variaveis: ['nome'],
      descricao: 'Enviado após conclusão de demanda',
    },
    {
      titulo: 'Aviso Geral',
      canal: 'SMS',
      conteudo:
        'Aviso Importante: {mensagem}. Acesse nosso portal para mais informações.',
      variaveis: ['mensagem'],
      descricao: 'Template flexível para avisos gerais',
    },
  ];

  for (const template of templatesDefault) {
    const existe = await prisma.template.findFirst({
      where: { titulo: template.titulo },
    });

    if (!existe) {
      const created = await prisma.template.create({
        data: {
          titulo: template.titulo,
          conteudo: template.conteudo,
          canal: template.canal,
          variaveis: template.variaveis,
          ativo: true,
          versao: 1,
          criadorId: sistemUser.id,
        },
      });

      // Criar versão inicial
      await prisma.templateVersao.create({
        data: {
          templateId: created.id,
          numero: 1,
          conteudo: template.conteudo,
          mudancas: 'Versão inicial (template padrão)',
        },
      });

      console.log(`✅ Template criado: ${template.titulo}`);
    } else {
      console.log(`⏭️  Template já existe: ${template.titulo}`);
    }
  }

  console.log('✅ Seed de templates concluído');
}

seedTemplates()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
