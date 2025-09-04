const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// const express = require('express');
// const app = express();
// const PORT = 3000;


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Connect to MongoDB
async function connectDatabase() 
{
    try 
    {
        await client.connect();
        // db = client.db("CREM Works");
        db = client.db("Database");
        console.log("Connected to MongoDB");
    }
    catch (err) 
    {
        console.error("Failed to connect to MongoDB", err);
    }
}
connectDatabase();

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

        // const hashedPassword = await bcrypt.hash(password, 10);

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

        // const match = await bcrypt.compare(password, user.password);
        
        if(password !== user.password)
        {
            return res.status(401).json({status: "failed", message: "Password incorrect" });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);

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

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`BACKEND RUNNING http://localhost:${PORT}`);
});

