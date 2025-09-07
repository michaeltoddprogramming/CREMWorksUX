import { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data.admin);
        if(data.admin === true)
        {
          localStorage.setItem("isAdmin", "true");
        }
        else
        {
          localStorage.setItem("isAdmin", "false");
        }
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", `${data.username}`);
        if (window.updateHeader) window.updateHeader();
        navigate("/catalogue");
        setMsg(data.message);
      } else {
        localStorage.setItem("loggedIn", "false");
        setMsg(data.message);
      }
    } catch {
      localStorage.setItem("loggedIn", "false");
      setMsg('Network error');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.loginTitle}>Login</h2>
        <div>
          <label className={styles.loginLabel}>
            Username
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className={styles.loginInput}
              />
          </label>
        </div>
        <div>
          <label className={styles.loginLabel}>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={styles.loginInput}
            />
          </label>
        </div>
        <button type="submit" className={styles.button}>Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        {msg && <p style={{color: 'red'}}>{msg}</p>}
      </form>
    </div>
  );
}

export default Login;