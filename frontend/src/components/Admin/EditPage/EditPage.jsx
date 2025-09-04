import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Catalogue.module.css';
import { Link } from 'react-router-dom';

function getUnique(arr, key) 
{
    return [...new Set(arr.map(item => item[key]))];
}




function EditPage() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [category, setCategory] = useState('All');
    
    const categories = ['All', 'Rods', 'Reels', 'Lines', 'Lures', 'Tackle'];

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setPreview(data.image);
            })
            .catch(() => setProduct({}));
    }, [id]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

     const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setProduct(prev => ({ ...prev, image: data.url }));
            setPreview(data.url);
            alert("Image uploaded!");
        } catch (err) {
            console.error(err);
            alert("Error uploading image");
        }
    };

    return (
        <div className={styles.catalogueContainer}>

            <h1>Edit Product</h1>

            <form>
                <label className={styles.labelText}>
                    Image:
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                {preview && <img src={preview} alt="Preview" width="100" />}

                <label className={styles.labelText}>
                    Title:
                    <input type="text" value={product.name || ''} onChange={e => setProduct({...product, name: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Brand:
                    <input type="text" value={product.brand || ''} onChange={e => setProduct({...product, brand: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Price:
                    <input type="number" value={product.price || ''} onChange={e => setProduct({...product, price: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Category:
                    <select className={styles.category} value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input type="dr" value={product.price || ''} onChange={e => setProduct({...product, price: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Availability:
                    <input type="number" value={product.stock || ''} onChange={e => setProduct({...product, stock: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Availability Date:
                    <input type="date" value={product.availabilityDate || ''} onChange={e => setProduct({...product, availabilityDate: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Summery:
                    <input type="text" value={product.summery || ''} onChange={e => setProduct({...product, summery: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Description:
                    <textarea value={product.summery || ''} onChange={e => setProduct({...product, summery: e.target.value})} rows="4" cols="50">
                        {product.description || ''}
                    </textarea>
                    {/* <input type="text-area" value={product.summery || ''} onChange={e => setProduct({...product, summery: e.target.value})} /> */}
                </label>

                <input type="submit" value="Submit"/>
            </form>

            {/* <table>
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
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>
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
                                <button>Edit</button> &nbsp; | &nbsp; <button>Delete</button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table> */}


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

export default EditPage;