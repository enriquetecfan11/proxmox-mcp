# Guía de Despliegue - Proxmox MCP Server

## 🚀 Pasos para Poner en Funcionamiento

### 1. Preparación del Entorno

```bash
# Clonar o descargar el proyecto
cd proxmox-mcp

# Instalar dependencias
npm install

# Compilar el proyecto
npm run build
```

### 2. Configuración

```bash
# Copiar archivo de configuración de ejemplo
cp .env.example .env

# Editar configuración
nano .env
```

 **Configuración mínima requerida:**
```bash
PROXMOX_HOST=tu-servidor-proxmox.com
PROXMOX_AUTH_METHOD=token
PROXMOX_TOKEN=user@pam!tokenid=tu-token-aqui
```

### 3. Verificación de Conectividad

```bash
# Ejecutar en modo desarrollo para verificar
npm run dev
```

 El servidor debería mostrar:
 - ✅ Conectado exitosamente al servidor Proxmox
 - 📋 Versión de Proxmox: X.X.X
 - 🖥️ Nodos disponibles: nodo1, nodo2, etc.

### 4. Integración con Cliente MCP

 El servidor está listo para conectarse con cualquier cliente MCP compatible. Configurar el cliente para usar:

 - **Comando**: `node /ruta/al/proyecto/dist/index.js`
 - **Transporte**: stdio
 - **Herramientas disponibles**: 12 herramientas (6 para VMs, 6 para contenedores)

### 5. Pruebas Básicas

 Una vez conectado, probar con comandos como:
 - "Lista todas las máquinas virtuales en el nodo [nombre-nodo]"
 - "Muestra la configuración de la VM 100"
 - "Lista todos los contenedores en el nodo [nombre-nodo]"

## 🔧 Solución de Problemas Comunes

### Error de Certificado SSL
```bash
PROXMOX_REJECT_UNAUTHORIZED=false
```

### Error de Permisos
 Verificar que el usuario/token tenga permisos:
 - VM.Audit
 - VM.PowerMgmt  
 - VM.Allocate (para eliminaciones)

### Error de Conectividad
 - Verificar que el puerto 8006 esté accesible
 - Comprobar firewall del servidor Proxmox
 - Validar credenciales/token

## 📊 Herramientas Implementadas

### Máquinas Virtuales (QEMU)
 1. `listVMs` - Listar VMs
 2. `getVM` - Configuración de VM
 3. `startVM` - Iniciar VM
 4. `stopVM` - Detener VM
 5. `restartVM` - Reiniciar VM
 6. `deleteVM` - Eliminar VM

### Contenedores LXC
 1. `listContainers` - Listar contenedores
 2. `getContainer` - Configuración de contenedor
 3. `startContainer` - Iniciar contenedor
 4. `stopContainer` - Detener contenedor
 5. `restartContainer` - Reiniciar contenedor
 6. `deleteContainer` - Eliminar contenedor

## ✅ Proyecto Completado

 El servidor MCP está completamente funcional y listo para producción. Todas las especificaciones del archivo de requisitos han sido implementadas:

 - ✅ Estructura TypeScript modular
 - ✅ Autenticación dual (Token/Password)
 - ✅ Todas las herramientas de VM requeridas
 - ✅ Todas las herramientas de contenedores requeridas
 - ✅ Manejo robusto de errores
 - ✅ Configuración SSL flexible
 - ✅ Documentación completa
 - ✅ Proyecto compilado y validado


