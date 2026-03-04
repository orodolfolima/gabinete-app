-- CreateTableSTATEMENT: templates (Story 1.4.1)
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "variaveis" TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "criadorId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Template_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable: TemplateVersao
CREATE TABLE "TemplateVersao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "mudancas" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TemplateVersao_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Template_canal_idx" ON "Template"("canal");

-- CreateIndex
CREATE INDEX "Template_ativo_idx" ON "Template"("ativo");

-- CreateIndex
CREATE INDEX "Template_criadoEm_idx" ON "Template"("criadoEm");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersao_templateId_numero_key" ON "TemplateVersao"("templateId", "numero");

-- CreateIndex
CREATE INDEX "TemplateVersao_templateId_idx" ON "TemplateVersao"("templateId");
