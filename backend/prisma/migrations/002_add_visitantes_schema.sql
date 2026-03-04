-- CreateTable: Visitante (Story 1.1.1)
CREATE TABLE "Visitante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL UNIQUE,
    "rg" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "fotoUrl" VARCHAR(500),
    "categoria" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: Endereco
CREATE TABLE "Endereco" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitanteId" TEXT NOT NULL UNIQUE,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Endereco_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: Interacao
CREATE TABLE "Interacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitanteId" TEXT NOT NULL,
    "tipo" TEXT,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Interacao_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: Agendamento
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitanteId" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "duracao" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "responsavel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Agendamento_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: Demanda
CREATE TABLE "Demanda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolo" TEXT NOT NULL UNIQUE,
    "visitanteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "responsavel" TEXT,
    "prazaEstimado" TIMESTAMP(3),
    "dataConclusao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Demanda_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: Tramitacao
CREATE TABLE "Tramitacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "demandaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "statusAnterior" TEXT NOT NULL,
    "statusNovo" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tramitacao_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "Demanda" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Visitante_cpf_idx" ON "Visitante"("cpf");
CREATE INDEX "Visitante_email_idx" ON "Visitante"("email");
CREATE INDEX "Visitante_telefone_idx" ON "Visitante"("telefone");
CREATE INDEX "Visitante_categoria_idx" ON "Visitante"("categoria");

CREATE INDEX "Endereco_visitanteId_idx" ON "Endereco"("visitanteId");

CREATE INDEX "Interacao_visitanteId_idx" ON "Interacao"("visitanteId");
CREATE INDEX "Interacao_data_idx" ON "Interacao"("data");

CREATE INDEX "Agendamento_visitanteId_idx" ON "Agendamento"("visitanteId");
CREATE INDEX "Agendamento_dataHora_idx" ON "Agendamento"("dataHora");
CREATE INDEX "Agendamento_status_idx" ON "Agendamento"("status");

CREATE INDEX "Demanda_visitanteId_idx" ON "Demanda"("visitanteId");
CREATE INDEX "Demanda_status_idx" ON "Demanda"("status");
CREATE INDEX "Demanda_prioridade_idx" ON "Demanda"("prioridade");

CREATE INDEX "Tramitacao_demandaId_idx" ON "Tramitacao"("demandaId");
