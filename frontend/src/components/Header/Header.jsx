import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Landing</Link> |{' '}
        <Link to="/about">About Us</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}

export default Header;