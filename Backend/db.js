import dotenv from 'dotenv';
import { createClient } from '@libsql/client/web';

dotenv.config();

// Configura el cliente para productos, servicios y accesorios
const client = createClient({
  url: 'https://cicloit-samuelnar.turso.io',   
  authToken: process.env.DB_TOKEN,
});

// Configura el cliente para presupuestos
const presupuesto = createClient({
  url: 'https://presupuesto-samuelnar.turso.io',
  authToken: process.env.DB_TOKEN_PRESUPUESTO,
});

export default { client, presupuesto };