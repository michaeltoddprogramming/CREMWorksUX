import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AddProductPage.module.css';
import { Link } from 'react-router-dom';

function getUnique(arr, key) 
{
    return [...new Set(arr.map(item => item[key]))];
}


function AddProductPage() {
    // const { id } = useParams();
    const [product, setProduct] = useState({});
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [category, setCategory] = useState('All');
    
    const categories = ['Rods', 'Reels', 'Lines', 'Lures', 'Tackle'];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try
        {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(product)
            });
            console.log(JSON.stringify(product));
            
            if(res.ok)
            {
                alert("Product updated successfully!");
            }
            else
            {
                alert("Error updating product");
            }
        }
        catch (err)
        {
            console.error(err);
            alert("Error updating product");
        }

    };

    return (
        <div className={styles.editContainer}>

            <h1>Add New Product</h1>

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
                    <input type="text" value={product.name || ''} onChange={e => setProduct({...product, name: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Brand:
                    <br/>
                    <input type="text" value={product.brand || ''} onChange={e => setProduct({...product, brand: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Price:
                    <br/>
                    <input type="number" value={product.price || ''} onChange={e => setProduct({...product, price: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Category:
                    <br/>
                    <select className={styles.category} value={product.category} onChange={e => setProduct({...product, category: e.target.value})}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {/* <input type="dr" value={product.price || ''} onChange={e => setProduct({...product, price: e.target.value})} /> */}
                </label>

                <label className={styles.labelText}>
                    Availability:
                    <br/>
                    <input type="number" value={product.stock || ''} onChange={e => setProduct({...product, stock: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Availability Date:
                    <br/>
                    <input type="date" value={product.availabilityDate || ''} onChange={e => setProduct({...product, availabilityDate: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Summary:
                    <br/>
                    <input type="text" value={product.summary || ''} onChange={e => setProduct({...product, summary: e.target.value})} />
                </label>

                <label className={styles.labelText}>
                    Description:
                    <br/>
                    <textarea value={product.description || ''} onChange={e => setProduct({...product, description: e.target.value})} rows="4" cols="50">
                        {product.description || ''}
                    </textarea>
                    {/* <input type="text-area" value={product.summery || ''} onChange={e => setProduct({...product, summery: e.target.value})} /> */}
                </label>

                <input type="submit" value="Add Product" className={styles.submitButton}/>
            </form>
        </div>
    );
}

export default AddProductPage;