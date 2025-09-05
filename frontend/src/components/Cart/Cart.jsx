import { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import { Link } from 'react-router-dom';

function getUnique(arr, key) {
  return [...new Set(arr.map(item => item[key]))];
}

function Cart() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const categories = ['All', ...getUnique(products, 'category')];

  return (
    <div className={styles.catalogueContainer}>
        <h1>Your Cart</h1>

      <div className={styles.list}>
        {products.length === 0 && (
          <li className={styles.noResults}>No products found.</li>
        )}

        <div className={styles.checkoutSection}>
            <h2>Cart Summary</h2>

            <p>Total Items: {products.length}</p>
            <p>Total Price: R{products.reduce((total, product) => total + product.price, 0)}</p>
            <button className={styles.checkoutButton}>Proceed to Checkout</button>
        </div>

        <div className={styles.cartItems}>           
            <h2>Cart Items</h2>

            {products.map(product => (
                <div className={styles.cartItem} key={product.id}>
                    <img src={product.image} alt={product.name} className={styles.thumbnail}/>

                    <h3>{product.name}</h3>
                    <p>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>

                    <p>R{product.price}</p>
                    
                    <label>
                        Quantity
                        <select>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="8">9</option>
                            <option value="10+">10+</option>
                        </select>
                    </label>

                    <p>Remove from cart</p>
                </div>
            ))}            
        </div>        
      </div>
    </div>
  );
}

export default Cart;