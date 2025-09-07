import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CartInsert.module.css'; // create this CSS file

function CartInsert({ message = "Item added to cart!", show, onClose }) {
    const navigate = useNavigate();
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); // hide notification after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={styles.notification} onClick={() => navigate(`/cart`)}>
      {message}
    </div>
  );
}

export default CartInsert;
