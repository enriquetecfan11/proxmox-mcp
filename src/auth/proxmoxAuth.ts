import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ProxmoxConfig, AuthTicket, ProxmoxResponse } from '../types/index.js';

export class ProxmoxAuth {
  private config: ProxmoxConfig;
  private httpClient: AxiosInstance;
  private authTicket?: AuthTicket;

  constructor(config: ProxmoxConfig) {
    this.config = config;
    
    // Crear cliente HTTP con configuración base
    this.httpClient = axios.create({
      baseURL: `https://${config.host}:${config.port || 8006}/api2/json`,
      timeout: 30000,
      httpsAgent: config.rejectUnauthorized === false ? {
        rejectUnauthorized: false
      } : undefined
    });

    // Configurar interceptores para manejo de autenticación
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor para agregar headers de autenticación
    this.httpClient.interceptors.request.use((config) => {
      if (this.config.authMethod === 'token' && this.config.token) {
        config.headers.Authorization = `PVEAPIToken=${this.config.token}`;
      } else if (this.authTicket) {
        config.headers.Cookie = `PVEAuthCookie=${this.authTicket.ticket}`;
        config.headers['CSRFPreventionToken'] = this.authTicket.CSRFPreventionToken;
      }
      return config;
    });

    // Interceptor para manejo de errores de autenticación
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.config.authMethod === 'password') {
          // Token expirado, intentar renovar
          await this.authenticate();
          // Reintentar la petición original
          return this.httpClient.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  async authenticate(): Promise<void> {
    if (this.config.authMethod === 'token') {
      // Para tokens API no necesitamos autenticación adicional
      return;
    }

    if (this.config.authMethod === 'password') {
      if (!this.config.username || !this.config.password) {
        throw new Error('Username y password son requeridos para autenticación por contraseña');
      }

      try {
        const response = await axios.post(
          `https://${this.config.host}:${this.config.port || 8006}/api2/json/access/ticket`,
          {
            username: this.config.username,
            password: this.config.password
          },
          {
            httpsAgent: this.config.rejectUnauthorized === false ? {
              rejectUnauthorized: false
            } : undefined
          }
        );

        const data = response.data.data;
        this.authTicket = {
          ticket: data.ticket,
          CSRFPreventionToken: data.CSRFPreventionToken
        };
      } catch (error: any) {
        throw new Error(`Error de autenticación: ${error.response?.data?.errors || error.message}`);
      }
    }
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<ProxmoxResponse<T>> {
    // Asegurar autenticación antes de hacer la petición
    if (this.config.authMethod === 'password' && !this.authTicket) {
      await this.authenticate();
    }

    try {
      const response = await this.httpClient.request<ProxmoxResponse<T>>(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Error de API Proxmox: ${error.response.status} - ${error.response.data?.errors || error.response.statusText}`);
      }
      throw new Error(`Error de conexión: ${error.message}`);
    }
  }

  // Métodos de conveniencia para diferentes tipos de peticiones HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ProxmoxResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ProxmoxResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ProxmoxResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ProxmoxResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Método para verificar la conectividad y autenticación
  async testConnection(): Promise<boolean> {
    try {
      await this.get('/version');
      return true;
    } catch (error: any) {
      return false;
    }
  }

  // Obtener información de la versión de Proxmox
  async getVersion(): Promise<any> {
    const response = await this.get('/version');
    return response.data;
  }

  // Listar nodos disponibles
  async getNodes(): Promise<any[]> {
    const response = await this.get('/nodes');
    return response.data;
  }
}

