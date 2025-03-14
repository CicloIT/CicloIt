import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

// Configura el cliente para productos, servicios y accesorios
const client = createClient({
  url: 'libsql://cicloit-samuelnar.turso.io',   
  authToken: process.env.DB_TOKEN,
  tls: true,
  syncUrl: 'https://cicloit-samuelnar.turso.io' // URL HTTP en lugar de WebSockets
});

// Configura el cliente para presupuestos
const presupuesto = createClient({
  url: 'libsql://presupuesto-samuelnar.turso.io',
  authToken: process.env.DB_TOKEN_PRESUPUESTO,
  tls: true,
  syncUrl: 'https://presupuesto-samuelnar.turso.io' // URL HTTP en lugar de WebSockets
});

export default { client, presupuesto };