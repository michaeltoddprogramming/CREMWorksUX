const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Connect to MongoDB
async function connectDatabase() 
{
    try 
    {
        await client.connect();
        db = client.db("Database");
        console.log("Connected to MongoDB");
    }
    catch (err) 
    {
        console.error("Failed to connect to MongoDB", err);
        console.error("Make sure MONGO_URI is correct in .env file");
        process.exit(1);
    }
}

// ==============================
// ====  Helper functions =======
// ==============================

async function generateUserId() 
{
    const users = await db.collection("users").find({}).toArray();
    if (users.length === 0)
    {
        return 1;
    }
    
    const maxId = Math.max(...users.map(u => u.id || 0));
    return maxId + 1;
}

async function generateProductId() 
{
    const products = await db.collection("products").find({}).toArray();
    if (products.length === 0)
    {
        return 1;
    }
    
    const maxId = Math.max(...products.map(p => p.id || 0));
    return maxId + 1;
}

// ==============================
// ======   Endpoints  ==========
// ==============================

app.post('/api/register', async (req, res) => {
    const { username, password, isAdmin } = req.body;

    try 
    {
        const existing = await db.collection("users").findOne({ username });

        if (existing) 
        {
            return res.status(400).json({status: "failed", message: "Username already in use" });
        }

        const newUser = {
            id: await generateUserId(),
            username,
            password: password,
            admin: isAdmin
        };

        await db.collection("users").insertOne(newUser);

        res.status(201).json({status: "success", message: "User registered successfully" });
    }
    catch (err) 
    {
        res.status(500).json({status: "failed", message: "Error registering user", error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try 
    {
        if(!username || !password)
        {
            return res.status(400).json({ status: "failed", message: "Username and password are required" });
        }

        const user = await db.collection("users").findOne({ username });

        if (!user) 
        {
            return res.status(400).json({status: "failed", message: "Username incorrect" });
        }
        
        if(password !== user.password)
        {
            return res.status(401).json({status: "failed", message: "Password incorrect" });
        }

        res.status(200).json({status: "success", message: "Login successful", admin: user.admin });
    }
    catch (err) 
    {
        res.status(500).json({status: "failed", message: "Error with Login", error: err.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await db.collection("products").find({}).toArray();
        res.json(products);
    } catch (err) {
        res.status(500).json({ status: "failed", message: "Error fetching products", error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const product = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Error fetching product", details: err.message });
    }
});

// Add product POST /api/products endpoint
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description, image, category, stock, brand, summary, availabilityDate } = req.body;
        
        if (!name || !price || !description ||!brand) {
            return res.status(400).json({ status: "failed", message: "Name, price, brand and description are required" });
        }

        const newProduct = {
            id: await generateProductId(),
            name,
            brand,
            category: category || 'general',
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            summary,
            description,
            image: image || '/images/product1.jpg',
            category: category || 'general',
            stock: parseInt(stock) || 0,
            brand: brand || '',
            summary: summary || '',
            availabilityDate: availabilityDate || null,
            reviews: [],
            averageRating: 0, 
            reviewCount: 0
        };

        await db.collection("products").insertOne(newProduct);
        res.status(201).json({ status: "success", message: "Product added successfully", product: newProduct });
    } catch (err) {
        res.status(500).json({ status: "failed", message: "Error adding product", error: err.message });
    }
});

// Update product endpoint for admin
app.put('/api/products/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const { name, price, description, image, category, stock, brand, summary, availabilityDate } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (brand) updateData.brand = (brand);
        if (category) updateData.category = category;
        if (price) updateData.price = parseFloat(price);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (summary) updateData.summary = summary;
        if (description) updateData.description = description;
        if (image) updateData.image = image;
        if (category) updateData.category = category;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (brand !== undefined) updateData.brand = brand;
        if (summary !== undefined) updateData.summary = summary;
        if (availabilityDate !== undefined) updateData.availabilityDate = availabilityDate; 

        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ status: "success", message: "Product updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error updating product", details: err.message });
    }
});

// Delete product endpoint for admin
app.delete('/api/products/:id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const result = await db.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ status: "success", message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting product", details: err.message });
    }
});

// Checkout endpoint
app.post('/api/checkout', async (req, res) => {
    try {
        const { items, customerInfo, totalAmount } = req.body;
        
        if (!items || !customerInfo || !totalAmount) {
            return res.status(400).json({ status: "failed", message: "Missing required checkout information" });
        }

        // Create order object
        const order = {
            id: new Date().getTime(), // Simple order ID generation
            items,
            customerInfo,
            totalAmount: parseFloat(totalAmount),
            status: 'pending',
            createdAt: new Date()
        };

        // Save order to database
        await db.collection("orders").insertOne(order);

        // Update product stock (optional)
        for (const item of items) {
            if (ObjectId.isValid(item.productId)) {
                await db.collection("products").updateOne(
                    { _id: new ObjectId(item.productId) },
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        res.status(201).json({ 
            status: "success", 
            message: "Order placed successfully", 
            orderId: order.id 
        });
    } catch (err) {
        res.status(500).json({ status: "failed", message: "Error processing checkout", error: err.message });
    }
});

// Add review endpoint
app.post('/api/products/:id/reviews', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const { username, rating, comment } = req.body;
        
        if (!username || !rating || !comment) {
            return res.status(400).json({ 
                status: "failed", 
                message: "Username, rating, and comment are required" 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                status: "failed", 
                message: "Rating must be between 1 and 5" 
            });
        }

        const newReview = {
            id: new Date().getTime(), // Simple review ID
            username,
            rating: parseInt(rating),
            comment,
            createdAt: new Date()
        };

        // Add review to product's reviews array
        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $push: { reviews: newReview },
                $inc: { reviewCount: 1 }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update average rating
        const product = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });
        if (product && product.reviews) {
            const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / product.reviews.length;
            
            await db.collection("products").updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: { averageRating: parseFloat(averageRating.toFixed(1)) } }
            );
        }

        res.status(201).json({ 
            status: "success", 
            message: "Review added successfully", 
            review: newReview 
        });
    } catch (err) {
        res.status(500).json({ 
            status: "failed", 
            message: "Error adding review", 
            error: err.message 
        });
    }
});

// Get reviews for a product
app.get('/api/products/:id/reviews', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const product = await db.collection("products").findOne(
            { _id: new ObjectId(req.params.id) },
            { projection: { reviews: 1, averageRating: 1, reviewCount: 1 } }
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            reviews: product.reviews || [],
            averageRating: product.averageRating || 0,
            reviewCount: product.reviewCount || 0
        });
    } catch (err) {
        res.status(500).json({ 
            error: "Error fetching reviews", 
            details: err.message 
        });
    }
});

// Add this endpoint for image upload
app.post('/api/upload', async (req, res) => {
    try {
        const { imageData, fileName } = req.body;
        
        if (!imageData || !fileName) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Image data and filename are required' 
            });
        }

        // Remove the data URL prefix (data:image/jpeg;base64,)
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        
        // Create images directory if it doesn't exist
        const imagesDir = path.join(__dirname, '../frontend/public/images');
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = path.extname(fileName) || '.jpg';
        const uniqueFileName = `product-${timestamp}${fileExtension}`;
        const filePath = path.join(imagesDir, uniqueFileName);

        // Write the file
        fs.writeFileSync(filePath, base64Data, 'base64');

        const imageUrl = `/images/${uniqueFileName}`;
        
        res.json({
            status: 'success',
            imageUrl: imageUrl,
            message: 'Image uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error uploading image',
            error: error.message
        });
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start server only after database connection
async function startServer() {
    await connectDatabase();
    
    app.listen(PORT, () => {
        console.log(`BACKEND RUNNING http://localhost:${PORT}`);
    });
}

startServer();

