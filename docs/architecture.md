 # Arquitectura

 ## Componentes principales

 - `src/index.ts` — Servidor MCP (stdio). Registra herramientas, valida conectividad y maneja `ListTools`/`CallTool`.
 - `src/httpServer.ts` — Servidor HTTP (`express`) con endpoints REST.
 - `src/auth/` — `ProxmoxAuth`: autenticación, tickets, cliente HTTP (`axios`) y utilidades.
 - `src/tools/` — `VMTools` y `LXCTools`: definen herramientas MCP y su ejecución.
 - `src/types/` — Tipos TypeScript para configuración, respuestas y modelos de VMs/LXC.

 ## Flujo MCP

 1. Carga configuración desde variables de entorno.
 2. Inicializa `ProxmoxAuth`.
 3. Registra herramientas de `VMTools` y `LXCTools`.
 4. Atiende `ListTools` y `CallTool`, verificando conectividad previa.

 ## Flujo HTTP

 1. Inicializa `express`, `cors` y middlewares.
 2. Expone rutas de salud, herramientas y recursos (VMs/LXC/nodos).
 3. Las rutas delegan en `VMTools` y `LXCTools` para la lógica.


