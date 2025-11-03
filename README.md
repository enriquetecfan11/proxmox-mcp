# Proxmox MCP Server

Servidor MCP (Model Context Protocol) para conectarse a Proxmox VE mediante SSE transport. 
Permite gestionar máquinas virtuales (QEMU) y contenedores (LXC) desde un LLM compatible con MCP.

## 📚 Documentación

**👉 Toda la documentación completa está disponible en [docs/index.md](./docs/index.md)**

### Enlaces rápidos

#### Introducción
- [Visión general](./docs/overview.md)
- [Características](./docs/features.md)
- [Requisitos](./docs/requirements.md)
- [Inicio rápido](./docs/getting-started.md)

#### Configuración y uso
- [Configuración](./docs/configuration.md)
- [Autenticación](./docs/authentication.md)
- [Herramientas MCP](./docs/tools.md)
- [API HTTP](./docs/http-api.md)
- [Ejemplos de uso](./docs/examples.md)

#### Desarrollo
- [Arquitectura](./docs/architecture.md)
- [Estructura del proyecto](./docs/structure.md)
- [Solución de problemas](./docs/troubleshooting.md)

#### Despliegue
- [Guía de despliegue](./docs/deployment.md)
- [Changelog](./docs/changelog.md)
- [Referencias](./docs/references.md)

## 🚀 Inicio rápido

```bash
# Clonar e instalar
git clone <repository-url>
cd proxmox-mcp
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Proxmox

# Compilar y ejecutar
npm run build
npm start
```

## 📄 Licencia

MIT License - ver archivo [LICENSE](./LICENSE) para más detalles.

