# Servidor MCP (stdio)

 El servidor MCP principal se ejecuta por stdio y expone herramientas MCP para VMs y LXC.

 - Binario: `dist/index.js`
 - Transporte: stdio
 - Capacidad: listado de herramientas y ejecución por `CallTool`

## Arranque recomendado

 El proceso Node **no carga `.env` por sí solo**. Usa el script del repositorio (carga variables, valida config y usa rutas absolutas):

```bash
./scripts/run-mcp.sh
# o
npm run mcp:run
```

 Integración con **Cursor** (`~/.cursor/mcp.json`):

```bash
npm run mcp:config   # muestra el JSON con la ruta absoluta de tu máquina
```

 Ver también `mcp.cursor.json.example`.

 Ejemplo manual (sin script):

 - Comando: `node /ruta/al/proyecto/dist/index.js`
 - Transporte: stdio
 - Herramientas: suma de herramientas VM y LXC


