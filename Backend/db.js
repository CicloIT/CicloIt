import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

// Configura el cliente para productos, servicios y accesorios
const client = createClient({
  url: 'libsql://cicloit-cicloit.aws-us-east-1.turso.io',     
  authToken: process.env.DB_TOKEN,  // Token de autenticación para la base de datos de productos, servicios, etc.
});

// Configura el cliente para presupuestos
const presupuesto = createClient({
  url: 'libsql://presupuesto-cicloit.aws-us-east-1.turso.io',
  authToken: process.env.DB_TOKEN_PRESUPUESTO  // Token de autenticación para la base de datos de presupuestos
});

// Exportamos ambas conexiones para su uso en otros archivos
export default { client, presupuesto };
