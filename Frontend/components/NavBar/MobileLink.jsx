// src/components/Navbar/MobileLink.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const MobileLink = ({ to, children, onClick, isActive }) => (
  <Link 
    to={to}
    className={`block text-base font-medium px-4 py-3 rounded-md transition-colors duration-200
      ${isActive ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-blue-600"}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

MobileLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool
};