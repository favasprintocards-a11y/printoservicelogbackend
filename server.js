const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const serviceLogRoutes = require('./routes/serviceLogRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

app.get('/', (req, res) => {
    res.send('Printo Service Log API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/service-logs', serviceLogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
