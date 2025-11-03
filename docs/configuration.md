 # Configuración

 Crea un archivo `.env` (basado en `.env.example`) con las siguientes variables:

 ## Servidor Proxmox

 ```bash
 PROXMOX_HOST=tu-servidor-proxmox.com
 PROXMOX_PORT=8006
 ```

 ## Método de autenticación

 Opción 1 (recomendada): API Token

 ```bash
 PROXMOX_AUTH_METHOD=token
 PROXMOX_TOKEN=user@pam!tokenid=tu-token-aqui
 ```

 Opción 2: Usuario y contraseña

 ```bash
 PROXMOX_AUTH_METHOD=password
 PROXMOX_USERNAME=tu-usuario@pam
 PROXMOX_PASSWORD=tu-contraseña
 ```

 ## SSL

 ```bash
 # Para ignorar certificados SSL (útil en desarrollo)
 PROXMOX_REJECT_UNAUTHORIZED=false
 ```


