 # API HTTP

 El servidor HTTP expone endpoints REST para interactuar con Proxmox mediante `express`.

 Base URL por defecto: `http://localhost:3000`

 > Nota: Varios endpoints aceptan `?node=<nombre>` y por defecto usan `pve` si no se envía.

 ## Endpoints

 - `GET /` — Información del servidor y endpoints disponibles.
 - `GET /health` — Estado de salud y conectividad con Proxmox.
 - `GET /tools` — Lista de herramientas MCP disponibles (VM y LXC).

 ### VMs

 - `GET /vms?node=pve` — Lista VMs en el nodo.
 - `GET /vms/:vmid?node=pve` — Configuración de una VM.
 - `POST /vms/:vmid/start?node=pve` — Inicia VM.
 - `POST /vms/:vmid/stop?node=pve` — Detiene VM.
 - `POST /vms/:vmid/restart?node=pve` — Reinicia VM.

 ### Contenedores LXC

 - `GET /containers?node=pve` — Lista contenedores.
 - `GET /containers/:vmid?node=pve` — Configuración de un contenedor.
 - `POST /containers/:vmid/start?node=pve` — Inicia contenedor.
 - `POST /containers/:vmid/stop?node=pve` — Detiene contenedor.
 - `POST /containers/:vmid/restart?node=pve` — Reinicia contenedor.

 ### Nodos y servidor

 - `GET /nodes` — Lista de nodos disponibles.
 - `GET /server/info` — Versión de Proxmox, nodos y configuración básica expuesta.


