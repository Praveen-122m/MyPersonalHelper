const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const helperRoutes = require('./routes/helperRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // <--- REMOVED THIS IMPORT

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/helpers', helperRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes); // <--- REMOVED THIS USE

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));