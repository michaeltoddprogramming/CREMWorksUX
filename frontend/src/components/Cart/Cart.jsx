import { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading'
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AfterBuy from './AfterBuy/AfterBuy';

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
  const userId = getId();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [orderCompleted, setOrderCompleted] = useState(false); 

  function getId()
  {
    return localStorage.getItem("userId");
  }

  useEffect(() => {
    setLoading(true);
    fetch(`api/cart/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {setProducts([]); setLoading(false)});
  }, []);

const handleCheckout = async () => {
  if (products.length === 0) return; // prevent empty cart checkout

  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  try {
    // Delete all items from the cart in the database
    await Promise.all(products.map(product =>
      fetch(`/api/cart/${userId}/${product._id}`, { method: 'DELETE' })
    ));

    // Clear local cart
    setProducts([]);

    // Show AfterBuy screen
    setOrderCompleted({ status: true, orderNumber, total });
  } catch (err) {
    console.error("Checkout failed:", err);
    alert("Checkout failed. Please try again.");
  }
};




const handleQuantityChange = async (productId, newQuantity) => {
  // Update local state immediately for responsiveness
  setProducts(prev =>
    prev.map(p => p._id === productId ? { ...p, quantity: newQuantity } : p)
  );

  try {
    // Send update to backend
    await fetch(`/api/cart/${userId}/${productId}`, {
      method: "PATCH", // or PUT depending on your backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });
  } catch (err) {
    console.error("Failed to update quantity:", err);
  }
};

const handleRemove = async (productId) => {
  try {
    await fetch(`/api/cart/${userId}/${productId}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p._id !== productId));
  } catch (err) {
    console.error(err);
  }
};

if (orderCompleted.status) {
    return (
      <AfterBuy
        orderNumber={orderCompleted.orderNumber}
        total={orderCompleted.total}
        onBackToShop={() => navigate('/home')}
      />
    );
  }

  // const categories = ['All', ...getUnique(products, 'category')];

  return (
    <div className={styles.catalogueContainer}>
      <h1 className={styles.cartTitle}>Your Cart</h1>

      <div className={styles.list1}>
        

        <div className={styles.checkoutSection}>
            <h2 className={styles.cartSummery}>Cart Summary</h2>

            {/* <p>Total Items: {products.length}</p> */}
            <div className={styles.priceParent}>
              <p className={styles.totalPrice}>Total: R{products.reduce((total, product) => total + product.price * product.quantity, 0)}</p>
              {/* <small>({products.length} items)</small> */}
              <small>({products.reduce((total, p) => total + p.quantity, 0)} items)</small>

            </div>
            <button className={styles.checkoutButton} 
              onClick={handleCheckout}
              disabled={products.length === 0}>{products.length === 0 ? "Cart is empty" : "Proceed to Checkout"}</button>
        </div>

        <div className={styles.cartItems}>           
            <h2 className={styles.itemsTitle}>Cart Items</h2>

            {/* {products.map(product => (
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
                            <option value="10">10</option>
                        </select>
                    </label>

                    <p>Remove from cart</p>
                </div>
            ))} */}

            {/* {products.length === 0 && (
          <li className={styles.noResults}>No products found.</li>
        )} */}


            {loading ? (<Loading/>) : 
                <ul className={styles.list}>
                    {products.length === 0 && (
                        <li className={styles.noResults}>No products found.</li>
                    )}
                    {products.map(product => (
                        <li key={product._id} className={styles.listItem}>
                            {/* <Link to={`/product/${product._id}`} className={styles.rowLink}> */}
                            <div className={styles.rowLink}>
                                <div className={styles.imageWrapper} onClick={() => navigate(`/product/${product._id}`)}>
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={styles.thumbnail}
                                        />
                                    )}
                                </div>
                                <div className={styles.rowContent} >
                                    <div onClick={() => navigate(`/product/${product._id}`)}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.productName}>{product.name}</span>
                                        </div>

                                        <div className={styles.info}>
                                            <span className={styles.brand}>{product.brand}</span>
                                            <span className={styles.category}>{product.category}</span>
                                            {product.stock > 0 ? (
                                                // <span className={styles.stockBadge}>In Stock Qty: {product.stock}</span>
                                                <span className={styles.stockBadge}>In Stock</span>
                                            ) : (
                                                <span className={styles.stockBadgeOut}>Out of Stock</span>
                                            )}
                                            {/* <span className={styles.stock}>Qty: {product.stock}</span> */}
                                        </div>

                                        <div className={styles.summary}>{product.summary}</div>

                                    </div>       


                                    <aside className={styles.paymentDetails}>
                                        <span className={styles.price}>R{product.price}</span>
                                        <label className={styles.categoryLabel}>
                                          Qty:
                                            <select
                                            className={styles.category}
                                            value={product.quantity}
                                            onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                          >
                                            {[...Array(10).keys()].map(i => (
                                              <option key={i+1} value={i+1}>{i+1}</option>
                                            ))}
                                          </select>
                                        </label>                             
                                        <span className={styles.detailsBtn} onClick={() => handleRemove(product._id)}>
                                          <FontAwesomeIcon icon={faTrash} /> Remove
                                        </span>
                                    </aside>
                                </div>
                              </div>
                            {/* </Link> */}
                        </li>
                    ))}
                </ul>
            }          
        </div>        
      </div>
    </div>
  );
}

export default Cart;