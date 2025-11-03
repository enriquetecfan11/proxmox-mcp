// Tipos para la configuración del servidor Proxmox
export interface ProxmoxConfig {
  host: string;
  port?: number;
  authMethod: 'token' | 'password';
  // Para autenticación por token
  token?: string;
  // Para autenticación por usuario/contraseña
  username?: string;
  password?: string;
  // Opciones SSL
  rejectUnauthorized?: boolean;
}

// Tipos para la autenticación
export interface AuthTicket {
  ticket: string;
  CSRFPreventionToken: string;
}

// Tipos para respuestas de la API
export interface ProxmoxResponse<T = any> {
  data: T;
}

// Tipos para VMs
export interface VMInfo {
  vmid: number;
  name: string;
  status: string;
  node: string;
  maxmem?: number;
  maxdisk?: number;
  cpus?: number;
  uptime?: number;
}

export interface VMConfig {
  vmid: number;
  name: string;
  memory: number;
  cores: number;
  sockets: number;
  boot: string;
  ostype: string;
  [key: string]: any;
}

// Tipos para Contenedores LXC
export interface ContainerInfo {
  vmid: number;
  name: string;
  status: string;
  node: string;
  maxmem?: number;
  maxdisk?: number;
  cpus?: number;
  uptime?: number;
}

export interface ContainerConfig {
  vmid: number;
  hostname: string;
  memory: number;
  cores: number;
  ostype: string;
  [key: string]: any;
}

// Tipos para nodos
export interface NodeInfo {
  node: string;
  status: string;
  cpu: number;
  maxcpu: number;
  mem: number;
  maxmem: number;
  disk: number;
  maxdisk: number;
  uptime: number;
}

// Tipos para tareas
export interface TaskStatus {
  upid: string;
  type: string;
  status: string;
  exitstatus?: string;
  starttime: number;
  endtime?: number;
  user: string;
  node: string;
}

