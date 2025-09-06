import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddProductPage.module.css';

function AddProductPage() {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        brand: '',
        price: '',
        category: 'Rods',
        stock: '',
        availabilityDate: '',
        summary: '',
        description: '',
        image: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const categories = ['Rods', 'Reels', 'Lines', 'Lures', 'Tackle'];

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        const previewUrl = URL.createObjectURL(selected);
        setPreview(previewUrl);
        // Set a default image path for now
        setProduct(prev => ({ ...prev, image: `/images/${selected.name}` }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/products', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(product)
            });

            console.log(JSON.stringify(product));
            
            const data = await res.json();
            
            if (res.ok) {
                alert("Product added successfully!");
                navigate('/admin');
            } else {
                alert(data.message || "Error adding product");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.editContainer}>
            <h1>Add New Product</h1>

            <form onSubmit={handleSubmit} className={styles.editForm}>
                <label className={styles.labelText}>
                    Image:
                    <br/>
                    <input type="file" accept="image/*" onChange={handleFileChange} required/>
                </label>
                {preview && <img src={preview} alt="Preview" width="100" />}

                <label className={styles.labelText}>
                    Title:
                    <br/>
                    <input 
                        type="text" 
                        value={product.name} 
                        onChange={e => setProduct({...product, name: e.target.value})} 
                        required
                    />
                </label>

                <label className={styles.labelText}>
                    Brand:
                    <br/>
                    <input 
                        type="text" 
                        value={product.brand} 
                        onChange={e => setProduct({...product, brand: e.target.value})}
                        required 
                    />
                </label>

                <label className={styles.labelText}>
                    Price:
                    <br/>
                    <input 
                        type="number" 
                        step="0.01"
                        value={product.price} 
                        onChange={e => setProduct({...product, price: e.target.value})} 
                        required
                    />
                </label>

                <label className={styles.labelText}>
                    Category:
                    <br/>
                    <select 
                        className={styles.category} 
                        value={product.category} 
                        onChange={e => setProduct({...product, category: e.target.value})}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </label>

                <label className={styles.labelText}>
                    Availability:
                    <br/>
                    <input 
                        type="number" 
                        value={product.stock} 
                        onChange={e => setProduct({...product, stock: e.target.value})} 
                        required
                    />
                </label>

                <label className={styles.labelText}>
                    Availability Date:
                    <br/>
                    <input 
                        type="date" 
                        value={product.availabilityDate} 
                        onChange={e => setProduct({...product, availabilityDate: e.target.value})}
                        required 
                    />
                </label>

                <label className={styles.labelText}>
                    Summary:
                    <br/>
                    <input 
                        type="text" 
                        value={product.summary} 
                        onChange={e => setProduct({...product, summary: e.target.value})} 
                        required
                    />
                </label>

                <label className={styles.labelText}>
                    Description:
                    <br/>
                    <textarea 
                        value={product.description} 
                        onChange={e => setProduct({...product, description: e.target.value})} 
                        rows="4" 
                        cols="50"
                        required
                    />
                </label>

                <input 
                    type="submit" 
                    value={isLoading ? "Adding..." : "Add Product"} 
                    className={styles.submitButton}
                    disabled={isLoading}
                />
            </form>
        </div>
    );
}

export default AddProductPage;