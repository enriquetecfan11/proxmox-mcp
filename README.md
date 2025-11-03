# Proxmox MCP Server

Un servidor MCP (Model Context Protocol) en TypeScript para conectarse a la API de Proxmox VE. Este servidor actúa como puente entre un LLM y la API de Proxmox, permitiendo ejecutar operaciones sobre máquinas virtuales (QEMU) y contenedores (LXC).

> Documentación: la documentación completa está en [docs/index.md](./docs/index.md).

## 📎 Enlaces rápidos

- Documentación completa: [docs/index.md](./docs/index.md)
- Inicio rápido: [docs/getting-started.md](./docs/getting-started.md)
- Configuración: [docs/configuration.md](./docs/configuration.md)
- Autenticación: [docs/authentication.md](./docs/authentication.md)
- API HTTP: [docs/http-api.md](./docs/http-api.md)
- Herramientas MCP (VM/LXC): [docs/tools.md](./docs/tools.md)
- Despliegue: [docs/deployment.md](./docs/deployment.md)
- Changelog: [docs/changelog.md](./docs/changelog.md)

## 🚀 Características

- **Autenticación dual**: Soporte para API Token y Usuario/Contraseña
- **Gestión de VMs**: Listar, obtener configuración, iniciar, detener, reiniciar y eliminar máquinas virtuales
- **Gestión de Contenedores LXC**: Operaciones completas sobre contenedores
- **Validación SSL configurable**: Útil para instalaciones locales con certificados autofirmados
- **Manejo robusto de errores**: Reconexión automática y manejo de tokens expirados

## 📋 Requisitos

- Node.js 18+ 
- TypeScript 5+
- Acceso a un servidor Proxmox VE

## 🛠️ Instalación

1. Clona o descarga el proyecto:
```bash
git clone <repository-url>
cd proxmox-mcp
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (ver sección de Configuración)

4. Compila el proyecto:
```bash
npm run build
```

## ⚙️ Configuración

Crea un archivo `.env` basado en `.env.example` y configura las siguientes variables:

### Configuración del Servidor Proxmox
```bash
PROXMOX_HOST=tu-servidor-proxmox.com
PROXMOX_PORT=8006
```

### Método de Autenticación

#### Opción 1: API Token (Recomendado)
```bash
PROXMOX_AUTH_METHOD=token
PROXMOX_TOKEN=user@pam!tokenid=tu-token-aqui
```

#### Opción 2: Usuario y Contraseña
```bash
PROXMOX_AUTH_METHOD=password
PROXMOX_USERNAME=tu-usuario@pam
PROXMOX_PASSWORD=tu-contraseña
```

### Configuración SSL
```bash
# Para ignorar certificados SSL (útil en desarrollo)
PROXMOX_REJECT_UNAUTHORIZED=false
```

## 🔐 Configuración de Autenticación en Proxmox

### API Token (Recomendado)

1. Accede a la interfaz web de Proxmox
2. Ve a **Datacenter** → **Permissions** → **API Tokens**
3. Crea un nuevo token:
   - **User**: Selecciona un usuario existente
   - **Token ID**: Asigna un nombre descriptivo
   - **Privilege Separation**: Desmarcar si quieres usar los permisos del usuario
4. Copia el token generado y úsalo en la variable `PROXMOX_TOKEN`

### Usuario y Contraseña

Asegúrate de que el usuario tenga los permisos necesarios:
- **VM.Audit**: Para listar y ver configuraciones
- **VM.PowerMgmt**: Para iniciar, detener y reiniciar
- **VM.Allocate**: Para eliminar VMs/contenedores

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 🧪 Herramientas Disponibles

### Máquinas Virtuales (QEMU)

- **listVMs**: Lista todas las VMs en un nodo
- **getVM**: Obtiene configuración detallada de una VM
- **startVM**: Inicia una VM específica
- **stopVM**: Detiene una VM específica  
- **restartVM**: Reinicia una VM específica
- **deleteVM**: Elimina una VM específica (⚠️ irreversible)

### Contenedores LXC

- **listContainers**: Lista todos los contenedores en un nodo
- **getContainer**: Obtiene configuración detallada de un contenedor
- **startContainer**: Inicia un contenedor específico
- **stopContainer**: Detiene un contenedor específico
- **restartContainer**: Reinicia un contenedor específico  
- **deleteContainer**: Elimina un contenedor específico (⚠️ irreversible)

## 💡 Ejemplos de Uso

Una vez conectado a un LLM compatible con MCP, puedes usar comandos como:

- "Lista todas las máquinas virtuales en el nodo pve1"
- "Detén el contenedor 106 en el nodo nodo2"  
- "Reinicia la VM con ID 103 en el nodo home"
- "Muéstrame la configuración del contenedor 200"

## 🔧 Estructura del Proyecto

```
proxmox-mcp/
├── src/
│   ├── auth/           # Sistema de autenticación
│   ├── tools/          # Herramientas MCP (VM y LXC)
│   ├── types/          # Definiciones de tipos TypeScript
│   └── index.ts        # Servidor MCP principal
├── dist/               # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Solución de Problemas

### Error de Conexión SSL
Si obtienes errores de certificado SSL, configura:
```bash
PROXMOX_REJECT_UNAUTHORIZED=false
```

### Error de Autenticación
- Verifica que el token/credenciales sean correctos
- Asegúrate de que el usuario tenga los permisos necesarios
- Para tokens, verifica que no hayan expirado

### Error de Permisos
Asegúrate de que el usuario tenga al menos estos permisos:
- `VM.Audit` en el path `/`
- `VM.PowerMgmt` en el path `/`
- `VM.Allocate` en el path `/` (para operaciones de eliminación)

## 📚 Referencias

- [Documentación oficial de Proxmox API](https://pve.proxmox.com/pve-docs/api-viewer/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/)

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.

