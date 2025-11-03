import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ProxmoxAuth } from '../auth/index.js';
import { VMInfo, VMConfig } from '../types/index.js';

export class VMTools {
  constructor(private auth: ProxmoxAuth) {}

  // Herramienta para listar todas las VMs en un nodo
  getListVMsTool(): Tool {
    return {
      name: 'listVMs',
      description: 'Lista todas las máquinas virtuales (QEMU) en un nodo específico de Proxmox',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox donde listar las VMs'
          }
        },
        required: ['node']
      }
    };
  }

  async listVMs(args: { node: string }): Promise<string> {
    try {
      const response = await this.auth.get<VMInfo[]>(`/nodes/${args.node}/qemu`);
      
      if (!response.data || response.data.length === 0) {
        return `No se encontraron máquinas virtuales en el nodo '${args.node}'`;
      }

      const vmList = response.data.map(vm => ({
        ID: vm.vmid,
        Nombre: vm.name || 'Sin nombre',
        Estado: vm.status,
        Memoria: vm.maxmem ? `${Math.round(vm.maxmem / 1024 / 1024)} MB` : 'N/A',
        CPUs: vm.cpus || 'N/A',
        Uptime: vm.uptime ? `${Math.round(vm.uptime / 3600)} horas` : 'N/A'
      }));

      return `Máquinas virtuales en el nodo '${args.node}':\n\n` +
             vmList.map(vm => 
               `• VM ${vm.ID}: ${vm.Nombre}\n` +
               `  Estado: ${vm.Estado}\n` +
               `  Memoria: ${vm.Memoria}\n` +
               `  CPUs: ${vm.CPUs}\n` +
               `  Uptime: ${vm.Uptime}`
             ).join('\n\n');
    } catch (error: any) {
      return `Error al listar VMs: ${error.message}`;
    }
  }

  // Herramienta para obtener configuración de una VM específica
  getVMTool(): Tool {
    return {
      name: 'getVM',
      description: 'Obtiene la configuración detallada de una máquina virtual específica',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID de la máquina virtual'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async getVM(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.get<VMConfig>(`/nodes/${args.node}/qemu/${args.vmid}/config`);
      
      const config = response.data;
      
      return `Configuración de la VM ${args.vmid} en el nodo '${args.node}':\n\n` +
             `• Nombre: ${config.name || 'Sin nombre'}\n` +
             `• Memoria: ${config.memory} MB\n` +
             `• CPUs: ${config.cores} cores, ${config.sockets} sockets\n` +
             `• Tipo de OS: ${config.ostype}\n` +
             `• Boot: ${config.boot}\n` +
             `• Configuración adicional: ${JSON.stringify(config, null, 2)}`;
    } catch (error: any) {
      return `Error al obtener configuración de VM ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para iniciar una VM
  getStartVMTool(): Tool {
    return {
      name: 'startVM',
      description: 'Inicia una máquina virtual específica',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID de la máquina virtual a iniciar'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async startVM(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.post(`/nodes/${args.node}/qemu/${args.vmid}/status/start`);
      
      return `VM ${args.vmid} en el nodo '${args.node}' iniciada exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al iniciar VM ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para detener una VM
  getStopVMTool(): Tool {
    return {
      name: 'stopVM',
      description: 'Detiene una máquina virtual específica',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID de la máquina virtual a detener'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async stopVM(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.post(`/nodes/${args.node}/qemu/${args.vmid}/status/stop`);
      
      return `VM ${args.vmid} en el nodo '${args.node}' detenida exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al detener VM ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para reiniciar una VM
  getRestartVMTool(): Tool {
    return {
      name: 'restartVM',
      description: 'Reinicia una máquina virtual específica',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID de la máquina virtual a reiniciar'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async restartVM(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.post(`/nodes/${args.node}/qemu/${args.vmid}/status/reboot`);
      
      return `VM ${args.vmid} en el nodo '${args.node}' reiniciada exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al reiniciar VM ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para eliminar una VM
  getDeleteVMTool(): Tool {
    return {
      name: 'deleteVM',
      description: 'Elimina una máquina virtual específica (¡CUIDADO: Esta operación es irreversible!)',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID de la máquina virtual a eliminar'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async deleteVM(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.delete(`/nodes/${args.node}/qemu/${args.vmid}`);
      
      return `VM ${args.vmid} en el nodo '${args.node}' eliminada exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al eliminar VM ${args.vmid}: ${error.message}`;
    }
  }

  // Método para obtener todas las herramientas de VM
  getAllTools(): Tool[] {
    return [
      this.getListVMsTool(),
      this.getVMTool(),
      this.getStartVMTool(),
      this.getStopVMTool(),
      this.getRestartVMTool(),
      this.getDeleteVMTool()
    ];
  }

  // Método para ejecutar herramientas de VM
  async executeVMTool(name: string, args: any): Promise<string> {
    switch (name) {
      case 'listVMs':
        return this.listVMs(args);
      case 'getVM':
        return this.getVM(args);
      case 'startVM':
        return this.startVM(args);
      case 'stopVM':
        return this.stopVM(args);
      case 'restartVM':
        return this.restartVM(args);
      case 'deleteVM':
        return this.deleteVM(args);
      default:
        throw new Error(`Herramienta de VM desconocida: ${name}`);
    }
  }
}

