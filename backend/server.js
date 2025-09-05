const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Add product endpoint for admin
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description, image, category, stock } = req.body;
        
        if (!name || !price || !description) {
            return res.status(400).json({ status: "failed", message: "Name, price, and description are required" });
        }

        const newProduct = {
            id: await generateProductId(),
            name,
            price: parseFloat(price),
            description,
            image: image || '/images/product1.jpg', // Default image
            category: category || 'general',
            stock: parseInt(stock) || 0,
            createdAt: new Date()
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

        const { name, price, description, image, category, stock } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (price) updateData.price = parseFloat(price);
        if (description) updateData.description = description;
        if (image) updateData.image = image;
        if (category) updateData.category = category;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        updateData.updatedAt = new Date();

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

