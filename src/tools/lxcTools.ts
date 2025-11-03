import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ProxmoxAuth } from '../auth/index.js';
import { ContainerInfo, ContainerConfig } from '../types/index.js';

export class LXCTools {
  constructor(private auth: ProxmoxAuth) {}

  // Herramienta para listar todos los contenedores en un nodo
  getListContainersTool(): Tool {
    return {
      name: 'listContainers',
      description: 'Lista todos los contenedores LXC en un nodo específico de Proxmox',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox donde listar los contenedores'
          }
        },
        required: ['node']
      }
    };
  }

  async listContainers(args: { node: string }): Promise<string> {
    try {
      const response = await this.auth.get<ContainerInfo[]>(`/nodes/${args.node}/lxc`);
      
      if (!response.data || response.data.length === 0) {
        return `No se encontraron contenedores LXC en el nodo '${args.node}'`;
      }

      const containerList = response.data.map(container => ({
        ID: container.vmid,
        Nombre: container.name || 'Sin nombre',
        Estado: container.status,
        Memoria: container.maxmem ? `${Math.round(container.maxmem / 1024 / 1024)} MB` : 'N/A',
        CPUs: container.cpus || 'N/A',
        Uptime: container.uptime ? `${Math.round(container.uptime / 3600)} horas` : 'N/A'
      }));

      return `Contenedores LXC en el nodo '${args.node}':\n\n` +
             containerList.map(container => 
               `• Contenedor ${container.ID}: ${container.Nombre}\n` +
               `  Estado: ${container.Estado}\n` +
               `  Memoria: ${container.Memoria}\n` +
               `  CPUs: ${container.CPUs}\n` +
               `  Uptime: ${container.Uptime}`
             ).join('\n\n');
    } catch (error: any) {
      return `Error al listar contenedores: ${error.message}`;
    }
  }

  // Herramienta para obtener configuración de un contenedor específico
  getContainerTool(): Tool {
    return {
      name: 'getContainer',
      description: 'Obtiene la configuración detallada de un contenedor LXC específico',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID del contenedor LXC'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async getContainer(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.get<ContainerConfig>(`/nodes/${args.node}/lxc/${args.vmid}/config`);
      
      const config = response.data;
      
      return `Configuración del contenedor ${args.vmid} en el nodo '${args.node}':\n\n` +
             `• Hostname: ${config.hostname || 'Sin hostname'}\n` +
             `• Memoria: ${config.memory} MB\n` +
             `• CPUs: ${config.cores} cores\n` +
             `• Tipo de OS: ${config.ostype}\n` +
             `• Configuración adicional: ${JSON.stringify(config, null, 2)}`;
    } catch (error: any) {
      return `Error al obtener configuración del contenedor ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para iniciar un contenedor
  getStartContainerTool(): Tool {
    return {
      name: 'startContainer',
      description: 'Inicia un contenedor LXC específico',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID del contenedor LXC a iniciar'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async startContainer(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.post(`/nodes/${args.node}/lxc/${args.vmid}/status/start`);
      
      return `Contenedor ${args.vmid} en el nodo '${args.node}' iniciado exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al iniciar contenedor ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para detener un contenedor
  getStopContainerTool(): Tool {
    return {
      name: 'stopContainer',
      description: 'Detiene un contenedor LXC específico',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID del contenedor LXC a detener'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async stopContainer(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.post(`/nodes/${args.node}/lxc/${args.vmid}/status/stop`);
      
      return `Contenedor ${args.vmid} en el nodo '${args.node}' detenido exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al detener contenedor ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para reiniciar un contenedor
  getRestartContainerTool(): Tool {
    return {
      name: 'restartContainer',
      description: 'Reinicia un contenedor LXC específico',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID del contenedor LXC a reiniciar'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async restartContainer(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.post(`/nodes/${args.node}/lxc/${args.vmid}/status/reboot`);
      
      return `Contenedor ${args.vmid} en el nodo '${args.node}' reiniciado exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al reiniciar contenedor ${args.vmid}: ${error.message}`;
    }
  }

  // Herramienta para eliminar un contenedor
  getDeleteContainerTool(): Tool {
    return {
      name: 'deleteContainer',
      description: 'Elimina un contenedor LXC específico (¡CUIDADO: Esta operación es irreversible!)',
      inputSchema: {
        type: 'object',
        properties: {
          node: {
            type: 'string',
            description: 'Nombre del nodo de Proxmox'
          },
          vmid: {
            type: 'number',
            description: 'ID del contenedor LXC a eliminar'
          }
        },
        required: ['node', 'vmid']
      }
    };
  }

  async deleteContainer(args: { node: string; vmid: number }): Promise<string> {
    try {
      const response = await this.auth.delete(`/nodes/${args.node}/lxc/${args.vmid}`);
      
      return `Contenedor ${args.vmid} en el nodo '${args.node}' eliminado exitosamente.\n` +
             `UPID de la tarea: ${response.data}`;
    } catch (error: any) {
      return `Error al eliminar contenedor ${args.vmid}: ${error.message}`;
    }
  }

  // Método para obtener todas las herramientas de contenedores
  getAllTools(): Tool[] {
    return [
      this.getListContainersTool(),
      this.getContainerTool(),
      this.getStartContainerTool(),
      this.getStopContainerTool(),
      this.getRestartContainerTool(),
      this.getDeleteContainerTool()
    ];
  }

  // Método para ejecutar herramientas de contenedores
  async executeLXCTool(name: string, args: any): Promise<string> {
    switch (name) {
      case 'listContainers':
        return this.listContainers(args);
      case 'getContainer':
        return this.getContainer(args);
      case 'startContainer':
        return this.startContainer(args);
      case 'stopContainer':
        return this.stopContainer(args);
      case 'restartContainer':
        return this.restartContainer(args);
      case 'deleteContainer':
        return this.deleteContainer(args);
      default:
        throw new Error(`Herramienta de contenedor desconocida: ${name}`);
    }
  }
}

