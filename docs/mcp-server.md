 # Servidor MCP (stdio)

 El servidor MCP principal se ejecuta por stdio y expone herramientas MCP para VMs y LXC.

 - Binario: `dist/index.js`
 - Transporte: stdio
 - Capacidad: listado de herramientas y ejecución por `CallTool`

 Ejemplo de integración (conceptual) con un cliente MCP:

 - Comando: `node /ruta/al/proyecto/dist/index.js`
 - Transporte: stdio
 - Herramientas: suma de herramientas VM y LXC


