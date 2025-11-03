import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'Proxmox MCP HTTP Server Test',
    version: '1.0.0',
    status: 'running',
    message: '¡El servidor HTTP está funcionando correctamente!'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.error(`🚀 Servidor HTTP de prueba iniciado en http://localhost:${port}`);
  console.error(`📝 El servidor está ejecutándose correctamente`);
  console.error(`🌐 Endpoints disponibles:`);
  console.error(`   - GET  http://localhost:${port}/ (información del servidor)`);
  console.error(`   - GET  http://localhost:${port}/health (estado de salud)`);
});

// Mantener el proceso vivo
process.on('SIGINT', () => {
  console.error('\n🛑 Servidor detenido por el usuario');
  process.exit(0);
}); 