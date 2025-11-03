# Características

## Funcionalidades principales

- **Autenticación dual**: Soporte para API Token y Usuario/Contraseña
- **Gestión de VMs**: Listar, obtener configuración, iniciar, detener, reiniciar y eliminar máquinas virtuales
- **Gestión de Contenedores LXC**: Operaciones completas sobre contenedores
- **Validación SSL configurable**: Útil para instalaciones locales con certificados autofirmados
- **Manejo robusto de errores**: Reconexión automática y manejo de tokens expirados

## Transporte

- **SSE Transport**: El servidor puede conectarse a Proxmox mediante Server-Sent Events (SSE) transport
- **Stdio Transport**: Servidor MCP estándar por stdio para integración con clientes MCP
- **HTTP Server**: API REST adicional para acceso directo sin cliente MCP

