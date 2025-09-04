import { useEffect, useState } from 'react';
import styles from './Catalogue.module.css';
import { Link, useNavigate } from 'react-router-dom';

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


            {filtered.length === 0 && (<li className={styles.noResults}>No products found.</li>)}
            <table>
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
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>
                                {/* <img src={product.image} alt={product.name} className={styles.productImage} /> */}
                                <img src={product.image} alt={product.name} width="50" />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>R{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.stock}</td>
                            <td>{product.AvailabilityDate}</td>
                            <td>{product.summary}</td>
                            <td>{product.description}</td>
                            <td><a href={product.link} target="_blank">Link</a></td>
                            <td>
                                <button onClick={() => handleEdit(product._id)}>Edit</button> &nbsp; | &nbsp; <button onClick={() => handleDelete(product._id)}>Delete</button>
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