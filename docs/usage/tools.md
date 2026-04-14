# Herramientas MCP disponibles

Estas herramientas se exponen al cliente MCP y son ejecutadas vía `CallTool`.

## Máquinas virtuales (QEMU)

### `listVMs`
Lista todas las VMs en un nodo específico de Proxmox.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox donde listar las VMs

### `getVM`
Obtiene la configuración detallada de una máquina virtual específica.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID de la máquina virtual

### `startVM`
Inicia una máquina virtual específica.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID de la máquina virtual a iniciar

### `stopVM`
Detiene una máquina virtual específica.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID de la máquina virtual a detener

### `restartVM`
Reinicia una máquina virtual específica.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID de la máquina virtual a reiniciar

### `deleteVM`
Elimina una máquina virtual específica (⚠️ **Esta operación es irreversible**).

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID de la máquina virtual a eliminar

## Contenedores (LXC)

### `listContainers`
Lista todos los contenedores LXC en un nodo específico de Proxmox.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox donde listar los contenedores

### `getContainer`
Obtiene la configuración detallada de un contenedor LXC específico.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID del contenedor LXC

### `startContainer`
Inicia un contenedor LXC específico.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID del contenedor LXC a iniciar

### `stopContainer`
Detiene un contenedor LXC específico.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID del contenedor LXC a detener

### `restartContainer`
Reinicia un contenedor LXC específico.

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID del contenedor LXC a reiniciar

### `deleteContainer`
Elimina un contenedor LXC específico (⚠️ **Esta operación es irreversible**).

**Parámetros:**
- `node` (string, requerido): Nombre del nodo de Proxmox
- `vmid` (number, requerido): ID del contenedor LXC a eliminar


