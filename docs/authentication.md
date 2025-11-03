 # Autenticación

 `proxmox-mcp` soporta dos métodos:

 - API Token (recomendado)
 - Usuario y contraseña

 ## API Token (recomendado)

 1. Ingresa a la interfaz web de Proxmox.
 2. Ve a Datacenter → Permissions → API Tokens.
 3. Crea un token:
    - User: usuario existente
    - Token ID: nombre descriptivo
    - Privilege Separation: desmarcar si deseas usar permisos del usuario
 4. Coloca el token en `PROXMOX_TOKEN`.

 ## Usuario y contraseña

 Asegura permisos mínimos:

 - VM.Audit
 - VM.PowerMgmt
 - VM.Allocate (para eliminar)


