import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductPage.module.css';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!product || product.error) return <div className={styles.notFound}>Product not found.</div>;

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
        <div className={styles.card}>
          {product.image && (
            <img src={product.image} alt={product.name} className={styles.image} />
          )}
          <div className={styles.details}>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.brand}>Brand: {product.brand}</div>
            <div className={styles.category}>Category: {product.category}</div>
            <div className={styles.price}>Price: R{product.price}</div>
            <div className={styles.stock}>
              {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
            </div>
            <div className={styles.summary}>{product.summary}</div>
            <div className={styles.description}>{product.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;