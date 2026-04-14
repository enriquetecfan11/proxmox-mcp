# Ejemplos de uso

## Uso con cliente MCP

Una vez conectado a un LLM compatible con MCP, puedes usar comandos como:

- "Lista todas las máquinas virtuales en el nodo pve1"
- "Detén el contenedor 106 en el nodo nodo2"
- "Reinicia la VM con ID 103 en el nodo home"
- "Muéstrame la configuración del contenedor 200"

## Uso con API HTTP

### Listar VMs

```bash
curl http://localhost:3000/vms?node=pve
```

### Iniciar una VM

```bash
curl -X POST http://localhost:3000/vms/100/start?node=pve
```

### Obtener información de un contenedor

```bash
curl http://localhost:3000/containers/106?node=pve
```

### Ver estado del servidor

```bash
curl http://localhost:3000/health
```

## Scripts de ejemplo

### Ejemplo en Node.js

```javascript
const axios = require('axios');

async function listVMs() {
  try {
    const response = await axios.get('http://localhost:3000/vms?node=pve');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listVMs();
```

### Ejemplo en Python

```python
import requests

def list_vms():
    response = requests.get('http://localhost:3000/vms?node=pve')
    return response.json()

vms = list_vms()
print(vms)
```

