import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <NavLink 
          to="/" 
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
        <NavLink 
          to="/login" 
          className={({ isActive }) => isActive ? styles.active : undefined}
        >
          Login
        </NavLink>
        <NavLink 
          to="/admin" 
          className={({ isActive }) => isActive ? styles.active : undefined}
        >
          Admin Portal
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;