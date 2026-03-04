# n8n Workflows — Automação de Comunicação (Story 1.4.2)

## 🎯 Visão Geral

Este documento descreve os 5 workflows n8n que automatizam o envio de mensagens na plataforma SIGGAP.

**n8n é acessível em:** http://localhost:5678

---

## 📊 Workflows Implementados

### 1️⃣ Confirmação de Agendamento

**Trigger:** Webhook `agendamento-confirmado`
**Evento:** Quando um novo agendamento é criado

**Fluxo:**
```
Webhook → Fetch Template (1.4.1 API) → Render variáveis → Enviar SMS → Log
```

**Payloads:**
```json
{
  "visitanteId": "123",
  "agendamentoId": "456",
  "data": "2026-03-05",
  "hora": "14:00",
  "template": "CONFIRMACAO_AGENDAMENTO"
}
```

**Variáveis renderizadas:**
- `{data}` → data do agendamento
- `{hora}` → hora do agendamento

**Saída:** SMS enviado com sucesso

---

### 2️⃣ Lembrete 24 Horas Antes

**Trigger:** Webhook `agendamento-lembrete-24h`
**Evento:** Agendado para rodar 24h antes (via n8n Cron ou chamada externa)

**Fluxo:**
```
Webhook → Fetch Visitante → Fetch Template → Render → WhatsApp → Log
```

**Payloads:**
```json
{
  "visitanteId": "123",
  "data": "2026-03-05",
  "hora": "14:00"
}
```

**Variáveis:**
- `{nome}` → nome visitante
- `{hora}` → hora agendamento
- `{parlamentar}` → nome do parlamentar

**Saída:** Mensagem WhatsApp enviada

---

### 3️⃣ Lembrete 2 Horas Antes

**Trigger:** Webhook `agendamento-lembrete-2h`
**Evento:** Agendado para rodar 2h antes

**Fluxo:**
```
Webhook → Fetch Visitante → Fetch Template → Render → SMS → Log
```

**Payloads:**
```json
{
  "visitanteId": "123",
  "hora": "14:00"
}
```

---

### 4️⃣ Follow-up Pós-Visita

**Trigger:** Webhook `visita-finalizada`
**Evento:** Após check-out do visitante

**Fluxo:**
```
Webhook → Fetch Visitante → Fetch Template → Render → Email → Log
```

**Payloads:**
```json
{
  "visitanteId": "123",
  "agendamentoId": "456"
}
```

**Variáveis:**
- `{nome}` → nome visitante
- `{parlamentar}` → nome do parlamentar

---

### 5️⃣ Notificação de Demanda Criada

**Trigger:** Webhook `demanda-criada`
**Evento:** Quando uma nova demanda é registrada

**Fluxo:**
```
Webhook → Fetch Demanda → Fetch Responsável → Email → Slack (opcional) → Log
```

**Payloads:**
```json
{
  "demandaId": "789",
  "visitanteId": "123",
  "tipo": "saude",
  "titulo": "Pedido de consulta oftalmológica"
}
```

**Destinatário:** Email do responsável

---

## 🔧 Como Adicionar um Novo Workflow

### 1. No n8n Dashboard

1. Abra http://localhost:5678
2. Clique em **"+ Add Workflow"**
3. Adicione um nó **Webhook** como trigger
   - URL Pattern: `/webhook/{seu-webhook-path}`
   - Method: POST
4. Configure os nós conforme necessário
5. Salve e ative o workflow

### 2. Na API Backend

1. Adicione mapeamento em `n8nService.ts`:
```typescript
const workflowWebhooks: Record<string, string> = {
  seu_evento: 'seu-webhook-path',
  // ...
};
```

2. Documente o evento neste arquivo

3. Valide o payload:
```typescript
const camposObrigatorios: Record<string, string[]> = {
  seu_evento: ['campo1', 'campo2'],
  // ...
};
```

---

## 📝 Estrutura de Nós Recomendada

### Nó 1: Webhook (Trigger)
- **Type:** Webhook
- **Method:** POST
- **URL:** /webhook/{seu-evento}

### Nó 2: Fetch Template (se aplicável)
- **Type:** HTTP Request
- **Method:** GET
- **URL:** http://backend:5000/api/templates/{templateId}

### Nó 3: Render Variáveis
- **Type:** Function (Node.js)
- **Script:**
```javascript
const template = $input.first().json();
const payload = $input.last().json();

const conteudo = template.conteudo;
let renderizado = conteudo;

// Substituir variáveis
for (const [key, value] of Object.entries(payload)) {
  renderizado = renderizado.replace(new RegExp(`{${key}}`, 'g'), String(value));
}

return {
  ...template,
  conteudo: renderizado,
  variavelMap: payload
};
```

### Nó 4: Enviar Mensagem
- **Type:** HTTP Request / Webhook Customizado
- **Integração com:** WhatsApp API / SMS Gateway / Email

### Nó 5: Log/Error Handler
- **Type:** Webhook (log) ou Database Insert

---

## 🔐 Credenciais Necessárias

Adicione em `.env`:

```bash
# n8n
N8N_URL=http://n8n:5678
N8N_API_KEY=sua_chave_api

# Integrações de Mensagem
WHATSAPP_API_URL=https://api.whatsapp.com/...
WHATSAPP_API_TOKEN=seu_token

SMS_GATEWAY_API_KEY=sua_chave
SMS_GATEWAY_SENDER=seu_numero

SENDGRID_API_KEY=sua_chave  # Para Email

# Notificações
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

---

## 📊 Monitoramento

### Ver Execuções
```bash
curl http://localhost:5000/api/webhooks/n8n/status
```

### Health Check
```bash
curl http://localhost:5000/api/webhooks/n8n/health
```

### Logs n8n
```bash
docker logs siggap-n8n
```

---

## 🐛 Troubleshooting

### Webhook não dispara
1. Verific que n8n está rodando: `docker ps | grep n8n`
2. Health check: `curl http://localhost:5678/healthz`
3. Verifique logs: `docker logs siggap-n8n`

### Mensagens não são enviadas
1. Verifique credenciais em `.env`
2. Teste a integração de mensagens diretamente
3. Verifique logs de execução no n8n Dashboard

### Execução trava (Waiting)
1. Pode estar aguardando resposta de API externa
2. Aumente timeout no nó HTTP Request
3. Adicione handler de erro com retry

---

## 📚 Referências

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Webhooks](https://docs.n8n.io/nodes/n8n-nodes-base.webhook/)
- [n8n HTTP Request](https://docs.n8n.io/nodes/n8n-nodes-base.httpRequest/)

---

**Última atualização:** 2026-03-04
**Executor:** @dev / @devops
