const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const reservationRoutes = require('./routes/reservation');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth'); // if you have auth routes

dotenv.config({ path: __dirname + "/.env" });
console.log("Loaded Mongo URI:", process.env.MONGO_URI);
connectDB();

// ✅ Create the app instance
const app = express();

// Middleware
app.use(express.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));