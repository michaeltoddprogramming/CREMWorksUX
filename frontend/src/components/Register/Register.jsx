import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, isAdmin }),
      });
      const data = await res.json();
      if (res.ok) {
        if(isAdmin)
        {
          localStorage.setItem("isAdmin", "true");
        }
        else
        {
          localStorage.setItem("isAdmin", "false");
        }
        localStorage.setItem("loggedIn", "true");
        if (window.updateHeader) window.updateHeader();
        navigate("/catalogue");
        setMsg(data.message);
      } else {
        setMsg(data.message);
        localStorage.setItem("loggedIn", "false");
      }
    } catch {
      setMsg('Network error');
      localStorage.setItem("loggedIn", "false");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.registerTitle}>Register</h2>
        <div>
          <label className={styles.registerLabel}>
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
          <label className={styles.registerLabel}>
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
        <div>
          <label className={`${styles.registerLabel} ${styles.adminLabel}`}>
            Admin user
            <input type="checkbox" checked={isAdmin} onChange={e => setAdmin(e.target.checked)} className={styles.adminCheck}></input>
            {/* <input type="checkbox" id="yes" name="yes" value="yes"></input> */}
            {/* <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={styles.loginInput}
            /> */}
          </label>
        </div>
        <button type="submit" className={styles.button}>Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        {msg && <p style={{color: "red"}}>{msg}</p>}
      </form>
    </div>
  );
}

export default Register;