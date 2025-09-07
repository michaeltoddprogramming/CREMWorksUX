import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

function Header() {

const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true"); 

  window.updateHeader = () => {
    setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  };

  function logOut()
  {
    localStorage.setItem("loggedIn", "false");
    localStorage.setItem("isAdmin", "false");
    updateHeader();
  }

  // function checkAdmin()
  // {
  //   if(localStorage.getItem("isAdmin") === "true")
  //   {
  //     return true;
  //   }
  //   else 
  //   {
  //     return false;
  //   }
  // }
  // function checkLogin()
  // {
  //   if(localStorage.getItem("loggedIn") === "true")
  //   {
  //     return true;
  //   }
  //   else 
  //   {
  //     return false;
  //   }
  // }

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <NavLink 
          to="/home" 
          className={({ isActive }) => isActive ? styles.active : undefined}
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => isActive ? styles.active : undefined}
        >
          About Us
        </NavLink>
        <NavLink 
          to="/catalogue" 
          className={({ isActive }) => isActive ? styles.active : undefined}
        >
          Gear
        </NavLink>

        {!isLoggedIn && (
          <NavLink 
            to="/login" 
            className={({ isActive }) => isActive ? styles.active : undefined}
          >
            Login
          </NavLink>
        )}
        
        {isAdmin && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => isActive ? styles.active : undefined}
          >
            Admin Portal
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? styles.active : undefined}
            onClick={logOut}
          >
            Log out
          </NavLink>
        )}
        
          {/* <NavLink 
            to="/cart" 
            className={({ isActive }) => isActive ? styles.active : undefined}
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </NavLink> */}
      </nav>
    </header>
  );
}

export default Header;