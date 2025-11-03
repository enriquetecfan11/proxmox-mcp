# Estructura del proyecto

```
proxmox-mcp/
├── src/
│   ├── auth/              # Sistema de autenticación
│   │   ├── index.ts       # Exportaciones
│   │   └── proxmoxAuth.ts # Clase ProxmoxAuth
│   ├── tools/             # Herramientas MCP (VM y LXC)
│   │   ├── index.ts       # Exportaciones
│   │   ├── vmTools.ts     # Herramientas para VMs
│   │   └── lxcTools.ts    # Herramientas para contenedores
│   ├── types/             # Definiciones de tipos TypeScript
│   │   └── index.ts       # Tipos y interfaces
│   ├── index.ts           # Servidor MCP principal (stdio)
│   └── httpServer.ts      # Servidor HTTP REST
├── docs/                  # Documentación completa
│   ├── index.md           # Índice de documentación
│   ├── overview.md        # Visión general
│   ├── getting-started.md # Guía de inicio rápido
│   ├── configuration.md   # Configuración
│   ├── authentication.md  # Autenticación
│   ├── tools.md           # Herramientas MCP
│   ├── http-api.md        # API HTTP
│   ├── architecture.md    # Arquitectura
│   ├── features.md        # Características
│   ├── requirements.md    # Requisitos
│   ├── examples.md        # Ejemplos de uso
│   ├── structure.md       # Estructura del proyecto
│   ├── troubleshooting.md # Solución de problemas
│   ├── deployment.md      # Guía de despliegue
│   └── changelog.md       # Historial de cambios
├── dist/                  # Código compilado (generado)
├── node_modules/          # Dependencias (generado)
├── package.json           # Configuración del proyecto
├── package-lock.json      # Lockfile de dependencias
├── tsconfig.json          # Configuración de TypeScript
├── tsconfig.node.json     # Configuración adicional de TypeScript
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore             # Archivos ignorados por Git
├── LICENSE                # Licencia del proyecto
├── README.md              # README principal
├── DEPLOYMENT.md          # Guía de despliegue (legacy, ver docs/)
└── CHANGELOG.md           # Changelog (legacy, ver docs/)
```

## Descripción de directorios

### `src/`

Código fuente principal del proyecto.

- **`auth/`**: Manejo de autenticación con Proxmox (tokens, tickets, cliente HTTP)
- **`tools/`**: Implementación de las herramientas MCP para VMs y contenedores
- **`types/`**: Definiciones de tipos TypeScript para toda la aplicación
- **`index.ts`**: Servidor MCP principal que usa transporte stdio
- **`httpServer.ts`**: Servidor HTTP REST alternativo usando Express

### `docs/`

Toda la documentación del proyecto está centralizada aquí.

### `dist/`

Directorio generado durante la compilación con el código JavaScript transpilado.

