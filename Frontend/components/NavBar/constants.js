export const MENU_OPTIONS = {
    register: [
      { to: "/registro", label: "Registrar usuario" },
      { to: "/registrar-cliente", label: "Registrar cliente" },
      { to: "/registrar-orden", label: "Registrar orden" },
      { to: "/registrar-reclamo", label: "Registrar reclamos" },
      {to: "crear-presupuesto", label: "Crear presupuesto"}
    ],
    view: [
      { to: "/usuarios", label: "Usuarios" },
      { to: "/orden-trabajo", label: "Ordenes de trabajo" },
      { to: "/reclamos", label: "Reclamos" }
    ],
    techView: [
      { to: "/orden-trabajo", label: "Ordenes de trabajo" },
      { to: "/reclamos", label: "Reclamos" }
    ]
  };