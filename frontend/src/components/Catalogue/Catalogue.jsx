import { useEffect, useState } from 'react';
import styles from './Catalogue.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading/Loading';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [rating, setRating] = useState(null);
    const [isCollapsedP, setCollapsedP] = useState(true);
    const [isCollapsedD, setCollapsedD] = useState(true);
    const [isCollapsedB, setCollapsedB] = useState(true);
    const [isCollapsedR, setCollapsedR] = useState(true);
    const [loading, setLoading] = useState(true);
    const [brandSearch, setBrandSearch] = useState('');

    useEffect(() => {
        setLoading(true);
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => {setProducts([]); setLoading(false)});
    }, []);

    

    const categories = ['All', ...getUnique(products, 'category')];
    const brands = [...getUnique(products, 'brand')];

    const filteredBrands = brands.filter(brand =>
        brand.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
        prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    };

    const clearBrands = () => {
        setSelectedBrands([]);
        setBrandSearch(''); // also clear the search
    };

    const clearAllFilters = () => {
        setSearch('');
        setSort('name');
        setCategory('All');
        setMinPrice('');
        setMaxPrice('');
        setInStock(false);
        setSelectedBrands([]);
        setRating(null);
    }

    const toggleRating = (value) => 
    {
        if (rating === value) {
            setRating(null);
        } else {
            setRating(value);
        }
    };

    const filtered = products
        .filter(p =>
            (category === 'All' || p.category === category) &&
            (search === '' ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.brand.toLowerCase().includes(search.toLowerCase())) &&
            (minPrice === '' || Number(p.price) >= Number(minPrice)) &&
            (maxPrice === '' || Number(p.price) <= Number(maxPrice)) &&
            (!inStock || p.stock > 0) && (!selectedBrands.length || selectedBrands.includes(p.brand)) &&
            (rating === null || p.averageRating >= rating)
        )
        .sort((a, b) => {
            if (sort === 'priceL') return a.price - b.price;
            if (sort === 'priceH') return b.price - a.price;
            if (sort === 'stock') return b.stock - a.stock;
            return a.name.localeCompare(b.name);
        });

    return (
        <div className={styles.catalogueContainer}>
            <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                    <input
                        className={styles.search}
                        type="text"
                        placeholder="Search by name or brand..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                </div>
            </div>


            <div className={styles.filterSort}>
                <div className={styles.sortParent}>
                    <div className={styles.sortTop}>
                        <p>Sort</p>
                        <button onClick={clearAllFilters} className={styles.clearAllBtn}>Clear all Filters</button>
                    </div>
                    <select
                        className={styles.sort}
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        <option value="name">Name: Alphabetically</option>
                        <option value="priceL">Price: low to high</option>
                        <option value="priceH">Price: high to low</option>
                        <option value="stock">Stock: Qty</option>
                    </select>
                </div>

                <div className={styles.filters}>

                    <div className={`${styles.priceFilter} ${styles.filterParent}`}  >
                        <div onClick={() => setCollapsedP(!isCollapsedP)}className={styles.top}>
                            <p >Price</p>
                            {isCollapsedP && <FontAwesomeIcon icon={faMinus}className={styles.filterIcon}onClick={() => setCollapsedP(!isCollapsedP)} />}
                            {!isCollapsedP && <FontAwesomeIcon icon={faPlus}className={styles.filterIcon}onClick={() => setCollapsedP(!isCollapsedP)} />}

                        </div>

                        {isCollapsedP && (
                            <section>
                                {/* <label className={styles.priceRange}>
                                        <select className={`${styles.minPrice} ${styles.hover1}`} value={minPrice} onChange={e => setMinPrice(e.target.value)}>
                                            <option value="">Min Price</option>
                                            <option value="0">R0</option>
                                            <option value="100">R100</option>
                                            <option value="200">R200</option>
                                            <option value="500">R500</option>
                                            <option value="800">R800</option>
                                            <option value="1000">R1000</option>
                                            <option value="1500">R1500</option>
                                            <option value="2000">R2000</option>
                                            <option value="5000">R5000</option>
                                        </select>

                                        <select className={`${styles.minPrice} ${styles.hover2}`} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
                                            <option value="">Max Price</option>
                                            <option value="0">R0</option>
                                            <option value="100">R100</option>
                                            <option value="200">R200</option>
                                            <option value="500">R500</option>
                                            <option value="800">R800</option>
                                            <option value="1000">R1000</option>
                                            <option value="1500">R1500</option>
                                            <option value="2000">R2000</option>
                                            <option value="5000">R5000</option>
                                        </select>


                                </label> */}
                                <div className={styles.priceRange}>
                                    <label className={styles.priceRangeLabel}>
                                        <select className={`${styles.minPrice} ${styles.hover}`} value={minPrice} onChange={e => setMinPrice(e.target.value)}>
                                            <option value="">Min Price</option>
                                            <option value="0">R0</option>
                                            <option value="100">R100</option>
                                            <option value="200">R200</option>
                                            <option value="500">R500</option>
                                            <option value="800">R800</option>
                                            <option value="1000">R1000</option>
                                            <option value="1500">R1500</option>
                                            <option value="2000">R2000</option>
                                            <option value="5000">R5000</option>
                                        </select>

                                    </label>

                                    <label className={styles.priceRangeLabel}>
                                        <select className={`${styles.minPrice} ${styles.hover}`} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
                                            <option value="">Max Price</option>
                                            <option value="0">R0</option>
                                            <option value="100">R100</option>
                                            <option value="200">R200</option>
                                            <option value="500">R500</option>
                                            <option value="800">R800</option>
                                            <option value="1000">R1000</option>
                                            <option value="1500">R1500</option>
                                            <option value="2000">R2000</option>
                                            <option value="5000">R5000</option>
                                        </select>

                                    </label>

                                </div>
                            </section>
                        )}
                    </div>

                    <div className={`${styles.categoryFilter} ${styles.filterParent}`} >
                        <div onClick={() => setCollapsedD(!isCollapsedD)}className={styles.top}>
                            <p >Department</p>
                            {isCollapsedD && <FontAwesomeIcon icon={faMinus}className={styles.filterIcon}  onClick={() => setCollapsedD(!isCollapsedD)}/>}
                            {!isCollapsedD && <FontAwesomeIcon icon={faPlus}className={styles.filterIcon}  onClick={() => setCollapsedD(!isCollapsedD)}/>}

                        </div>

                        {isCollapsedD && (
                            <section>
                                <label className={styles.categoryLabel}>
                                    <select
                                        className={styles.category}
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </label>
                            </section>
                        )}
                    </div>

                    <div className={`${styles.filterParent}`} >
                        <div onClick={() => setCollapsedB(!isCollapsedB)}className={styles.top}>
                            <p >Brands</p>
                            {isCollapsedB && <FontAwesomeIcon icon={faMinus}className={styles.filterIcon}  onClick={() => setCollapsedB(!isCollapsedB)}/>}
                            {!isCollapsedB && <FontAwesomeIcon icon={faPlus}className={styles.filterIcon}onClick={() => setCollapsedB(!isCollapsedB)}  />}

                        </div>

                        {/* {isCollapsedB && (
                            <section className={styles.brandFilter}>
                                <section>
                                    {brands.map((brand, index) => (
                                        <label key={index}>
                                            <input type="checkbox" value={brand} checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)}/>
                                        {brand}
                                        </label>
                                    ))}
                                </section>
                            </section>
                        )} */}

                        {isCollapsedB && (
                            <section >
                                <section className={styles.brandSearchContainer}>
                                    <input
                                    type="text"
                                    placeholder="Search brands..."
                                    value={brandSearch}
                                    onChange={e => setBrandSearch(e.target.value)}
                                    className={styles.brandSearch}
                                    />

                                    <button onClick={clearBrands} className={styles.brandsClear}>Clear</button>
                                </section>
                                <section className={styles.brandFilter}>
                                    {filteredBrands.map((brand, index) => (
                                    <label key={index}>
                                        <input
                                        type="checkbox"
                                        value={brand}
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => toggleBrand(brand)}
                                        />
                                        {brand}
                                    </label>
                                    ))}

                                </section>
                            </section>
                        )}
                    </div>

                    <div className={`${styles.ratingFilter} ${styles.filterParent}`} >
                        <div onClick={() => setCollapsedR(!isCollapsedR)} className={styles.top}>
                            <p >Rating</p>
                            {isCollapsedR && <FontAwesomeIcon icon={faMinus}className={styles.filterIcon} onClick={() => setCollapsedR(!isCollapsedR)} />}
                            {!isCollapsedR && <FontAwesomeIcon icon={faPlus}className={styles.filterIcon} onClick={() => setCollapsedR(!isCollapsedR)} />}

                        </div>
                        
                        {isCollapsedR && (
                            <section>
                                <label>
                                    <input type="radio" value="1" checked={rating===1} onChange={() => toggleRating(1)}/>1 <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} /> and up
                                </label>
                                <label>
                                    <input type="radio" value="2" checked={rating===2} onChange={() => toggleRating(2)}/>2 <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} /> and up
                                </label>
                                <label>
                                    <input type="radio" value="3" checked={rating===3} onChange={() => toggleRating(3)}/>3 <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} /> and up
                                </label>
                                <label>
                                    <input type="radio" value="4" checked={rating===4} onChange={() => toggleRating(4)}/>4 <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} /> and up
                                </label>
                                <label>
                                    <input type="radio" value="5" checked={rating===5} onChange={() => toggleRating(5)}/>5 <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} /> and up
                                </label>
                            </section>
                        )}
                    </div>
                </div>                
            </div>

            {loading ? (<Loading/>) : 
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
            }
        </div>
    );
}

export default Catalogue;