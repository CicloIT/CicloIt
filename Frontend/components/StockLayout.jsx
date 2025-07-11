// components/StockLayout.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import PropTypes from "prop-types";
import MaterialesApp from "./MaterialesApp";
import MovimientosApp from "./MovimientoApp";
import ResponsablesApp from "./Responsables";
import NavbarStock from "./NavbarStock";

export default function StockLayout({ rol }) {
  if (rol !== "admin") return <Navigate to="/" replace />;

  return (
    <>
        
      <NavbarStock />
      <Routes>
        <Route path="/" element={<MaterialesApp />} />
        <Route path="/materiales" element={<MaterialesApp />} />
        <Route path="/movimientos" element={<MovimientosApp />} />
        <Route path="/responsables" element={<ResponsablesApp />} />
        <Route path="*" element={<Navigate to="/materiales" />} />
      </Routes>
    </>
  );
}

StockLayout.propTypes = {
  rol: PropTypes.string,
};
