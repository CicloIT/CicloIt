import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

// Validar que las variables de entorno existan
const requiredEnvVars = {
  DB_TOKEN: process.env.DB_TOKEN,
  DB_TOKEN_PRESUPUESTO: process.env.DB_TOKEN_PRESUPUESTO,
  DB_TOKEN_STOCK: process.env.DB_TOKEN_STOCK
};

// Verificar que todas las variables estén definidas
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Variable de entorno ${key} no está definida`);
  }
});

// Configura el cliente para productos, servicios y accesorios
export const client = createClient({
  url: 'libsql://cicloit-cicloit.aws-us-east-1.turso.io',     
  authToken: process.env.DB_TOKEN,
});

// Configura el cliente para presupuestos
export const presupuesto = createClient({
  url: 'libsql://presupuesto-cicloit.aws-us-east-1.turso.io',
  authToken: process.env.DB_TOKEN_PRESUPUESTO
});

// Configura el cliente para stock de materiales
export const stock = createClient({
  url: 'libsql://materialstock-cicloit.aws-us-east-1.turso.io',
  authToken: process.env.DB_TOKEN_STOCK
});

// Función para testear las conexiones (opcional, útil para debugging)
export const testConnections = async () => {
  try {
    console.log('🔄 Testeando conexiones a las bases de datos...');
    
    // Test cliente principal
    await client.execute('SELECT 1');
    console.log('✅ Conexión principal: OK');
    
    // Test presupuesto
    await presupuesto.execute('SELECT 1');
    console.log('✅ Conexión presupuesto: OK');
    
    // Test stock
    await stock.execute('SELECT 1');
    console.log('✅ Conexión stock: OK');
    
    console.log('🎉 Todas las conexiones funcionan correctamente');
  } catch (error) {
    console.error('❌ Error en las conexiones:', error.message);
    throw error;
  }
};

// Función para cerrar las conexiones (útil para cleanup)
export const closeConnections = async () => {
  try {
    await client.close();
    await presupuesto.close();
    await stock.close();
    console.log('🔒 Conexiones cerradas correctamente');
  } catch (error) {
    console.error('❌ Error cerrando conexiones:', error.message);
  }
};