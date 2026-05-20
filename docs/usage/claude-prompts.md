# Prompts para Claude Desktop (Proxmox MCP)

Guía de prompts listos para copiar y pegar en **Claude Desktop** con el servidor MCP `proxmox` configurado.

## Antes de usar los prompts

1. **Claude Desktop** debe tener el MCP `proxmox` activo en `~/Library/Application Support/Claude/claude_desktop_config.json`.
2. Reinicia Claude (Cmd+Q) tras cambiar la configuración o recompilar el proyecto (`npm run build`).
3. En la mayoría de clústeres de un solo nodo, el nombre del nodo es **`pve`**. Sustitúyelo si el tuyo es otro.
4. Claude pedirá **permiso** antes de ejecutar cada herramienta; acéptalo para que funcione.
5. Las operaciones de **eliminar** son irreversibles; úsalas solo cuando estés seguro.

---

## Verificación y diagnóstico

### Comprobar que el MCP está conectado

```
¿Qué herramientas MCP de Proxmox tienes disponibles? Enuméralas con una breve descripción de cada una.
```

### Prueba rápida de conexión (solo lectura)

```
Usa el MCP de Proxmox para listar las máquinas virtuales (QEMU) en el nodo pve. Muéstrame ID, nombre y estado de cada una.
```

### Inventario completo del nodo

```
En el nodo pve de Proxmox, haz un inventario completo:
1. Lista todas las VMs (QEMU)
2. Lista todos los contenedores LXC
3. Resume cuántos hay en cada estado (running, stopped, etc.)
```

### Estado de una VM concreta

```
Obtén la configuración detallada de la VM con ID 100 en el nodo pve usando Proxmox MCP.
```

*(Cambia `100` por el vmid que necesites.)*

### Estado de un contenedor concreto

```
Obtén la configuración detallada del contenedor LXC con ID 101 en el nodo pve usando Proxmox MCP.
```

---

## Máquinas virtuales (QEMU)

### Listar VMs

```
Lista todas las máquinas virtuales del nodo pve con Proxmox MCP. Incluye vmid, nombre, estado, memoria y CPUs.
```

```
¿Hay alguna VM en ejecución en el nodo pve? Lista todas y dime cuáles están running y cuáles stopped.
```

### Ver configuración de una VM

```
Muéstrame la configuración completa de la VM 100 en el nodo pve (memoria, CPUs, tipo de SO, disco, etc.).
```

```
Compara la configuración de las VMs 100 y 101 en el nodo pve.
```

### Iniciar una VM

```
Inicia la máquina virtual con ID 100 en el nodo pve usando Proxmox MCP.
```

```
La VM open-deb (vmid 100) está parada en pve. Arráncala y confirma cuando esté en ejecución.
```

### Detener una VM

```
Detiene la máquina virtual con ID 100 en el nodo pve.
```

```
Para de forma segura todas las VMs en ejecución del nodo pve. Primero lista cuáles están running y luego detén cada una.
```

### Reiniciar una VM

```
Reinicia la máquina virtual con ID 100 en el nodo pve.
```

```
Reinicia la VM 100 en pve: primero comprueba su estado, reiníciala y vuelve a comprobar que está running.
```

### Eliminar una VM (destructivo)

```
⚠️ Antes de eliminar nada: lista las VMs del nodo pve y confirma conmigo cuál quieres borrar. No elimines nada sin mi confirmación explícita.
```

```
Elimina la máquina virtual con ID 999 en el nodo pve. Solo hazlo si existe y yo lo he confirmado.
```

---

## Contenedores LXC

### Listar contenedores

```
Lista todos los contenedores LXC del nodo pve con Proxmox MCP. Incluye vmid, nombre, hostname y estado.
```

```
¿Hay contenedores LXC en el nodo pve? Si no hay ninguno, dímelo claramente.
```

### Ver configuración de un contenedor

```
Muéstrame la configuración del contenedor LXC con ID 101 en el nodo pve.
```

### Iniciar un contenedor

```
Inicia el contenedor LXC con ID 101 en el nodo pve.
```

### Detener un contenedor

```
Detiene el contenedor LXC con ID 101 en el nodo pve.
```

### Reiniciar un contenedor

```
Reinicia el contenedor LXC con ID 101 en el nodo pve.
```

### Eliminar un contenedor (destructivo)

```
Lista los contenedores LXC del nodo pve. No elimines ninguno hasta que yo confirme el vmid.
```

```
Elimina el contenedor LXC con ID 101 en el nodo pve solo si yo lo he confirmado en este chat.
```

---

## Flujos de trabajo (varios pasos)

### Arrancar entorno de desarrollo

```
En el nodo pve:
1. Lista todas las VMs y contenedores
2. Identifica los que están stopped y parecen de desarrollo (por nombre)
3. Propón cuáles arrancar; no inicies nada hasta que yo apruebe la lista
```

### Apagado ordenado del nodo

```
Quiero apagar todo lo que esté en ejecución en el nodo pve:
1. Lista VMs y contenedores running
2. Muéstrame el plan de parada
3. Ejecuta el apagado solo tras mi confirmación
```

### Auditoría de recursos

```
Haz una auditoría del nodo pve en Proxmox:
- VMs: ID, nombre, estado, RAM asignada, CPUs
- LXC: ID, nombre, estado
- Resumen en tabla markdown
- Señala recursos parados que podrían liberarse
```

### Buscar por nombre

```
Lista todas las VMs del nodo pve y dime si existe alguna cuyo nombre contenga "deb" o "open".
```

### Resumen para informe

```
Genera un informe breve del estado actual de Proxmox en el nodo pve: VMs, contenedores, cuántos running/stopped, y cualquier anomalía que detectes. Formato markdown.
```

---

## Prompts con variables (plantillas)

Sustituye los valores entre corchetes antes de enviar:

```
Lista las VMs del nodo [NODO] con Proxmox MCP.
```
→ Ejemplo: `pve`, `proxmox`, etc.

```
Obtén la configuración de la VM [VMID] en el nodo [NODO].
```

```
Inicia la VM [VMID] en [NODO] y confirma el estado final.
```

```
Lista los contenedores LXC en [NODO] y muestra el contenedor [VMID] si existe.
```

---

## Prompts de sistema (opcional)

Puedes pegar esto al inicio de un chat nuevo para que Claude se comporte de forma consistente:

```
Eres mi asistente de infraestructura Proxmox. Tienes acceso al MCP proxmox con herramientas para VMs (QEMU) y contenedores (LXC).

Reglas:
- El nodo por defecto es pve salvo que yo indique otro.
- Siempre lista o consulta antes de iniciar, parar, reiniciar o eliminar.
- Nunca elimines VMs ni contenedores sin confirmación explícita mía.
- Si una herramienta falla, muestra el error exacto y sugiere revisar token, red o nombre del nodo.
- Responde en español y usa tablas o listas para inventarios.
```

---

## Solución de problemas (qué preguntar a Claude)

### Si dice que no puede conectar

```
Intenta de nuevo listar las VMs del nodo pve con Proxmox MCP. Si falla, dime el mensaje de error exacto de la herramienta.
```

### Si no aparece el servidor proxmox

```
¿Tienes acceso al servidor MCP llamado proxmox? Si no, indícame qué servidores MCP ves disponibles.
```

### Si el nodo no es pve

```
Lista las VMs probando el nodo pve. Si falla por nodo inexistente, sugiere nombres de nodo habituales en Proxmox y cómo averiguar el correcto.
```

---

## Referencia rápida: herramienta → prompt corto

| Herramienta MCP | Prompt ejemplo |
|-----------------|----------------|
| `listVMs` | Lista las VMs del nodo pve |
| `getVM` | Configuración de la VM 100 en pve |
| `startVM` | Inicia la VM 100 en pve |
| `stopVM` | Detiene la VM 100 en pve |
| `restartVM` | Reinicia la VM 100 en pve |
| `deleteVM` | Elimina la VM 100 en pve *(confirmar antes)* |
| `listContainers` | Lista contenedores LXC en pve |
| `getContainer` | Configuración del contenedor 101 en pve |
| `startContainer` | Inicia el contenedor 101 en pve |
| `stopContainer` | Detiene el contenedor 101 en pve |
| `restartContainer` | Reinicia el contenedor 101 en pve |
| `deleteContainer` | Elimina el contenedor 101 en pve *(confirmar antes)* |

---

## Enlaces relacionados

- [Herramientas MCP (detalle técnico)](./tools.md)
- [Servidor MCP (stdio)](./mcp-server.md)
- [Configuración](../setup/configuration.md)
- [Solución de problemas](../dev/troubleshooting.md)
