export const MENU_OPTIONS = {
    register: [
      { to: "/registro", label: "Registrar usuario" },
      { to: "/registrar-cliente", label: "Registrar cliente" },
      { to: "/registrar-orden", label: "Registrar orden" },
      { to: "/registrar-reclamo", label: "Registrar reclamos" },     
    ],
    view: [
      { to: "/usuarios", label: "Usuarios" },
      { to: "/orden-trabajo", label: "Ordenes de trabajo" },
      { to: "/reclamos", label: "Reclamos" },
      { to: "/ver-presupuesto", label: "Presupuesto" },      
    ],
    add:[
      {to: "/crear-presupuesto", label: "Crear presupuesto"},
      {to: "/agregar-producto", label: "Crear producto"},
      {to: "/agregar-servicio", label: "Crear servicio"}
    ],
    techView: [
      { to: "/orden-trabajo", label: "Ordenes de trabajo" },
      { to: "/reclamos", label: "Reclamos" }
    ]
  };