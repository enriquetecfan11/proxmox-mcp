# Requisitos

## Requisitos del sistema

- **Node.js**: Versión 18 o superior
- **TypeScript**: Versión 5 o superior
- **Acceso a Proxmox VE**: Un servidor Proxmox VE accesible (físico o virtual)

## Requisitos de red

- Acceso de red al servidor Proxmox (puerto 8006 por defecto)
- Si usas certificados autofirmados, configura `PROXMOX_REJECT_UNAUTHORIZED=false`

## Permisos en Proxmox

Para que el servidor funcione correctamente, el usuario/token necesita los siguientes permisos:

- **VM.Audit**: Para listar y ver configuraciones de VMs y contenedores
- **VM.PowerMgmt**: Para iniciar, detener y reiniciar
- **VM.Allocate**: Para eliminar VMs/contenedores (opcional, solo si necesitas esta funcionalidad)

