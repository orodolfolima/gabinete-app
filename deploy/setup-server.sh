#!/bin/bash
# ===========================================
# SIGGAP - Setup Script para VPS Ubuntu
# Domínio: gabinete.rlautomacoes.com
# ===========================================

set -e

DOMAIN="gabinete.rlautomacoes.com"
APP_DIR="/opt/gabinete-app"
REPO="https://github.com/orodolfolima/gabinete-app.git"

echo "=========================================="
echo "  SIGGAP - Setup do Servidor"
echo "  Domínio: $DOMAIN"
echo "=========================================="

# 1. Atualizar sistema
echo "[1/7] Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Docker
echo "[2/7] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "Docker já instalado."
fi

# 3. Instalar Docker Compose plugin
echo "[3/7] Verificando Docker Compose..."
if ! docker compose version &> /dev/null; then
    apt install -y docker-compose-plugin
fi

# 4. Instalar Nginx + Certbot
echo "[4/7] Instalando Nginx e Certbot..."
apt install -y nginx certbot python3-certbot-nginx

# 5. Clonar repositório
echo "[5/7] Clonando repositório..."
if [ -d "$APP_DIR" ]; then
    echo "Diretório já existe. Atualizando..."
    cd "$APP_DIR" && git pull
else
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# 6. Configurar variáveis de ambiente
echo "[6/7] Configurando ambiente..."
if [ ! -f "$APP_DIR/.env" ]; then
    DB_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 20)
    cat > "$APP_DIR/.env" <<EOL
DB_PASSWORD=$DB_PASS
API_URL=https://$DOMAIN
FRONTEND_URL=https://$DOMAIN
EOL
    echo "Arquivo .env criado com senha gerada automaticamente."
    echo "Senha do banco: $DB_PASS (salve em local seguro!)"
else
    echo "Arquivo .env já existe."
fi

# 7. Configurar Nginx
echo "[7/7] Configurando Nginx..."
cp "$APP_DIR/deploy/nginx-gabinete.conf" /etc/nginx/sites-available/gabinete
ln -sf /etc/nginx/sites-available/gabinete /etc/nginx/sites-enabled/gabinete
rm -f /etc/nginx/sites-enabled/default

# Testar config do Nginx
nginx -t

# Reiniciar Nginx
systemctl restart nginx

echo ""
echo "=========================================="
echo "  Setup base concluído!"
echo "=========================================="
echo ""
echo "PRÓXIMOS PASSOS (execute manualmente):"
echo ""
echo "1. Subir os containers:"
echo "   cd $APP_DIR && docker compose up -d --build"
echo ""
echo "2. Verificar se está rodando:"
echo "   docker compose ps"
echo "   curl http://localhost:5000/health"
echo ""
echo "3. Gerar certificado SSL (após DNS apontar para este servidor):"
echo "   certbot --nginx -d $DOMAIN"
echo ""
echo "4. Testar HTTPS:"
echo "   curl https://$DOMAIN/health"
echo ""
echo "=========================================="
