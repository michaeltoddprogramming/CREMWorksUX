import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductPage.module.css';
import Reviews from '../Reviews/Reviews';
import Loading from '../Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
  fetch(`/api/products`)
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error(err));
}, []);

function getRandomItems(array, n) {
  const copy = [...array];
  const result = [];
  const length = copy.length;
  n = Math.min(n, length);

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1); // remove picked item
  }
  return result;
}

  if (loading) return <Loading/>;
  if (!product || product.error) return <div className={styles.notFound}>Product not found.</div>;

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>

        <div className={styles.card}>

          <div className={styles.details}>
            {product.image && (
              <img src={product.image} alt={product.name} className={styles.image} />
            )}
            <div className={styles.productInfo}>
              <h1 className={styles.title}>{product.name}</h1>
              <h2 className={styles.brand}>{product.brand}</h2>
              <h3 className={styles.category}>{product.category}</h3>
              <p className={styles.summary}>{product.summary}</p>

            </div>
          </div>

          <div className={styles.priceInfo}>
            <h1 className={styles.price}>R {product.price}</h1>
            <h2 className={styles.stock}>
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
            </h2>
            <button className={styles.addToCart} disabled>Add to cart (coming soon)</button>
          </div>

          <div className={styles.descriptionParent}> 
            <h2 className={styles.descriptionTitle}>Product Description</h2>
            <div className={styles.description}>{product.description}</div>
          </div>

          {/* <div className={styles.recommended}>
            <h2 className={styles.descriptionTitle}>Popular products in this category</h2>
            <div className={styles.recommendedProductParent}>
              {products.filter(p => p._id !== product._id && p.category == product.category).slice(0, 4).map((p) => (
                <div className={styles.recommendedProduct} key={p._id} onClick={() => navigate(`/product/${p._id}`)}>
                  <img src={p.image} alt={p.name} title={p.name} className={styles.recommendedImg}/>
                  <h2 className={styles.recommendedTitle}>{p.name}</h2>
                  <h1 className={styles.recommendedPrice}>R {p.price}</h1>
                  <p className={styles.recommendedRating}><FontAwesomeIcon icon={faStar} /> {p.averageRating || 0} ({p.reviewCount || 0})</p>
                </div>
              ))}
            </div>

          </div> */}

          <div className={styles.recommended}>
            <h2>Recommended Products</h2>
            <div className={styles.recommendedProductParent}>
              {getRandomItems(
                products.filter(p => p._id !== product._id && p.category == product.category),
                4
              ).map((p) => (
                <div
                  className={styles.recommendedProduct}
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <img src={p.image} alt={p.name} title={p.name} className={styles.recommendedImg}/>
                  <h2 className={styles.recommendedTitle}>{p.name}</h2>
                  <h1 className={styles.recommendedPrice}>R {p.price}</h1>
                  <p className={styles.recommendedRating}>
                    <FontAwesomeIcon icon={faStar} /> {p.averageRating || 0} ({p.reviewCount || 0})
                  </p>
                </div>
              ))}
            </div>
          </div>


          <div className={styles.recommended}>
            <h2>Recommended Products</h2>
            <div className={styles.recommendedProductParent}>
              {getRandomItems(
                products.filter(p => p._id !== product._id && p.category != product.category),
                4
              ).map((p) => (
                <div
                  className={styles.recommendedProduct}
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <img src={p.image} alt={p.name} title={p.name} className={styles.recommendedImg}/>
                  <h2 className={styles.recommendedTitle}>{p.name}</h2>
                  <h1 className={styles.recommendedPrice}>R {p.price}</h1>
                  <p className={styles.recommendedRating}>
                    <FontAwesomeIcon icon={faStar} /> {p.averageRating || 0} ({p.reviewCount || 0})
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.reviews}>
            <Reviews productId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;