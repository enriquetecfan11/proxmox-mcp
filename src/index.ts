#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ProxmoxAuth } from './auth/index.js';
import { VMTools, LXCTools } from './tools/index.js';
import { ProxmoxConfig } from './types/index.js';

class ProxmoxMCPServer {
  private server: Server;
  private auth!: ProxmoxAuth;
  private vmTools!: VMTools;
  private lxcTools!: LXCTools;
  private config!: ProxmoxConfig;

  constructor() {
    this.server = new Server(
      {
        name: 'proxmox-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupConfiguration();
    this.setupAuthentication();
    this.setupTools();
    this.setupHandlers();
  }

  private setupConfiguration(): void {
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

    // Validar configuración
    if (this.config.authMethod === 'token' && !this.config.token) {
      throw new Error('PROXMOX_TOKEN es requerido cuando se usa autenticación por token');
    }

    if (this.config.authMethod === 'password' && (!this.config.username || !this.config.password)) {
      throw new Error('PROXMOX_USERNAME y PROXMOX_PASSWORD son requeridos cuando se usa autenticación por contraseña');
    }
  }

  private setupAuthentication(): void {
    this.auth = new ProxmoxAuth(this.config);
  }

  private setupTools(): void {
    this.vmTools = new VMTools(this.auth);
    this.lxcTools = new LXCTools(this.auth);
  }

  private setupHandlers(): void {
    // Handler para listar herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const vmTools = this.vmTools.getAllTools();
      const lxcTools = this.lxcTools.getAllTools();
      
      return {
        tools: [...vmTools, ...lxcTools]
      };
    });

    // Handler para ejecutar herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Verificar conectividad antes de ejecutar cualquier herramienta
        const isConnected = await this.auth.testConnection();
        if (!isConnected) {
          throw new Error('No se puede conectar al servidor Proxmox. Verifique la configuración.');
        }

        let result: string;

        // Determinar si es una herramienta de VM o LXC y ejecutarla
        const vmToolNames = ['listVMs', 'getVM', 'startVM', 'stopVM', 'restartVM', 'deleteVM'];
        const lxcToolNames = ['listContainers', 'getContainer', 'startContainer', 'stopContainer', 'restartContainer', 'deleteContainer'];

        if (vmToolNames.includes(name)) {
          result = await this.vmTools.executeVMTool(name, args);
        } else if (lxcToolNames.includes(name)) {
          result = await this.lxcTools.executeLXCTool(name, args);
        } else {
          throw new Error(`Herramienta desconocida: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: result
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async run(): Promise<void> {
    try {
      // Verificar conectividad inicial
      console.error('Verificando conectividad con Proxmox...');
      
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

      const transport = new StdioServerTransport();
      console.error('🚀 Servidor MCP Proxmox iniciado y listo para recibir conexiones');
      console.error('📝 El servidor está ejecutándose en modo desarrollo');
      
      await this.server.connect(transport);
    } catch (error: any) {
      console.error('❌ Error al iniciar el servidor MCP:', error.message);
      process.exit(1);
    }
  }
}

// Función principal
async function main(): Promise<void> {
  const server = new ProxmoxMCPServer();
  await server.run();
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Ejecutar el servidor
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

