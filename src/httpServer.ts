#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { ProxmoxAuth } from './auth/index.js';
import { VMTools, LXCTools } from './tools/index.js';
import { ProxmoxConfig } from './types/index.js';

console.error('🚀 Iniciando servidor HTTP MCP Proxmox...');

class ProxmoxHTTPServer {
  private app: express.Application;
  private auth!: ProxmoxAuth;
  private vmTools!: VMTools;
  private lxcTools!: LXCTools;
  private config!: ProxmoxConfig;
  private port: number;

  constructor() {
    console.error('📝 Configurando servidor HTTP...');
    this.app = express();
    this.port = parseInt(process.env.HTTP_PORT || '3000');
    
    this.setupConfiguration();
    this.setupAuthentication();
    this.setupTools();
    this.setupMiddleware();
    this.setupRoutes();
    console.error('✅ Configuración del servidor completada');
  }

  private setupConfiguration(): void {
    console.error('🔧 Configurando variables de entorno...');
    // Configuración desde variables de entorno
    this.config = {
      host: process.env.PROXMOX_HOST || 'localhost',
      port: parseInt(process.env.PROXMOX_PORT || '8006'),
      authMethod: (process.env.PROXMOX_AUTH_METHOD as 'token' | 'password') || 'token',
      token: process.env.PROXMOX_TOKEN,
      username: process.env.PROXMOX_USERNAME,
      password: process.env.PROXMOX_PASSWORD,
      rejectUnauthorized: process.env.PROXMOX_REJECT_UNAUTHORIZED !== 'false'
    };

    console.error(`📋 Configuración cargada:`, {
      host: this.config.host,
      port: this.config.port,
      authMethod: this.config.authMethod,
      hasToken: !!this.config.token,
      hasUsername: !!this.config.username
    });

    // Validar configuración
    if (this.config.authMethod === 'token' && !this.config.token) {
      console.error('⚠️  PROXMOX_TOKEN no está configurado. Algunas funcionalidades pueden no estar disponibles.');
    }

    if (this.config.authMethod === 'password' && (!this.config.username || !this.config.password)) {
      console.error('⚠️  PROXMOX_USERNAME y PROXMOX_PASSWORD no están configurados. Algunas funcionalidades pueden no estar disponibles.');
    }
  }

  private setupAuthentication(): void {
    console.error('🔐 Configurando autenticación...');
    try {
      this.auth = new ProxmoxAuth(this.config);
      console.error('✅ Autenticación configurada correctamente');
    } catch (error: any) {
      console.error('❌ Error al configurar autenticación:', error.message);
      throw error;
    }
  }

  private setupTools(): void {
    console.error('🛠️  Configurando herramientas...');
    try {
      this.vmTools = new VMTools(this.auth);
      this.lxcTools = new LXCTools(this.auth);
      console.error('✅ Herramientas configuradas correctamente');
    } catch (error: any) {
      console.error('❌ Error al configurar herramientas:', error.message);
      throw error;
    }
  }

  private setupMiddleware(): void {
    console.error('🔧 Configurando middleware...');
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    console.error('✅ Middleware configurado correctamente');
  }

  private setupRoutes(): void {
    console.error('🛣️  Configurando rutas...');
    
    // Ruta de estado del servidor
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Proxmox MCP HTTP Server',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          health: '/health',
          tools: '/tools',
          vms: '/vms',
          containers: '/containers',
          nodes: '/nodes'
        }
      });
    });

    // Ruta de salud
    this.app.get('/health', async (req, res) => {
      try {
        const isConnected = await this.auth.testConnection();
        res.json({
          status: isConnected ? 'healthy' : 'unhealthy',
          proxmox_connected: isConnected,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        res.status(500).json({
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Ruta para listar herramientas disponibles
    this.app.get('/tools', (req, res) => {
      try {
        const vmTools = this.vmTools.getAllTools();
        const lxcTools = this.lxcTools.getAllTools();
        
        res.json({
          tools: [...vmTools, ...lxcTools],
          count: vmTools.length + lxcTools.length
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Rutas para VMs
    this.app.get('/vms', async (req, res) => {
      try {
        const node = req.query.node as string || 'pve';
        const result = await this.vmTools.executeVMTool('listVMs', { node });
        res.json(JSON.parse(result));
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/vms/:vmid', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.vmTools.executeVMTool('getVM', { node, vmid: parseInt(vmid) });
        res.json(JSON.parse(result));
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/vms/:vmid/start', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.vmTools.executeVMTool('startVM', { node, vmid: parseInt(vmid) });
        res.json({ success: true, message: result });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/vms/:vmid/stop', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.vmTools.executeVMTool('stopVM', { node, vmid: parseInt(vmid) });
        res.json({ success: true, message: result });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/vms/:vmid/restart', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.vmTools.executeVMTool('restartVM', { node, vmid: parseInt(vmid) });
        res.json({ success: true, message: result });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Rutas para Contenedores LXC
    this.app.get('/containers', async (req, res) => {
      try {
        const node = req.query.node as string || 'pve';
        const result = await this.lxcTools.executeLXCTool('listContainers', { node });
        res.json(JSON.parse(result));
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/containers/:vmid', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.lxcTools.executeLXCTool('getContainer', { node, vmid: parseInt(vmid) });
        res.json(JSON.parse(result));
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/containers/:vmid/start', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.lxcTools.executeLXCTool('startContainer', { node, vmid: parseInt(vmid) });
        res.json({ success: true, message: result });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/containers/:vmid/stop', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.lxcTools.executeLXCTool('stopContainer', { node, vmid: parseInt(vmid) });
        res.json({ success: true, message: result });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/containers/:vmid/restart', async (req, res) => {
      try {
        const { vmid } = req.params;
        const node = req.query.node as string || 'pve';
        const result = await this.lxcTools.executeLXCTool('restartContainer', { node, vmid: parseInt(vmid) });
        res.json({ success: true, message: result });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Ruta para obtener nodos
    this.app.get('/nodes', async (req, res) => {
      try {
        const nodes = await this.auth.getNodes();
        res.json(nodes);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Ruta para obtener información del servidor
    this.app.get('/server/info', async (req, res) => {
      try {
        const version = await this.auth.getVersion();
        const nodes = await this.auth.getNodes();
        res.json({
          version,
          nodes,
          config: {
            host: this.config.host,
            port: this.config.port,
            authMethod: this.config.authMethod
          }
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    console.error('✅ Rutas configuradas correctamente');
  }

  async start(): Promise<void> {
    try {
      console.error('🔍 Verificando conectividad con Proxmox...');
      
      try {
        const isConnected = await this.auth.testConnection();
        
        if (!isConnected) {
          console.error('❌ No se puede conectar al servidor Proxmox. Verifique la configuración.');
          console.error('💡 Asegúrese de que el archivo .env esté configurado correctamente.');
          console.error('💡 Para desarrollo, puede continuar sin conexión a Proxmox.');
        } else {
          console.error('✅ Conectado exitosamente al servidor Proxmox');
          
          // Obtener información del servidor
          try {
            const version = await this.auth.getVersion();
            console.error(`📋 Versión de Proxmox: ${version.version}`);
          } catch (error) {
            console.error('⚠️  No se pudo obtener la versión del servidor');
          }

          // Obtener nodos disponibles
          try {
            const nodes = await this.auth.getNodes();
            console.error(`🖥️  Nodos disponibles: ${nodes.map(n => n.node).join(', ')}`);
          } catch (error) {
            console.error('⚠️  No se pudieron obtener los nodos disponibles');
          }
        }
      } catch (error: any) {
        console.error('⚠️  Error al conectar con Proxmox:', error.message);
        console.error('💡 Para desarrollo, puede continuar sin conexión a Proxmox.');
      }

      console.error(`🌐 Iniciando servidor HTTP en puerto ${this.port}...`);
      
      this.app.listen(this.port, () => {
        console.error(`🚀 Servidor HTTP MCP Proxmox iniciado en http://localhost:${this.port}`);
        console.error(`📝 El servidor está ejecutándose en modo desarrollo`);
        console.error(`🌐 Endpoints disponibles:`);
        console.error(`   - GET  http://localhost:${this.port}/ (información del servidor)`);
        console.error(`   - GET  http://localhost:${this.port}/health (estado de salud)`);
        console.error(`   - GET  http://localhost:${this.port}/tools (herramientas disponibles)`);
        console.error(`   - GET  http://localhost:${this.port}/vms (listar VMs)`);
        console.error(`   - GET  http://localhost:${this.port}/containers (listar contenedores)`);
        console.error(`   - GET  http://localhost:${this.port}/nodes (listar nodos)`);
      });

      // Manejo de errores del servidor
      this.app.on('error', (error) => {
        console.error('❌ Error en el servidor HTTP:', error);
      });

    } catch (error: any) {
      console.error('❌ Error al iniciar el servidor HTTP:', error.message);
      process.exit(1);
    }
  }
}

// Función principal
async function main(): Promise<void> {
  console.error('🎯 Función principal iniciada');
  try {
    const server = new ProxmoxHTTPServer();
    console.error('✅ Servidor creado correctamente');
    await server.start();
    console.error('✅ Servidor iniciado correctamente');
  } catch (error: any) {
    console.error('❌ Error en función principal:', error.message);
    throw error;
  }
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGINT', () => {
  console.error('\n🛑 Servidor detenido por el usuario (SIGINT)');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 Servidor detenido por el sistema (SIGTERM)');
  process.exit(0);
});

// Ejecutar el servidor
console.error('🎬 Ejecutando servidor HTTP...');
main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
}); 