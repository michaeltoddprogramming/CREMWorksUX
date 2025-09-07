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
        image: '/images/product1.jpg' // Default image
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const categories = ['Rods', 'Reels', 'Lines', 'Lures', 'Tackle'];

    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        // Validate file type
        if (!selected.type.startsWith('image/')) {
            // alert('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (selected.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setFile(selected);
        setIsUploading(true);

        try {
            // Create preview
            const previewUrl = URL.createObjectURL(selected);
            setPreview(previewUrl);

            // Convert to base64
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const base64Data = event.target.result;
                    
                    // Upload to server
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            imageData: base64Data,
                            fileName: selected.name
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setProduct(prev => ({ ...prev, image: data.imageUrl }));
                        alert('Image uploaded successfully!');
                    } else {
                        alert('Error uploading image: ' + data.message);
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    alert('Error uploading image');
                } finally {
                    setIsUploading(false);
                }
            };
            reader.readAsDataURL(selected);
        } catch (error) {
            console.error('File processing error:', error);
            alert('Error processing file');
            setIsUploading(false);
        }
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
                // alert("Product added successfully!");
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
                    Upload Image:
                    <br/>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        disabled={isUploading}
                        required
                    />
                    {isUploading && <div style={{color: '#007bff', marginTop: '5px'}}>Uploading...</div>}
                </label>
                
                {preview && (
                    <div style={{margin: '10px 0'}}>
                        <strong>Preview:</strong><br/>
                        <img src={preview} alt="Preview" width="150" style={{border: '1px solid #ddd', borderRadius: '5px'}} />
                    </div>
                )}

                <label className={styles.labelText}>
                    Image Path:
                    <br/>
                    <input 
                        type="text" 
                        value={product.image} 
                        onChange={e => setProduct({...product, image: e.target.value})} 
                        placeholder="/images/product1.jpg"
                    />
                    <small style={{display: 'block', color: '#666', marginTop: '5px'}}>
                        Auto-filled when you upload an image, or enter manually
                    </small>
                </label>

                {product.image && (
                    <div style={{margin: '10px 0'}}>
                        <strong>Current Image:</strong><br/>
                        <img 
                            src={product.image} 
                            alt="Product" 
                            width="150" 
                            style={{border: '1px solid #ddd', borderRadius: '5px'}}
                            onError={(e) => {
                                e.target.style.border = '2px solid red';
                                e.target.alt = 'Image not found';
                            }}
                        />
                    </div>
                )}

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
                    Stock Quantity:
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
                    disabled={isLoading || isUploading}
                />
            </form>
        </div>
    );
}

export default AddProductPage;