# tfg-stellar-query


## CHECKING DE LA/S BBDD:

        # stellar_auth (usuarios)
        docker exec -it sq_db_users psql -U sq_auth -d stellar_auth

        # Una vez dentro, comprueba que la tabla existe y tiene índices:
        \dt
        SELECT * FROM users;
        \q

        # stellar_game (juego)
        docker exec -it sq_db_game psql -U sq_game -d stellar_game

        # Comprueba tablas y datos de prueba:
        \dt
        SELECT COUNT(*) FROM crew_mates;   -- debe devolver 8
        SELECT COUNT(*) FROM misions;      -- debe devolver 3
        SELECT COUNT(*) FROM progreso;     -- debe devolver 0 (vacía al inicio)
        \q

## CHECKING API (SPRING BOOT):

        # RESPUESTA PÚBLICA:
        curl http://localhost:8080/test
        # Respuesta esperada: OK

        # REGISTRO DE USER:
        curl -s -X POST http://localhost:8080/api/auth/register \
        -H "Content-Type: application/json" \
        -d '{"username":"testuser","email":"test@test.com","password":"123456"}' | jq

        # Respuesta esperada: 
        {
            "token": "eyJhbGci...",
            "user": { "id": 1, "username": "testuser", "email": "test@test.com" }
        }

        #LOGIN:
        curl -s -X POST http://localhost:8080/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"testuser","password":"123456"}' | jq

            #GUARDA TOKEN PA LOS SIGUIENTES TESTS:
                TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
                    -H "Content-Type: application/json" \
                    -d '{"username":"testuser","password":"123456"}' | jq -r '.token')

                echo $TOKEN   # verifica que no está vacío

            #PROTECCIÓN DEL ENDPOINT - /me:
            curl -s http://localhost:8080/api/auth/me \
              -H "Authorization: Bearer $TOKEN" | jq

            #SIN TOKEN:
            curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/auth/me
                # Debe devolver: 403
            
            #LISTAR MISIONES:
            curl -s http://localhost:8080/api/game/misiones \
             -H "Authorization: Bearer $TOKEN" | jq
                # Debe devolver array con 3 misiones (sin el campo query_correct)
            
            #EJECUTER QUERY CORRECTA:
            curl -s -X POST http://localhost:8080/api/game/query \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d '{"query":"SELECT * FROM crew_mates WHERE state = '\''activo'\''" "misionId":1}' | jq
                # success: true, xp: 100

            #EJECUTAR QUERY FALLIDA:
            curl -s -X POST http://localhost:8080/api/game/query \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d '{"query":"SELECT * FROM crew_mates","misionId":1}' | jq
                # success: false, feedback con mensaje explicativo
            
            #INTENTAR DELETE:
            curl -s -X POST http://localhost:8080/api/game/query \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d '{"query":"DELETE FROM crew_mates","misionId":1}' | jq
                # success: false, message: "Solo se permiten consultas SELECT."

            #CHEQUEO DEL PROGRESO:
            curl -s http://localhost:8080/api/game/progreso \
                -H "Authorization: Bearer $TOKEN" | jq
                # Debe devolver el registro de la misión 1 con completada: true

## CHECKING FRONT (REACT + VITE):

    # RUNEARLO:
    cd stellar-query-front
    pnpm run dev

    Abrir las DevTools del navegador → pestaña Network. Al hacer login, la llamada debe ir a /api/auth/login y recibir 200 (no 404 ni CORS error).

    / LoginLogin con credenciales correctas → redirige a /hub/ LoginCredenciales incorrectas → muestra mensaje de error/registerRegistro con email duplicado → muestra "El email ya está registrado"/hubSin token en localStorage → redirige a //hubCon token → carga la lista de misiones/gameEjecutar la query correcta → aparece feedback de éxitoNavbarBotón logout → borra sq-auth de localStorage y redirige a /

    # CHECK LOCAL-STORAGE -> DevTools → Application → Local Storage → localhost:5173

    # CHECK JWT:

    # Copia el token y decodifica la parte central (payload) en base64
    echo "eyJhbGci...PEGA_AQUI_EL_TOKEN...xyz" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq
        # respuesta esperada:
        {
            "sub": "testuser",
            "iat": 1745000000,
            "exp": 1745003600
        }
                ## sub -> username, iat -> fecha de emisión y exp -> expiración del token (1 hora).
                O pegar el token en jwt.io para inspeccionarlo visualmente.
                
    