import { useEffect, useState } from 'react';
import styles from './Catalogue.module.css';
import { Link } from 'react-router-dom';

function getUnique(arr, key) {
    return [...new Set(arr.map(item => item[key]))];
}

function Catalogue() {
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

    const filtered = products
        .filter(p =>
            (category === 'All' || p.category === category) &&
            (search === '' ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.brand.toLowerCase().includes(search.toLowerCase())) &&
            (minPrice === '' || Number(p.price) >= Number(minPrice)) &&
            (maxPrice === '' || Number(p.price) <= Number(maxPrice)) &&
            (!inStock || p.stock > 0)
        )
        .sort((a, b) => {
            if (sort === 'price') return a.price - b.price;
            if (sort === 'stock') return b.stock - a.stock;
            return a.name.localeCompare(b.name);
        });

    return (
        <div className={styles.catalogueContainer}>
            {/* <div className={styles.searchContainer}>

            </div> */}
            <div className={styles.filters}>
                <input
                    className={styles.search}
                    type="text"
                    placeholder="Search by name or brand..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className={styles.category}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input
                    className={styles.filterPrice}
                    type="number"
                    min="0"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                />
                <input
                    className={styles.filterPrice}
                    type="number"
                    min="0"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                />
                {/*<label className={styles.stockLabel}>
          <input
            type="checkbox"
            checked={inStock}
            onChange={e => setInStock(e.target.checked)}
          />
          In Stock Only
        </label>*/}
                <select
                    className={styles.sort}
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                    <option value="stock">Sort by Stock</option>
                </select>
            </div>
            <ul className={styles.list}>
                {filtered.length === 0 && (
                    <li className={styles.noResults}>No products found.</li>
                )}
                {filtered.map(product => (
                    <li key={product._id} className={styles.listItem}>
                        <Link to={`/product/${product._id}`} className={styles.rowLink}>
                            <div className={styles.imageWrapper}>
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={styles.thumbnail}
                                    />
                                )}
                            </div>
                            <div className={styles.rowContent}>
                                <div>
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
                                    <span className={styles.detailsBtn}>
                                        View Details
                                    </span>
                                </aside>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Catalogue;