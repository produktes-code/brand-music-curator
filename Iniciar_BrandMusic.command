#!/bin/bash
cd "$(dirname "$0")"
clear
echo "=========================================================="
echo "               INICIANDO BRAND MUSIC CURATOR              "
echo "=========================================================="
echo ""
echo "[1/3] Verificando dependencias..."
if [ ! -d "backend/node_modules" ]; then
    echo "Instalando dependencias de Backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "player/node_modules" ]; then
    echo "Instalando dependencias de Player..."
    cd player && npm install && cd ..
fi

echo "[2/3] Arrancando backend..."
# Iniciar backend
cd backend && npm start > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

echo "[3/3] Arrancando interfaz..."
# Iniciar frontend en puerto 5174
cd player && npm run dev -- --port 5174 > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

# Asegurar que ambos servidores locales se detengan al salir
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM EXIT

sleep 3
echo ""
echo "=========================================================="
echo "¡Listo! Brand Music Curator está activo."
echo "Abrir el panel en tu navegador:"
echo "👉 http://localhost:5174"
echo "=========================================================="
echo ""

open "http://localhost:5174"

while true; do
  sleep 1
done
