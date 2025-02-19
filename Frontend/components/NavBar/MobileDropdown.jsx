// src/components/Navbar/MobileDropdown.jsx
import PropTypes from "prop-types";
import { HiChevronDown } from "react-icons/hi";
import { MobileLink } from "./MobileLink";

export const MobileDropdown = ({ isOpen, title, options, onToggle, activeRoute, closeMenu }) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-base font-medium text-gray-200 hover:bg-blue-600 px-4 py-3 rounded-md transition-colors duration-200"
      aria-expanded={isOpen}
    >
      {title}
      <HiChevronDown 
        className={`ml-1 h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        aria-hidden="true"
      />
    </button>
    {isOpen && (
      <div className="pl-4 mt-2 space-y-2">
        {options.map(option => (
          <MobileLink 
            key={option.to} 
            to={option.to} 
            onClick={closeMenu}
            isActive={activeRoute === option.to}
          >
            {option.label}
          </MobileLink>
        ))}
      </div>
    )}
  </div>
);

MobileDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  activeRoute: PropTypes.string.isRequired,
  closeMenu: PropTypes.func.isRequired
};