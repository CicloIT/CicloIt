// src/components/Navbar/DropdownMenu.jsx
import { useRef } from "react";
import PropTypes from "prop-types";
import { HiChevronDown } from "react-icons/hi";
import { NavLink } from "./NavLink";

export const DropdownMenu = ({ isOpen, title, options, onToggle, id }) => {
  const dropdownRef = useRef(null);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        id={`dropdown-${id}`}
        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white rounded-md transition-all duration-200"
      >
        {title}
        <HiChevronDown 
          className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={`dropdown-${id}`}
        >
          <div className="py-1">
            {options.map(option => (
              <NavLink key={option.to} to={option.to}>
                {option.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};