import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/login">Login</Link>
        <Link to="/catalogue">Catalogue</Link>
      </nav>
    </header>
  );
}

export default Header;