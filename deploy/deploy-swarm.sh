#!/bin/bash
# ===========================================
# SIGGAP - Deploy no Docker Swarm + Traefik
# Domínio: gabinete.rlautomacoes.com
# ===========================================

set -e

APP_DIR="/opt/gabinete-app"
DOMAIN="gabinete.rlautomacoes.com"

echo "=========================================="
echo "  SIGGAP - Deploy Swarm + Traefik"
echo "  Domínio: $DOMAIN"
echo "=========================================="

cd "$APP_DIR"

# 1. Carregar variáveis
if [ ! -f .env ]; then
    echo "ERRO: Arquivo .env não encontrado!"
    echo "Crie com: echo 'DB_PASSWORD=SuaSenhaAqui' > .env"
    exit 1
fi

source .env
echo "[1/4] Variáveis carregadas."

# 2. Build das imagens
echo "[2/4] Buildando imagens..."
docker build -t siggap-backend:latest ./backend
docker build -t siggap-frontend:latest \
    --build-arg VITE_API_URL=https://$DOMAIN \
    ./frontend
echo "Build concluído."

# 3. Deploy do stack
echo "[3/4] Deployando stack..."
export DB_PASSWORD
docker stack deploy -c deploy/siggap-stack.yml siggap
echo "Stack deployado."

# 4. Verificar
echo "[4/4] Aguardando serviços iniciarem..."
sleep 10
docker stack services siggap

echo ""
echo "=========================================="
echo "  Deploy concluído!"
echo "=========================================="
echo ""
echo "  Frontend: https://$DOMAIN"
echo "  API:      https://$DOMAIN/api"
echo "  Health:   https://$DOMAIN/health"
echo ""
echo "  Comandos úteis:"
echo "    docker stack services siggap"
echo "    docker service logs siggap_backend -f"
echo "    docker service logs siggap_frontend -f"
echo "    docker service logs siggap_db -f"
echo ""
echo "  Para atualizar:"
echo "    cd $APP_DIR && git pull"
echo "    bash deploy/deploy-swarm.sh"
echo "=========================================="
