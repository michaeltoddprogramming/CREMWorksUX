# Tackle & Tide Emporium

A full-stack e-commerce application for fishing gear and equipment.

## Setup Instructions

### 1. Install Backend Dependencies

```bash
# Install Node.js dependencies using the backend package.json
npm install express mongoose cors bcryptjs jsonwebtoken multer dotenv nodemon
```

### 2. Environment Setup

The `.env` file is already configured with your MongoDB connection:
```
PORT=3000
MONGO_URI=mongodb+srv://Ruan:CREMWorks@cluster.zt2s2xh.mongodb.net/Database
DB_USER=Ruan
DB_PASSWORD=CREMWorks
```

### 3. Seed the Database

Run the seed script to populate your MongoDB with sample data:

```bash
node seed.cjs
```

This will create:
- Admin user: `username=admin, password=admin123`
- Test user: `username=testuser, password=user123`
- 8 sample products across different categories

### 4. Start the Backend Server

```bash
node server.cjs
```

The backend will run on `http://localhost:3000`

### 5. Start the Frontend (Already Running)

The frontend is already running on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Reviews
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add review (authenticated)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Checkout
- `POST /api/checkout` - Place order

### Upload
- `POST /api/upload` - Upload image

## Features

✅ **User Authentication & Authorization**
- JWT-based authentication
- Admin and regular user roles
- Protected routes

✅ **Product Management**
- CRUD operations for products
- Image upload support
- Category and search filtering
- Stock management

✅ **Shopping Cart**
- Add/remove/update items
- Persistent cart storage
- Real-time quantity management

✅ **Reviews & Ratings**
- User reviews and ratings
- Average rating calculation
- Review management

✅ **Order Processing**
- Complete checkout flow
- Inventory management
- Order tracking

✅ **Admin Panel**
- Product management interface
- Order monitoring
- User management

## Test Accounts

### Admin Account
- **Username:** admin
- **Password:** admin123
- **Permissions:** Full access to admin panel, product management

### Regular User Account
- **Username:** testuser
- **Password:** user123
- **Permissions:** Shopping, reviews, cart management

## Folder Structure

```
tackle-tide-emporium-main/
├── src/                    # Frontend React source
├── server.cjs              # Express.js backend server
├── seed.cjs                # Database seeding script
├── .env                   # Environment variables
├── package.json           # Frontend dependencies
├── package-backend.json   # Backend dependencies reference
└── uploads/               # Uploaded images directory
```

## Next Steps

1. **Start both servers** (frontend already running, start backend)
2. **Test the application** with the provided test accounts
3. **Add more products** through the admin panel
4. **Customize styling** and branding as needed
5. **Deploy to production** when ready

## Technologies Used

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- Context API

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

## Support

The application is now fully functional with complete e-commerce capabilities. All frontend components are integrated with the backend API for a seamless user experience.