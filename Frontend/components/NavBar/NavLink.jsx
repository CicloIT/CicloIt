// src/components/Navbar/NavLink.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white rounded-md transition-all duration-200"
  >
    {children}
  </Link>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};