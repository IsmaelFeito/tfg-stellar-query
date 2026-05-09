#!/bin/bash
# start.sh — arranca todo el stack de StellarQuery

set -e  # para si algo falla

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "�� Levantando bases de datos..."
cd "$ROOT_DIR/docker"
docker compose up -d

echo "⏳ Esperando a que las BBDs estén healthy..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' sq_db_users)" = "healthy" ] && \
      [ "$(docker inspect -f '{{.State.Health.Status}}' sq_db_game)"  = "healthy" ]; do
  printf "."
  sleep 2
done
echo " ✅ BBDs listas"

echo "☕ Arrancando Spring Boot..."
cd "$ROOT_DIR/back-stellar-query"
./mvnw spring-boot:run &
SPRING_PID=$!

echo "⏳ Esperando a que la API esté lista..."
until curl -s http://localhost:8080/test > /dev/null 2>&1; do
  printf "."
  sleep 2
done
echo " ✅ API lista"

echo "⚛️  Arrancando React..."
cd "$ROOT_DIR/front-stellar-query"
pnpm run dev &
REACT_PID=$!

echo ""
echo "✅ Stack completo arrancado:"
echo "   - API:     http://localhost:8080"
echo "   - Front:   http://localhost:5173"
echo "   - pgAdmin: http://localhost:5050"
echo ""
echo "Pulsa Ctrl+C para parar todo"

# Al hacer Ctrl+C mata Spring Boot y React
trap "echo '🛑 Parando...'; kill $SPRING_PID $REACT_PID 2>/dev/null; docker compose -f $ROOT_DIR/docker/docker-compose.yml stop; exit 0" SIGINT

wait
