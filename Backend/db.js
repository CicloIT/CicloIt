import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();
// Configura el cliente
const client = createClient({
  url: 'libsql://cicloit-samuelnar.turso.io',   
  authToken: process.env.DB_TOKEN,  // Reemplaza con tu token de autenticación
});

/*import mysql from 'mysql2';
dotenv.config();
const connection = mysql.createPool({
    host: process.env.DB_HOSTURSO,
    password: process.env.DB_TOKEN,
    user: 'samuelnar',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connection.promise();
*/
export default client;