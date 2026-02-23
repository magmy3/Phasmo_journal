#!/bin/bash
echo "👻 Spouštím Phasmo Journal (Backend + Frontend)..."

# 1. Spuštění backendu na pozadí (& znamená "běž na pozadí")
cd /workspaces/Phasmo_journal/backend
mvn spring-boot:run &
BACKEND_PID=$! # Uložíme si ID tohoto procesu, abychom ho uměli zabít

# 2. Spuštění frontendu na pozadí
cd /workspaces/Phasmo_journal/frontend
npm run dev &
FRONTEND_PID=$! # Uložíme si ID i pro frontend

echo "✅ Oba servery startují! (Pro ukončení obou najednou zmáčkni Ctrl+C)"

# 3. Záchranná brzda: Co se má stát při zmáčknutí Ctrl+C
trap "echo '🛑 Vypínám servery...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Skript bude čekat a držet terminál otevřený, dokud servery běží
wait $BACKEND_PID $FRONTEND_PID
