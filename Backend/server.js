/*import db.client from "./db.client.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());
app.use(cors());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos en ese tiempo
  message: { error: "Demasiados intentos, intenta más tarde" },
});

app.post("/login", async (req, res) => {
  const { nombre, contrasena } = req.body;
  try {
    const [users] = await db.client.query("SELECT * FROM usuarios WHERE nombre = ?", [
      nombre,
    ]);
    const user = users[0];
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, rol: user.rol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(401).json({ error: "Acceso denegado, token requerido" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

app.post("/registro", async (req, res) => {
  const { nombre, apellido, password, rol } = req.body;

  if (!nombre || !apellido || !password || !rol) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const query =
      "INSERT INTO usuarios (nombre,apellido,contrasena,rol) VALUES (?, ?, ?, ?)";
    const [resultado] = await db.client.query(query, [
      nombre,
      apellido,
      hashedPassword,
      rol,
    ]);
    res.status(201).json({ id: resultado.insertId });
  } catch (error) {
    console.error("s", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const query = "SELECT * FROM usuarios";
    const [rows] = await db.client.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.get("/clientes", async (req, res) => {
  try {
    const query = "SELECT * FROM clientes";
    const [rows] = await db.client.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT * FROM usuarios WHERE id = ?";
    const [rows] = await db.client.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.post("/ordenes", async (req, res) => {
  const { id_usuario, id_cliente, importancia, descripcion, estado } = req.body;

  if (!id_cliente || !id_usuario || !importancia || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const query = `INSERT INTO orden_trabajo (id_cliente, id_usuario, importancia, descripcion,estado) VALUES (?,?, ?, ?, ?)`;
    const [resultado] = await db.client.query(query, [
      id_cliente,
      id_usuario,
      importancia,
      descripcion,
      estado,
    ]);

    res.status(201).json({
      id: resultado.insertId,
      message: "Orden de trabajo creada exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la orden de trabajo" });
  }
});

app.get("/ordenes", async (req, res) => {
  try {
    const query = `
            SELECT 
                ot.id AS orden_id,
                c.empresa AS empresa,
                u.nombre AS nombre_usuario_asignado,
                ot.importancia,
                ot.descripcion,
                ot.estado,
                ot.creacion,
                ot.modificacion
            FROM orden_trabajo ot
            JOIN clientes c ON ot.id_cliente = c.id
            JOIN usuarios u ON ot.id_usuario = u.id
            ORDER BY ot.creacion DESC;
        `;
    const [ordenes] = await db.client.query(query);
    res.json(ordenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las órdenes de trabajo" });
  }
});

app.post("/reclamos", async (req, res) => {
  const {
    usuario_id,
    ordenTrabajo_id,
    titulo,
    descripcion,
    importancia,
    estado,
  } = req.body;

  if (
    !usuario_id ||
    !ordenTrabajo_id ||
    !titulo ||
    !descripcion ||
    !importancia ||
    !estado
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const [orden] = await db.client.query("SELECT * FROM orden_trabajo WHERE id = ?", [
      ordenTrabajo_id,
    ]);
    if (orden.length === 0) {
      return res.status(404).json({ error: "La orden de trabajo no existe" });
    }

    // Crear el reclamo
    const query = `
          INSERT INTO reclamos (usuario_id, ordenTrabajo_id, titulo, descripcion, importancia, estado)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [resultado] = await db.client.query(query, [
      usuario_id,
      ordenTrabajo_id,
      titulo,
      descripcion,
      importancia,
      estado,
    ]);

    // Respuesta exitosa
    res.status(201).json({
      id: resultado.insertId,
      message: "Reclamo creado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el reclamo" });
  }
});

app.get("/api/clientes", async (req, res) => {
  try {
    const [rows] = await db.client.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

app.get("/api/usuarios", async (req, res) => {
  try {
    const [rows] = await db.client.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

app.get("/api/ordenesTrabajo", async (req, res) => {
  try {
    const [rows] = await db.client.query(`
      SELECT ot.id, ot.descripcion, c.empresa AS empresa
      FROM orden_trabajo ot
      JOIN clientes c ON ot.id_cliente = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

app.get("/api/reclamos", async (req, res) => {
  try {
    const [rows] = await db.client.query(`
      SELECT r.id, r.titulo, r.descripcion AS reclamo_descripcion, 
       r.importancia, r.estado,
       u.nombre AS usuario_nombre, 
       c.empresa AS empresa, 
       ot.descripcion AS orden_descripcion
      FROM reclamos r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN orden_trabajo ot ON r.ordenTrabajo_id = ot.id
      JOIN clientes c ON ot.id_cliente = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

app.post("/clientes", async (req, res) => {
  const { nombre, empresa, email, telefono, localidad, provincia, direccion } = req.body;
  if (
    !empresa || localidad || provincia     
  ) {
    return res.status(400).json({ error: "empresa, localidad y provincia son obligatorios" });
  }
 try {
  const query = `INSERT INTO clientes (nombre, empresa, email, telefono, localidad, provincia, direccion) VALUES (?,?,?,?,?,?,?)`
  const [resultado] = await db.client.query(query, [
    nombre,
    empresa,
    email,
    telefono,
    localidad,
    provincia,
    direccion
  ]);

  res.status(201).json({    
    message: "Orden de trabajo creada exitosamente",
  });

 } catch (error) {
   console.log(error)
 }  

})

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import db from "./db.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Demasiados intentos, intenta más tarde" },
});

app.post("/login", async (req, res) => {
  const { nombre, contrasena } = req.body;
  try {
    const result = await db.client.execute({
      sql: "SELECT * FROM usuarios WHERE nombre = ?",
      args: [nombre]
    });
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, rol: user.rol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(401).json({ error: "Acceso denegado, token requerido" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};



app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});