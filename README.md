# Proxmox MCP Server

Servidor MCP (Model Context Protocol) para conectarse a Proxmox VE mediante SSE transport. 
Permite gestionar máquinas virtuales (QEMU) y contenedores (LXC) desde un LLM compatible con MCP.

## 📚 Documentación

**👉 Toda la documentación completa está disponible en [docs/index.md](./docs/index.md)**

### Enlaces rápidos

#### Introducción
- [Visión general](./docs/intro/overview.md)
- [Características](./docs/intro/features.md)
- [Requisitos](./docs/intro/requirements.md)
- [Inicio rápido](./docs/intro/getting-started.md)

#### Configuración y uso
- [Configuración](./docs/setup/configuration.md)
- [Autenticación](./docs/setup/authentication.md)
- [Herramientas MCP](./docs/usage/tools.md)
- [API HTTP](./docs/usage/http-api.md)
- [Ejemplos de uso](./docs/usage/examples.md)

#### Desarrollo
- [Arquitectura](./docs/dev/architecture.md)
- [Estructura del proyecto](./docs/dev/structure.md)
- [Solución de problemas](./docs/dev/troubleshooting.md)

#### Despliegue
- [Guía de despliegue](./docs/ops/deployment.md)
- [Changelog](./docs/ops/changelog.md)
- [Referencias](./docs/ops/references.md)

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

