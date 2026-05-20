#!/usr/bin/env bash
# Lanza el servidor MCP Proxmox (stdio) con .env cargado.
# Uso en Cursor: ~/.cursor/mcp.json → "command": "/ruta/absoluta/scripts/run-mcp.sh"
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"
DIST_ENTRY="$PROJECT_ROOT/dist/index.js"
SRC_ENTRY="$PROJECT_ROOT/src/index.ts"

usage() {
  cat <<'EOF'
Uso: scripts/run-mcp.sh [opciones]

Opciones:
  -h, --help              Muestra esta ayuda
  -c, --print-config      Imprime un bloque JSON de ejemplo para Cursor (en stderr)
  -b, --build             Compila (npm run build) antes de arrancar
  --dev                   Fuerza arranque con ts-node aunque exista dist/

Requisitos:
  - Node.js >= 18
  - npm install en el proyecto
  - Archivo .env con credenciales Proxmox (cp .env.example .env)

El servidor usa stdio: no escribe en stdout salvo el protocolo MCP.
Los logs van a stderr (console.error).
EOF
}

log() {
  echo "$*" >&2
}

die() {
  log "Error: $*"
  exit 1
}

load_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    die "No existe $ENV_FILE. Crea uno con: cp .env.example .env"
  fi

  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
}

validate_env() {
  if [[ -z "${PROXMOX_HOST:-}" || "${PROXMOX_HOST}" == "tu-servidor-proxmox.com" ]]; then
    die "Configura PROXMOX_HOST en .env"
  fi

  local auth="${PROXMOX_AUTH_METHOD:-token}"
  case "$auth" in
    token)
      if [[ -z "${PROXMOX_TOKEN:-}" || "${PROXMOX_TOKEN}" == *"tu-token"* ]]; then
        die "Configura PROXMOX_TOKEN en .env (formato: user@pam!tokenid=secreto)"
      fi
      ;;
    password)
      if [[ -z "${PROXMOX_USERNAME:-}" || -z "${PROXMOX_PASSWORD:-}" ]]; then
        die "Configura PROXMOX_USERNAME y PROXMOX_PASSWORD en .env"
      fi
      ;;
    *)
      die "PROXMOX_AUTH_METHOD debe ser 'token' o 'password' (actual: $auth)"
      ;;
  esac
}

check_node() {
  if ! command -v node >/dev/null 2>&1; then
    die "Node.js no está en PATH. Instala Node >= 18."
  fi

  local major
  major="$(node -p "process.versions.node.split('.')[0]")"
  if [[ "$major" -lt 18 ]]; then
    die "Se requiere Node.js >= 18 (actual: $(node -v))"
  fi
}

check_deps() {
  if [[ ! -d "$PROJECT_ROOT/node_modules" ]]; then
    die "Faltan dependencias. Ejecuta: cd $PROJECT_ROOT && npm install"
  fi
}

print_cursor_config() {
  local script_path="$SCRIPT_DIR/run-mcp.sh"
  cat >&2 <<EOF

Añade esto en ~/.cursor/mcp.json (o mcp.json del proyecto):

{
  "mcpServers": {
    "proxmox": {
      "command": "$script_path"
    }
  }
}

Reinicia Cursor tras guardar. Ruta del script: $script_path

EOF
}

MODE="prod"
DO_BUILD=0
PRINT_CONFIG=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    -c|--print-config)
      PRINT_CONFIG=1
      shift
      ;;
    -b|--build)
      DO_BUILD=1
      shift
      ;;
    --dev)
      MODE="dev"
      shift
      ;;
    *)
      die "Opción desconocida: $1 (usa --help)"
      ;;
  esac
done

if [[ "$PRINT_CONFIG" -eq 1 ]]; then
  print_cursor_config
  exit 0
fi

check_node
check_deps
load_env
validate_env

cd "$PROJECT_ROOT"

if [[ "$DO_BUILD" -eq 1 ]]; then
  log "Compilando..."
  npm run build --silent
fi

if [[ "$MODE" == "dev" ]]; then
  log "Modo desarrollo (ts-node)"
  exec node --loader ts-node/esm "$SRC_ENTRY"
fi

if [[ -f "$DIST_ENTRY" ]]; then
  exec node "$DIST_ENTRY"
fi

if [[ ! -f "$SRC_ENTRY" ]]; then
  die "No se encontró $SRC_ENTRY"
fi

log "dist/ no existe; usando ts-node. Para producción: npm run build"
exec node --loader ts-node/esm "$SRC_ENTRY"
