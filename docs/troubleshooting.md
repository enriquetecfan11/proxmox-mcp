 # Solución de problemas

 ## Error de conexión SSL

 Configura:

 ```bash
 PROXMOX_REJECT_UNAUTHORIZED=false
 ```

 ## Error de autenticación

 - Verifica token/credenciales.
 - Asegura permisos adecuados.
 - Valida expiración de tokens.

 ## Error de permisos

 Permisos mínimos recomendados:

 - `VM.Audit`
 - `VM.PowerMgmt`
 - `VM.Allocate` (para eliminar)


