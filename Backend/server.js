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

// Configuración de Turso


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

app.post("/registro", async (req, res) => {
  const { nombre, apellido, password, rol } = req.body;

  if (!nombre || !apellido || !password || !rol) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.client.execute({
      sql: "INSERT INTO usuarios (nombre, apellido, contrasena, rol) VALUES (?, ?, ?, ?)",
      args: [nombre, apellido, hashedPassword, rol]
    });
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const result = await db.client.execute("SELECT * FROM usuarios");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.get("/clientes", async (req, res) => {
  try {
    const result = await db.client.execute("SELECT * FROM clientes");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.client.execute({
      sql: "SELECT * FROM usuarios WHERE id = ?",
      args: [id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(result.rows[0]);
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
    const result = await db.client.execute({
      sql: "INSERT INTO orden_trabajo (id_cliente, id_usuario, importancia, descripcion, estado) VALUES (?, ?, ?, ?, ?)",
      args: [id_cliente, id_usuario, importancia, descripcion, estado]
    });

    res.status(201).json({
      id: result.lastInsertRowid,
      message: "Orden de trabajo creada exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la orden de trabajo" });
  }
});

app.get("/ordenes", async (req, res) => {
  try {
    const result = await db.client.execute(`
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
      ORDER BY ot.creacion DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las órdenes de trabajo" });
  }
});

app.post("/reclamos", async (req, res) => {
  const { usuario_id, ordenTrabajo_id, titulo, descripcion, importancia, estado } = req.body;

  if (!usuario_id || !ordenTrabajo_id || !titulo || !descripcion || !importancia || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const ordenResult = await db.client.execute({
      sql: "SELECT * FROM orden_trabajo WHERE id = ?",
      args: [ordenTrabajo_id]
    });
    
    if (ordenResult.rows.length === 0) {
      return res.status(404).json({ error: "La orden de trabajo no existe" });
    }

    const result = await db.client.execute({
      sql: `INSERT INTO reclamos (usuario_id, ordenTrabajo_id, titulo, descripcion, importancia, estado)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [usuario_id, ordenTrabajo_id, titulo, descripcion, importancia, estado]
    });

    res.status(201).json({
      id: result.lastInsertRowid,
      message: "Reclamo creado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el reclamo" });
  }
});

app.get("/api/clientes", async (req, res) => {
  try {
    const result = await db.client.execute("SELECT * FROM clientes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

app.get("/api/usuarios", async (req, res) => {
  try {
    const result = await db.client.execute("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

app.get("/api/ordenesTrabajo", async (req, res) => {
  try {
    const result = await db.client.execute(`
      SELECT ot.id, ot.descripcion, c.empresa AS empresa
      FROM orden_trabajo ot
      JOIN clientes c ON ot.id_cliente = c.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las órdenes de trabajo" });
  }
});

app.get("/api/reclamos", async (req, res) => {
  try {
    const result = await db.client.execute(`
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
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los reclamos" });
  }
});

app.post("/clientes", async (req, res) => {
  const { nombre, empresa, email, telefono, localidad, provincia, direccion } = req.body;
  
  if (!empresa || !localidad || !provincia) {
    return res.status(400).json({ error: "empresa, localidad y provincia son obligatorios" });
  }
  
  try {
    const result = await db.client.execute({
      sql: `INSERT INTO clientes (nombre, empresa, email, telefono, localidad, provincia, direccion) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [nombre, empresa, email, telefono, localidad, provincia, direccion]
    });

    res.status(201).json({
      id: result.lastInsertRowid,
      message: "Cliente creado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
});


/* Presupuesto */
app.post("/presupuestos", verificarToken, async (req, res) => {
  const { nombreCliente, descripcion, productos, servicios, accesorios, total } = req.body;

  // Convertir total a número real para mayor seguridad
  const totalPresupuesto = parseFloat(total);

  // Validación para asegurarse de que se haya seleccionado al menos un producto, servicio o accesorio
  if (!productos.length && !servicios.length && !accesorios.length) {
    return res.status(400).json({ error: "Debe incluir al menos un producto, servicio o accesorio" });
  }

  try {
    // Inicializar las variables
    let productosText = "";
    let serviciosText = "";
    let accesoriosText = "";

    // Paso 1: Construir las cadenas de texto para los productos
    if (productos && productos.length > 0) {
      for (const producto of productos) {
        const id = producto.id ? Number(producto.id) : null;
        const cantidad = producto.cantidad || 1; // Usar la cantidad que envía el frontend
        productosText += `${producto.nombre} (${cantidad} x $${parseFloat(producto.precio).toFixed(2)}), `;
      }
    }
    
    // Paso 2: Construir las cadenas de texto para los servicios
    if (servicios && servicios.length > 0) {
      for (const servicio of servicios) {
        const id = servicio.id ? Number(servicio.id) : null;
        const horas = servicio.horas || 1;
        serviciosText += `${servicio.nombre} (${horas} horas a $${parseFloat(servicio.precio_por_hora).toFixed(2)}/hora), `;
      }
    }
    
    // Paso 3: Construir las cadenas de texto para los accesorios
    if (accesorios && accesorios.length > 0) {
      for (const accesorio of accesorios) {
        const id = accesorio.id ? Number(accesorio.id) : null;
        const cantidad = accesorio.cantidad || 1; // Usar la cantidad que envía el frontend
        accesoriosText += `${accesorio.nombre} (${cantidad} x $${parseFloat(accesorio.precio).toFixed(2)}), `;
      }
    }

    // Eliminar la coma y el espacio extra al final de cada cadena
    productosText = productosText ? productosText.slice(0, -2) : "";
    serviciosText = serviciosText ? serviciosText.slice(0, -2) : "";
    accesoriosText = accesoriosText ? accesoriosText.slice(0, -2) : "";

    console.log("Datos recibidos en el backend:", req.body);

    // Paso 4: Insertar el presupuesto en la tabla `presupuesto`
    const resultPresupuesto = await db.presupuesto.execute({
      sql: "INSERT INTO presupuesto (nombre_cliente, descripcion, productos, servicios, accesorios, total) VALUES (?, ?, ?, ?, ?, ?)",
      args: [nombreCliente, descripcion, productosText, serviciosText, accesoriosText, totalPresupuesto]
    });

    // Obtener el ID del presupuesto insertado
    const presupuestoId = Number(resultPresupuesto.lastInsertRowid);

    // Paso 5: Insertar los detalles de cada ítem en la tabla `presupuesto_detalle`
    const insertarDetalles = async (items, tipo) => {
      for (const item of items) {
        const itemId = item.id ? Number(item.id) : null;
        const cantidad = item.cantidad || 1; // Usar la cantidad que se recibe
        const subtotal = tipo === 'servicio'
          ? parseFloat(item.precio_por_hora) * cantidad
          : parseFloat(item.precio) * cantidad;
    
        await db.presupuesto.execute({
          sql: "INSERT INTO presupuesto_detalle (presupuesto_id, tipo, item_id, nombre, cantidad, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
          args: [presupuestoId, tipo, itemId, item.nombre, cantidad, subtotal]
        });
      }
    };
    
    // Insertar detalles para productos, servicios y accesorios
    if (productos.length > 0) await insertarDetalles(productos, "producto");
    if (servicios.length > 0) await insertarDetalles(servicios, "servicio");
    if (accesorios.length > 0) await insertarDetalles(accesorios, "accesorio");

    // Devolver la respuesta con el ID del presupuesto creado
    res.status(201).json({ 
      presupuestoId: Number(presupuestoId), 
      total: totalPresupuesto, 
      message: "Presupuesto creado exitosamente" 
    });

  } catch (error) {
    console.error("Error al crear presupuesto:", error);
    res.status(500).json({ error: "Error al crear el presupuesto", details: error.message });
  }
});


// Obtener todos los presupuestos
app.get("/presupuestos", verificarToken, async (req, res) => {
  try {
    // Obtener todos los presupuestos ordenados por fecha de creación (más recientes primero)
    const result = await db.presupuesto.execute("SELECT * FROM presupuesto ORDER BY fecha DESC");    
    // Verificar si hay resultados
    const presupuestos = result.rows || []; // Si no hay presupuestos, retorna un arreglo vacío    
    res.status(200).json(presupuestos);
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    res.status(500).json({ error: "Error al obtener los presupuestos", details: error.message });
  }
});


app.get("/presupuestos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.presupuesto.execute({
      sql: `SELECT * FROM presupuesto WHERE id = ?`,
      args: [id]
    });
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los detalles del presupuesto" });
  }
});

app.get("/productos", async (req, res) => {  
  try {
    const result = await db.presupuesto.execute("SELECT * FROM producto");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

app.get("/servicios", async (req, res) => {
  try {
    const result = await db.presupuesto.execute("SELECT * FROM servicio");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
});

app.get("/accesorios", async (req, res) => {
  try {
    const result = await db.presupuesto.execute("SELECT * FROM accesorio");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los accesorios" });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});