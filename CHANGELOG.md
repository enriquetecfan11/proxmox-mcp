# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Agregado
- Servidor MCP inicial para Proxmox VE
- Autenticación dual: API Token y Usuario/Contraseña
- Herramientas completas para gestión de VMs (QEMU):
  - `listVMs`: Listar máquinas virtuales
  - `getVM`: Obtener configuración de VM
  - `startVM`: Iniciar máquina virtual
  - `stopVM`: Detener máquina virtual
  - `restartVM`: Reiniciar máquina virtual
  - `deleteVM`: Eliminar máquina virtual
- Herramientas completas para gestión de Contenedores (LXC):
  - `listContainers`: Listar contenedores
  - `getContainer`: Obtener configuración de contenedor
  - `startContainer`: Iniciar contenedor
  - `stopContainer`: Detener contenedor
  - `restartContainer`: Reiniciar contenedor
  - `deleteContainer`: Eliminar contenedor
- Configuración SSL flexible para certificados autofirmados
- Manejo robusto de errores y reconexión automática
- Validación de conectividad al inicio
- Documentación completa y ejemplos de configuración
- Tipos TypeScript completos para todas las operaciones
- Estructura modular y extensible del código

