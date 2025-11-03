 # Visión general

 `proxmox-mcp` es un servidor MCP (Model Context Protocol) escrito en TypeScript que actúa como puente entre un LLM y la API de Proxmox VE. Permite ejecutar operaciones sobre máquinas virtuales (QEMU) y contenedores (LXC) de forma segura y tipada.

 ## Características

 - Autenticación dual: API Token y Usuario/Contraseña.
 - Gestión de VMs: listar, obtener configuración, iniciar, detener, reiniciar y eliminar.
 - Gestión de contenedores LXC: operaciones equivalentes a las de VMs.
 - Validación SSL configurable (útil en entornos con certificados autofirmados).
 - Manejo robusto de errores y reconexión de sesión bajo autenticación por contraseña.

 ## Requisitos

 - Node.js 18+
 - TypeScript 5+
 - Acceso a un servidor Proxmox VE


