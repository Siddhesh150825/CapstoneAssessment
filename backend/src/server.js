const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const reservationRoutes = require('./routes/reservation');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

dotenv.config({ path: __dirname + "/.env" });
console.log("Loaded Mongo URI:", process.env.MONGO_URI);
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/menu', menuRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/reservations', reservationRoutes);
app.use('/api/admin/feedback', feedbackRoutes);
app.use('/api/admin/menu', menuRoutes);

app.use('/api/auth', authRoutes);

const buildPath = path.join(__dirname, '../../frontend/build');
app.use(express.static(buildPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));