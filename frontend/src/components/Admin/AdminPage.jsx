import { useEffect, useState } from 'react';
import styles from './AdminPortal.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function getUnique(arr, key) {
    return [...new Set(arr.map(item => item[key]))];
}



function AdminPage() {
    const navigate = useNavigate();
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


    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(setProducts)
            .catch(() => setProducts([]));
    }, []);



    const categories = ['All', ...getUnique(products, 'category')];
        const brands = [...getUnique(products, 'brand')];

        const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
        prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    };

    const toggleRating = (value) => {
  if (rating === value) {
    setRating(null); // uncheck if clicked again
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
            (rating === null || p.rating >= rating)
        )
        .sort((a, b) => {
            if (sort === 'priceL') return a.price - b.price;
            if (sort === 'priceH') return b.price - a.price;
            if (sort === 'stock') return b.stock - a.stock;
            return a.name.localeCompare(b.name);
        });

    const handleEdit = (id) => 
    {
        navigate(`/admin/editPage/${id}`);
    }

    const handleDelete = async (id) =>  
    {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;

        try 
        {
            const response = await fetch(`api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            });

            if (!response.ok) 
            {
                throw new Error("Failed to delete product");
            }

            alert("Product deleted successfully!");

            setProducts(products.filter(p => p._id !== id));
        } 
        catch (error) 
        {
            console.error(error);
            alert("Error deleting product");
        }    
    }

    return (
        <div className={styles.catalogueContainer}>
            <div className={styles.filters}>
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
                <select
                    className={styles.category}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {/* <input
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
                /> */}
                {/*<label className={styles.stockLabel}>
          <input
            type="checkbox"
            checked={inStock}
            onChange={e => setInStock(e.target.checked)}
          />
          In Stock Only
        </label>*/}
                <select
                    className={styles.category}
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="name">Name: Alphabetically</option>
                    <option value="priceL">Price: low to high</option>
                    <option value="priceH">Price: high to low</option>
                    <option value="stock">Stock: Qty</option>
                </select>
                <section >
                    <select  className={styles.sort}  value={rating || ''} onChange={e => toggleRating(e.target.value)}>
                        {/* <label> */}
                            <option  value="">Rating</option>
                            <option  value="1">1 Star</option>
                        {/* </label> */}
                        {/* <label> */}
                            <option  value="2">2 Star</option>
                        {/* </label> */}
                        {/* <label> */}
                            <option  value="3">3 Star</option>
                        {/* </label> */}
                        {/* <label> */}
                            <option  value="4">4 Star</option>
                        {/* </label> */}
                        {/* <label> */}
                            <option  value="5">5 Star</option>
                        {/* </label> */}

                    </select>
                </section>

                {/* <section> */}
                    {/* <label className={styles.priceRange}> */}
                        <select className={styles.sort} value={minPrice} onChange={e => setMinPrice(e.target.value)}>
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

                        
                    {/* </label> */}
                {/* </section> */}
                <select className={styles.sort} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
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
                <button className={styles.addButton} onClick={() => navigate('/admin/addProductPage')}>Add New Product</button>

            </div>

            {/* <button className={styles.addButton} onClick={() => navigate('/admin/addProductPage')}>Add New Product</button> */}


            {filtered.length === 0 && (<li className={styles.noResults}>No products found.</li>)}
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Availability</th>
                        <th>Availability Date</th>
                        <th>Summery</th>
                        <th>Description</th>
                        <th>Link</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((product) => (
                        <tr key={product._id} >
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product._id}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>
                                {/* <img src={product.image} alt={product.name} className={styles.productImage} /> */}
                                <img src={product.image} alt={product.name} className={styles.adminImg}/>
                            </td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product.name}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product.brand}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>R{product.price}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product.category}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product.stock}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product.AvailabilityDate}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product.summary}</td>
                            <td onClick={() => navigate(`/product/${product._id}`)}>{product.description}</td>
                            <td><a href={product.link} target="_blank">Link</a></td>
                            <td className={styles.actionButtons}>
                                <button onClick={() => handleEdit(product._id)} className={styles.adminButton}>Edit</button> <button onClick={() => handleDelete(product._id)} className={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>


            {/* <ul className={styles.list}>
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
                                <div className={styles.cardHeader}>
                                    <span className={styles.productName}>{product.name}</span>
                                    {product.stock > 0 ? (
                                        <span className={styles.stockBadge}>In Stock</span>
                                    ) : (
                                        <span className={styles.stockBadgeOut}>Out of Stock</span>
                                    )}
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.brand}>{product.brand}</span>
                                    <span className={styles.category}>{product.category}</span>
                                    <span className={styles.price}>R{product.price}</span>
                                    <span className={styles.stock}>Qty: {product.stock}</span>
                                </div>
                                <div className={styles.summary}>{product.summary}</div>
                                <span className={styles.detailsBtn}>
                                    View Details
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul> */}
        </div>
    );
}

export default AdminPage;