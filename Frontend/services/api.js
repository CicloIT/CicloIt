const API_URL = 'https://ciclo-it.vercel.app';

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
  