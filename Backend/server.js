import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();
const port = 3000;
// Middleware
app.use(express.json());
app.use(cors());

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
  const { nombreCliente, descripcion, productos, servicios, accesorios, total,cotizacionDolar} = req.body;
  // Convertir total a número real para mayor seguridad
  const totalPresupuesto = parseFloat(total);
  const cotizacionDolars = parseFloat(cotizacionDolar);  
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
        productosText += `${producto.nombre} (${cantidad} x $${parseFloat(producto.precio_con_iva).toFixed(2)}), `;
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
        accesoriosText += `${accesorio.nombre} (${cantidad} x $${parseFloat(accesorio.precio_con_iva).toFixed(2)}), `;
      }
    }

    // Eliminar la coma y el espacio extra al final de cada cadena
    productosText = productosText ? productosText.slice(0, -2) : "";
    serviciosText = serviciosText ? serviciosText.slice(0, -2) : "";
    accesoriosText = accesoriosText ? accesoriosText.slice(0, -2) : "";
    const estado = "pendiente"; 
    const totalDolares = totalPresupuesto / cotizacionDolars;    
    // Paso 4: Insertar el presupuesto en la tabla `presupuesto`
    const resultPresupuesto = await db.presupuesto.execute({
      sql: "INSERT INTO presupuesto (nombre_cliente, descripcion, productos, servicios, accesorios, total, estado,dolares) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [nombreCliente, descripcion, productosText, serviciosText, accesoriosText, totalPresupuesto, estado,totalDolares]
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
          : parseFloat(item.precio_con_iva) * cantidad;
    
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
      totalPesos: totalPresupuesto,
      totalDolares: totalDolares,
      cotizacionDolar: cotizacionDolar,
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
  const presupuestoId = req.params.id;

  try {
    // Obtener los datos del presupuesto
    const resultPresupuesto = await db.presupuesto.execute({
      sql: `SELECT * FROM presupuesto WHERE id = ?`,
      args: [presupuestoId]
    });

    if (!resultPresupuesto.rows.length) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }

    const presupuesto = resultPresupuesto.rows[0];
    const nombreCliente = presupuesto.nombre_cliente; // Obtener el nombre del cliente

    // Obtener el CUIT y tipo_iva del cliente desde la otra base de datos
    const resultCliente = await db.client.execute({
      sql: `SELECT cuit, tipo_iva FROM clientes WHERE empresa = ?`,
      args: [nombreCliente]
    });

    // Verificar si el cliente fue encontrado
    const cliente = resultCliente.rows.length ? resultCliente.rows[0] : null;        
    // Devolver la respuesta combinando los datos
    res.status(200).json({ ...presupuesto, ...cliente });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los detalles del presupuesto" });
  }
});


app.get("/productos", async (req, res) => {  
  try {
    const result = await db.presupuesto.execute("SELECT * FROM productos");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

app.get("/servicios", async (req, res) => {
  try {
    const result = await db.presupuesto.execute("SELECT * FROM servicios");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
});

app.get("/accesorios", async (req, res) => {
  try {
    const result = await db.presupuesto.execute("SELECT * FROM accesorios");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los accesorios" });
  }
});

app.put("/actualizar-contrasena", async (req, res) => {
  const { id, nuevaContra } = req.body;
  if (!id || !nuevaContra) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContra, 10);    
    // Ejecutar la consulta para actualizar la contraseña
    const result = await db.client.execute({
      sql: "UPDATE usuarios SET contrasena = ? WHERE id = ?",
      args: [hashedPassword, id],
    });    
    // Verificar si se actualizó alguna fila
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Responder éxito
    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Productos, servicios y accesorios
app.post("/agregar_producto", async (req, res) => {
  const { nombre, precio_neto, precio_con_iva, proveedor, modelo, stock, categoria } = req.body;

  if (isNaN(precio_neto) || isNaN(precio_con_iva) || isNaN(stock)) {
    return res.status(400).json({ error: "Los precios y el stock deben ser números válidos" });
  }

  // Validar que la categoría sea válida
  if (!["producto", "accesorio"].includes(categoria)) {
    return res.status(400).json({ error: "Categoría no válida" });
  }

  try {
    let table = categoria === "producto" ? "productos" : "accesorios";

    const result = await db.presupuesto.execute(
      {
        sql: `INSERT INTO ${table} (nombre, precio_neto, precio_con_iva, proveedor, modelo, stock) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [nombre, parseFloat(precio_neto), parseFloat(precio_con_iva), proveedor, modelo, parseInt(stock)]
      }
    );

    const lastInsertId = Number(result.lastInsertRowid);
    res.status(201).json({ id: lastInsertId, message: `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} agregado exitosamente` });
  } catch (error) {
    console.error("Error al agregar producto o accesorio:", error);
    res.status(500).json({ error: "Error al agregar el producto o accesorio" });
  }
});


//Productos, servicios y accesorios
app.post("/agregar_servicios", async (req, res) => {
  const { nombre, precio_por_hora} = req.body;  
  try { 
    const result = await db.presupuesto.execute(
      {
        sql: "INSERT INTO servicios (nombre, precio_por_hora) VALUES (?, ?)",
        args: [nombre, precio_por_hora]
      }
    );
    //pasamos el id de bigInt a numeber
    const lastInsertId = Number(result.lastInsertRowid);    
    res.status(201).json({ id: lastInsertId, message: "Producto agregado exitosamente" });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

app.post("/agregar_ot", async (req, res) => {
  const { id_presupuesto,id_usuario, importancia  } = req.body; // Asegúrate de enviar el ID en el body
  if (!id_presupuesto) {
    return res.status(400).json({ error: "ID de presupuesto requerido" });
  }  
  try {
    // 1️⃣ Obtener los datos del presupuesto desde la base de datos de presupuesto
    const presupuestoResult = await db.presupuesto.execute({
      sql: "SELECT nombre_cliente, productos, accesorios, servicios FROM presupuesto WHERE id = ?",
      args: [id_presupuesto]
    });

    if (presupuestoResult.rows.length === 0) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }

    const { nombre_cliente, productos, accesorios, servicios } = presupuestoResult.rows[0];    

    // 2️⃣ Obtener el id_cliente a partir del nombre_cliente en la base de datos de clientes
    const clienteResult = await db.client.execute({
      sql: "SELECT id FROM clientes WHERE empresa = ?", // Cambio de nombre a empresa en vez de nombre_cliente
      args: [nombre_cliente]
    });

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const id_cliente = clienteResult.rows[0].id;

    // 3️⃣ Construir la descripción concatenada
    const descripcion = [productos, accesorios, servicios].filter(Boolean).join(', ');

    // 4️⃣ Insertar los datos en la tabla OT en la base de datos de clientes
    const ot = await db.client.execute({
      sql: `INSERT INTO orden_trabajo (id_cliente, importancia, descripcion, estado, creacion, modificacion, id_presupuesto, id_usuario)  
            VALUES (?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)`,
      args: [id_cliente, importancia, descripcion, id_presupuesto, id_usuario], // Usamos los valores de importancia y id_usuario recibidos
    });
    

    res.json({ success: true, message: "OT generada correctamente", otId: Number(ot.lastInsertRowid) });


  } catch (error) {
    console.error("Error al agregar orden de trabajo:", error);
    res.status(500).json({ error: "Error al agregar la orden de trabajo" });
  }
});

app.put("/actualizarOrden/:id", async (req, res) => {
  const { id } = req.params;
  const { importancia, estado, id_usuario } = req.body;

  if (!importancia || !estado || !id_usuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  try {
    const result = await db.client.execute({
      sql: `
        UPDATE orden_trabajo 
        SET importancia = ?, estado = ?, id_usuario = ?
        WHERE id = ?
      `,
      args: [importancia, estado, id_usuario, id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ mensaje: "Orden actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
 
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});