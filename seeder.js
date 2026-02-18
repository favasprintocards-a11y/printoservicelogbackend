const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.js');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'Admin',
        });

        const engineerUser = new User({
            name: 'Engineer User',
            email: 'engineer@example.com',
            password: 'password123',
            role: 'Engineer',
        });

        await adminUser.save();
        await engineerUser.save();

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
