const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  orders: [{
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    }],
    orderedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
  summary: { type: String },
  image: { type: String },
  availabilityDate: { type: Date },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [{
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true }
//   }],
//   totalAmount: { type: Number, required: true },
//   customerInfo: {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     zipCode: { type: String, required: true }
//   },
//   status: { type: String, default: 'pending' }
// }, { timestamps: true });

// const Order = mongoose.model('Order', orderSchema);

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'failed', message: 'Access token required' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'failed', message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: 'failed', message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ 
      username, 
      password: hashedPassword, 
      admin: false
    });
    
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username, admin: user.admin }, 'your-secret-key');
    
    res.json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: { id: user._id, username: user.username, admin: user.admin }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ status: 'failed', message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ status: 'failed', message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, admin: user.admin }, 'your-secret-key');
    
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, username: user.username, admin: user.admin }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.json({
      status: 'success',
      message: 'Products retrieved successfully',
      data: {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'failed', message: 'Product not found' });
    }
    
    res.json({
      status: 'success',
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ status: 'failed', message: 'Admin access required' });
    }
    
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ status: 'failed', message: 'Admin access required' });
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ status: 'failed', message: 'Product not found' });
    }
    
    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ status: 'failed', message: 'Admin access required' });
    }
    
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'failed', message: 'Product not found' });
    }
    
    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

// Review Routes
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({ createdAt: -1 });
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
    
    res.json({
      status: 'success',
      message: 'Reviews retrieved successfully',
      data: {
        reviews,
        averageRating,
        reviewCount: reviews.length
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.post('/api/products/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment, username } = req.body;
    
    const review = new Review({
      productId: req.params.id,
      username,
      rating,
      comment
    });
    
    await review.save();
    
    // Update product average rating
    const reviews = await Review.find({ productId: req.params.id });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(req.params.id, {
      averageRating,
      reviewCount: reviews.length
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

// Cart Routes
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!cart) {
      return res.json({
        status: 'success',
        message: 'Cart retrieved successfully',
        data: { items: [] }
      });
    }
    
    const items = cart.items.map(item => {
      if (item.productId) {
        const productData = {
          ...item.productId.toObject(),
          quantity: item.quantity
        };
        return productData;
      }
      return null;
    }).filter(item => item !== null);
    
    res.json({
      status: 'success',
      message: 'Cart retrieved successfully',
      data: { items }
    });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    await cart.populate('items.productId');
    
    res.json({
      status: 'success',
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.put('/api/cart/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ status: 'failed', message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      
      await cart.save();
      await cart.populate('items.productId');
    }

    const items = cart.items.map(item => {
      if (item.productId) {
        return {
          ...item.productId.toObject(),
          quantity: item.quantity
        };
      }
      return null;
    }).filter(item => item !== null);
    
    res.json({
      status: 'success',
      message: 'Cart updated successfully',
      data: { items }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.delete('/api/cart/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ status: 'failed', message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.productId');
    
    const items = cart.items.map(item => {
      if (item.productId) {
        return {
          ...item.productId.toObject(),
          quantity: item.quantity
        };
      }
      return null;
    }).filter(item => item !== null);
    
    res.json({
      status: 'success',
      message: 'Item removed from cart',
      data: { items }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

app.delete('/api/cart/clear', authenticateToken, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] },
      { new: true }
    );
    
    res.json({
      status: 'success',
      message: 'Cart cleared successfully',
      data: { items: [] }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

// Checkout Route
// app.post('/api/checkout', authenticateToken, async (req, res) => {
//   try {
//     const { customerInfo } = req.body;
    
//     const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ status: 'failed', message: 'Cart is empty' });
//     }
    
//     // Calculate total
//     let totalAmount = 0;
//     const orderItems = [];
    
//     for (const item of cart.items) {
//       const product = item.productId;
//       if (product.stock < item.quantity) {
//         return res.status(400).json({ 
//           status: 'failed', 
//           message: `Insufficient stock for ${product.name}` 
//         });
//       }
      
//       const itemTotal = product.price * item.quantity;
//       totalAmount += itemTotal;
      
//       orderItems.push({
//         productId: product._id,
//         quantity: item.quantity,
//         price: product.price
//       });
      
//       // Update product stock
//       await Product.findByIdAndUpdate(product._id, {
//         $inc: { stock: -item.quantity }
//       });
//     }
    
//     // Create order
//     const order = new Order({
//       userId: req.user.id,
//       items: orderItems,
//       totalAmount,
//       customerInfo
//     });
    
//     await order.save();
    
//     // Clear cart
//     await Cart.findOneAndUpdate(
//       { userId: req.user.id },
//       { items: [] }
//     );
    
//     res.json({
//       status: 'success',
//       message: 'Order placed successfully',
//       data: order
//     });
//   } catch (error) {
//     res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
//   }
// });

// app.post('/api/checkout', authenticateToken, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ status: 'failed', message: 'Cart is empty' });
//     }

//     // Prepare order items and check stock
//     const orderItems = [];
//     for (const item of cart.items) {
//       const product = item.productId;
//       if (product.stock < item.quantity) {
//         return res.status(400).json({ 
//           status: 'failed', 
//           message: `Insufficient stock for ${product.name}` 
//         });
//       }

//       orderItems.push({
//         productId: product._id,
//         quantity: item.quantity
//       });

//       // Update product stock
//       await Product.findByIdAndUpdate(product._id, {
//         $inc: { stock: -item.quantity }
//       });
//     }

//     const orderedAt = new Date();

//     // Add order to user's orders array
//     // await User.findByIdAndUpdate(req.user.id, {
//     //     $push: { orders: { items: orderItems, orderedAt } }
//     // });

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { $push: { orders: { items: orderItems, orderedAt } } },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ status: 'failed', message: 'User not found, order not saved' });
//     }

//     // Clear cart
//     await Cart.findOneAndUpdate(
//       { userId: req.user.id },
//       { items: [] }
//     );

//     res.json({
//       status: 'success',
//       message: 'Order placed successfully',
//       data: { items: orderItems, orderedAt: orderedAt }
//     });

//   } catch (error) {
//     res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
//   }
// });


app.post('/api/checkout', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      console.log('Checkout error: Cart is empty');
      return res.status(400).json({ status: 'failed', message: 'Cart is empty' });
    }

    // Prepare order items and check stock
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.productId;

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          status: 'failed', 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity
      });

      // Deduct stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    const orderedAt = new Date();

    // Add order to user's orders array
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found, order not saved' });
    }

    user.orders.push({ items: orderItems, orderedAt });
    await user.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      status: 'success',
      message: 'Order placed successfully',
      data: { items: orderItems, orderedAt }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});


//get all past orders
// Get all orders from all users (Admin only)
app.get('/api/all-user-orders', authenticateToken, async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ status: 'failed', message: 'Admin access required' });
    }

    const users = await User.find().populate('orders.items.productId');
    
    // Flatten the orders with user info
    const allOrders = users.flatMap(user =>
      user.orders.map(order => ({
        userId: user._id,
        username: user.username,
        items: order.items,
        orderedAt: order.orderedAt
      }))
    );

    res.json({
      status: 'success',
      message: 'All user orders retrieved successfully',
      data: allOrders
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});

// Get past orders for the logged-in user
app.get('/api/my-orders', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('orders.items.productId');

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    res.json({
      status: 'success',
      message: 'Past orders retrieved successfully',
      data: user.orders.map(order => ({
        items: order.items.map(i => ({
          product: i.productId,
          quantity: i.quantity
        })),
        orderedAt: order.orderedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});





// Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'failed', message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: { imageUrl }
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: 'Server error', error: error.message });
  }
});


// Create uploads directory if it doesn't exist
const fs = require('fs');
const { Console } = require('console');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});