import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditPage.module.css';

function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);
    
    const categories = ['Rods', 'Reels', 'Lines', 'Lures', 'Tackle'];

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                // Format the date properly for HTML date input
                if (data.availabilityDate) {
                    const date = new Date(data.availabilityDate);
                    data.availabilityDate = date.toISOString().split('T')[0];
                }
                
                setProduct(data);
                setPreview(data.image);
            })
            .catch(err => {
                console.error(err);
                setProduct({});
            })
            .finally(() => setIsLoadingProduct(false));
    }, [id]);

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
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(product)
            });
            
            const data = await res.json();
            
            if (res.ok) {
                // alert("Product updated successfully!");
                navigate('/admin');
            } else {
                alert(data.message || "Error updating product");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating product");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingProduct) {
        return <div className={styles.editContainer}><h1>Loading...</h1></div>;
    }

    return (
        <div className={styles.editContainer}>
            <h1>Edit Product</h1>

            <form onSubmit={handleSubmit} className={styles.editForm}>
                <label className={styles.labelText}>
                    Image:
                    <br/>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                {preview && <img src={preview} alt="Preview" width="100" />}

                <label className={styles.labelText}>
                    Title:
                    <br/>
                    <input 
                        type="text" 
                        value={product.name || ''} 
                        onChange={e => setProduct({...product, name: e.target.value})} 
                    />
                </label>

                <label className={styles.labelText}>
                    Brand:
                    <br/>
                    <input 
                        type="text" 
                        value={product.brand || ''} 
                        onChange={e => setProduct({...product, brand: e.target.value})} 
                    />
                </label>

                <label className={styles.labelText}>
                    Price:
                    <br/>
                    <input 
                        type="number" 
                        step="0.01"
                        value={product.price || ''} 
                        onChange={e => setProduct({...product, price: e.target.value})} 
                    />
                </label>

                <label className={styles.labelText}>
                    Category:
                    <br/>
                    <select 
                        className={styles.category} 
                        value={product.category || 'Rods'} 
                        onChange={e => setProduct({...product, category: e.target.value})}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </label>

                <label className={styles.labelText}>
                    Stock:
                    <br/>
                    <input 
                        type="number" 
                        value={product.stock || ''} 
                        onChange={e => setProduct({...product, stock: e.target.value})} 
                    />
                </label>

                <label className={styles.labelText}>
                    Availability Date:
                    <br/>
                    <input 
                        type="date" 
                        value={product.availabilityDate || ''} 
                        onChange={e => setProduct({...product, availabilityDate: e.target.value})} 
                    />
                </label>

                <label className={styles.labelText}>
                    Summary:
                    <br/>
                    <input 
                        type="text" 
                        value={product.summary || ''} 
                        onChange={e => setProduct({...product, summary: e.target.value})} 
                    />
                </label>

                <label className={styles.labelText}>
                    Description:
                    <br/>
                    <textarea 
                        value={product.description || ''} 
                        onChange={e => setProduct({...product, description: e.target.value})} 
                        rows="4" 
                        cols="50"
                    />
                </label>

                <input 
                    type="submit" 
                    value={isLoading ? "Updating..." : "Update Product"} 
                    className={styles.submitButton}
                    disabled={isLoading}
                />
            </form>
        </div>
    );
}

export default EditPage;