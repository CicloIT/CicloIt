//const API_URL = 'https://ciclo-it.vercel.app';
const API_URL = 'http://localhost:3000';
export const login = async (data) => {
  try {
      const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error('Error al loguear');
      }
      const result = await response.json();
      localStorage.setItem('token', result.token); // Guardamos el token
      return result;
  } catch (error) {
      console.error(error);
      throw error;
  }
};

const getToken = () => localStorage.getItem('token');
export const registroUsuario = async (data) => {
    try {
        const response = await fetch(`${API_URL}/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}` 
            },
            body: JSON.stringify(data)
        });        
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const perfilUsuario = async (id) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}` 
            },
        });
        if (!response.ok) {
            throw new Error('Usuario no encontrado');
          }        
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const listaUsuarios = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}` 
            },
        });  
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const registrarOrden = async (data) => {
    try {
        const response = await fetch(`${API_URL}/ordenes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}` 
            },
            body: JSON.stringify(data)
        });        
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const obtenerOrdenes = async () => {
    try {
        const response = await fetch(`${API_URL}/ordenes`, {
            method: 'GET',
            headers:{
              'Authorization': `Bearer ${getToken()}` 
            }            
        });  
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const registrarReclamo = async (data) => {
    try {
      const response = await fetch(`${API_URL}/reclamos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el reclamo');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const obtenerUsuarios = async () => {
    const response = await fetch(`${API_URL}/api/usuarios`,{
      headers:{
        'Authorization': `Bearer ${getToken()}` 
      }
    } );    
    const data = await response.json();    
    return data; // Suponiendo que la respuesta es un array de usuarios
  };
  
  export const obtenerClientes = async () => {
    const response = await fetch(`${API_URL}/api/clientes`, {
      headers:{
        'Authorization': `Bearer ${getToken()}` 
      }
    });    
    const data = await response.json();    
    return data; // Suponiendo que la respuesta es un array de clientes
  };

  export const obtenerOrdenesTrabajo = async () => {
    const response = await fetch(`${API_URL}/api/ordenesTrabajo`,{
      headers:{
        'Authorization': `Bearer ${getToken()}` 
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener órdenes de trabajo');
    }
    return await response.json();
  };

  export const obtenerReclamos = async () => {
    const response = await fetch(`${API_URL}/api/reclamos`, {
      headers:{
        'Authorization': `Bearer ${getToken()}` 
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener reclamos');
    }
    return await response.json();
  };

  export const registrarCliente = async (data) => {
    try {
      const response = await fetch(`${API_URL}/cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el reclamo');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /*Presupuesto */
  export const obtenerProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/productos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const obtenerServicios = async () => {
    try {
      const response = await fetch(`${API_URL}/servicios`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const obtenerAccesorios = async () => {
    try {
      const response = await fetch(`${API_URL}/accesorios`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los accesorios');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const registrarPresupuesto = async (data) => {
    try {
      const response = await fetch(`${API_URL}/presupuestos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const obtenerPresupuestos = async () => {
    const token = getToken();  // Obtener el token del almacenamiento local o de donde lo tengas
  
    // Si no hay token, lanzamos un error
    if (!token) {
      throw new Error('Token no disponible');
    }
  
    try {
      const response = await fetch(`${API_URL}/presupuestos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Incluir el token en la cabecera
        }
      });
        
      if (!response.ok) {
        // Obtener el cuerpo de la respuesta en caso de error para mayor detalle
        const errorData = await response.json();
        throw new Error(`Error al obtener los presupuestos: ${errorData.error || 'Desconocido'}`);
      }
  
      const data = await response.json();
  
      // Verificación si la respuesta es un arreglo o vacío
      if (Array.isArray(data)) {
        return data;  // Si es un arreglo, retornamos los presupuestos
      } else {
        throw new Error('Datos recibidos no son un arreglo válido');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const obtenerPresupuestoId = async (id) => {
    try {
      const response = await fetch(`${API_URL}/presupuestos/${id}`, {  
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener el presupuesto');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const cambiarContra = async (id, nuevaContra) => {
    try {
      if (!id || !nuevaContra) {
        throw new Error("Todos los campos son obligatorios");
      }
      const response = await fetch(`${API_URL}/actualizar-contrasena`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nuevaContra }),
      });
      if (!response.ok) {
        // Si la respuesta no es exitosa (status != 2xx), lanzamos un error.
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la contraseña");
      }
  
      // Si la respuesta es exitosa, retornamos el mensaje de éxito o el objeto que el backend devuelve.
      return await response.json();
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      throw new Error(error.message || "Error desconocido");
    }
  };
  
  export const agregarProducto = async (producto) => {
    try {
      const response = await fetch(`${API_URL}/agregar_producto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(producto)
      });
     
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta de error:', errorText);
        throw new Error(errorText || 'Error al agregar el producto');
      }
      
      const data = await response.json();      
      return data;      
    } catch (error) {
      console.error('Error detallado:', error);
      throw error;
    }
  };

  export const agregarServicios = async(servicio) =>{
    try {
      const response = await fetch(`${API_URL}/agregar_servicios`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(servicio)
      })
      if(!response.ok){
        const error = await response.text();
        console.error("respuesta de error",error);
        throw new Error(error || "Error al agregar servicio")
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  export const generarOT = async (idPresupuesto, usuarioSeleccionado, importanciaSeleccionada) => {
    try {
      const respuesta = await fetch(`${API_URL}/agregar_ot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_presupuesto: idPresupuesto,
          id_usuario: usuarioSeleccionado, // Asegúrate de que este sea el id del usuario
          importancia: importanciaSeleccionada, }),
      });
      const data = await respuesta.json();      
      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al generar la OT');
      }
  
      alert(data.message); // Muestra mensaje de éxito o error
    } catch (error) {
      console.error('Error al generar OT:', error);
      throw error;
    }
  };

  // En tu archivo de servicios API
export const actualizarOrden = async (id, datos) => {
  const response = await fetch(`${API_URL}/actualizarOrden/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar la orden');
  }
  
  return await response.json();
};

export const obtenerReclamosPorCliente = async (usuario) => {
  try {
    const response = await fetch(`${API_URL}/reclamos/cliente/${usuario}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los reclamos del cliente');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarReclamo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/reclamos/${id}/borrar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    }); 
    if (!response.ok) {
      throw new Error('Error al eliminar el reclamo');
    }
  }catch (error) {
    console.error(error);
    throw error; 
  }
};

export const eliminarOrdenTrabajo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/${id}/borrar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });  
    if (!response.ok) {
      throw new Error('Error al eliminar la orden de trabajo');
    }
  }catch (error) {
    console.error(error);
    throw error;
  }
}

export const editarReclamo = async (id, datos) => {
  const res = await fetch(`${API_URL}/api/reclamos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al editar el reclamo");
  return await res.json();
};


export async function listarMateriales() {
  const res = await fetch(`${API_URL}/materiales`);
  if (!res.ok) throw new Error("Error obteniendo materiales");
  return res.json();
}

export const crearMaterial = async (data) => {
  const res = await fetch(`${API_URL}/materiales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear material');
  return await res.json();
};

export const ObtenerMaterialById = async (id) => {
  const res = await fetch(`${API_URL}/materiales/${id}`);
  if (!res.ok) throw new Error('Material no encontrado');
  return await res.json();
};



export const actualizarMaterial = async (id, data) => {
  const res = await fetch(`${API_URL}/materiales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar material');
  return await res.json();
};

export const eliminarMaterial = async (id) => {
  const res = await fetch(`${API_URL}/materiales/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar material');
  return await res.json();
};

// =================== MOVIMIENTOS ===================

export const registrarMovimiento = async (data) => {
  const res = await fetch(`${API_URL}/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al registrar movimiento');
  return await res.json();
};

export const ObtenerMovimientos = async (query = {}) => {
  const url = new URL(`${API_URL}/movimientos`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.append(key, value);
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener movimientos');
  return await res.json();
};

// =================== RESPONSABLES ===================

export const ObtenerResponsables = async () => {
  const res = await fetch(`${API_URL}/responsable`);
  if (!res.ok) throw new Error('Error al obtener responsables');
  return await res.json();
};

export const crearResponsable = async (data) => {
  const res = await fetch(`${API_URL}/responsable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear responsable');
  return await res.json();
};

// =================== ALERTAS ===================

export const ObtenerAlertasStock = async () => {
  const res = await fetch(`${API_URL}/alertas`);
  if (!res.ok) throw new Error('Error al obtener alertas');
  return await res.json();
};

// =================== DASHBOARD ===================

export const ObtenerDashboard = async () => {
  const res = await fetch(`${API_URL}/dashboard`);
  if (!res.ok) throw new Error('Error al obtener datos del dashboard');
  return await res.json();
};