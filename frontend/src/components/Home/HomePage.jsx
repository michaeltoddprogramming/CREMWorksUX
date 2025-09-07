import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import Loading from '../Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function getRandomItems(array, n) {
    const copy = [...array];
    const result = [];
    const length = copy.length;
    n = Math.min(n, length);

    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * copy.length);
      result.push(copy[randomIndex]);
      copy.splice(randomIndex, 1);
    }
    return result;
  }

  if (loading) return <Loading />;
  if (!products || products.error) return <div className={styles.notFound}>Products not found.</div>;

  const randomProducts = getRandomItems(products, 4);

  return (
    <div className={styles.homeBackground}>
      {/* <div>
        <div className={styles.mainContainer}>
              <div className={styles.leftContent}>
                <div className={styles.title}>
                  <span>CREMFish</span>
                  <span>CREMFish</span>
                </div>
              </div>
            </div>

      </div> */}
      <div className={styles.homeBanner}>
        <div className={styles.leftContent}>
          <div className={styles.bannerTitle}>
            <span>CREMFish</span>
            <span>CREMFish</span>
          </div>
          <p className={styles.bannerSubtitle}>
            Your ultimate destination for all fishing needs.
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.btn} onClick={() => navigate('/catalogue')}>
              <a>All Products</a>
            </button>
          </div>
        </div>
      </div>


      <div className={styles.recommended}>
        <h1 className={styles.mainTitle}>Featured Products</h1>
        <h2 className={styles.title}>Rods</h2>
        <div className={styles.recommendedProductParent}>
          {getRandomItems(products.filter(p => p.category === "Rods"), 4).map((p) => (
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
        <h2 className={styles.title}>Reels</h2>
        <div className={styles.recommendedProductParent}>
          {getRandomItems(products.filter(p => p.category === "Reels"), 4).map((p) => (
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
        <h2 className={styles.title}>Line</h2>
        <div className={styles.recommendedProductParent}>
          {getRandomItems(products.filter(p => p.category === "Line"), 4).map((p) => (
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
        <h2 className={styles.title}>Lures</h2>
        <div className={styles.recommendedProductParent}>
          {getRandomItems(products.filter(p => p.category === "Lures"), 4).map((p) => (
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
        <h2 className={styles.title}>Tackle</h2>
        <div className={styles.recommendedProductParent}>
          {getRandomItems(products.filter(p => p.category === "Tackle"), 4).map((p) => (
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
    </div>
  );
}

export default HomePage;
