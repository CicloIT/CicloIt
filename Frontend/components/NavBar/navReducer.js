// src/components/Navbar/navReducer.js
export const initialNavState = {
    isMobileMenuOpen: false,
    dropdowns: {
      register: false,
      view: false,
      add:false,
      mobileRegister: false,
      mobileView: false,
      mobileAdd:false
    }
  };
  
  export function navReducer(state, action) {
    switch (action.type) {
      case 'TOGGLE_MOBILE_MENU':
        return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
      case 'TOGGLE_DROPDOWN':
        return {
          ...state,
          dropdowns: {
            ...Object.keys(state.dropdowns).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [action.payload]: !state.dropdowns[action.payload]
          }
        };
      case 'CLOSE_ALL_DROPDOWNS':
        return {
          ...state,
          dropdowns: Object.keys(state.dropdowns).reduce((acc, key) => ({ ...acc, [key]: false }), {})
        };
      case 'CLOSE_ALL':
        return initialNavState;
      default:
        return state;
    }
  }