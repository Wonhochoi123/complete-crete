const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customer');
const projectRoutes = require('./routes/project');
const path = require('path');
const connectDB = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/projects', projectRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// After successful login, send customer data back to the frontend
exports.loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Send customer data back to the client after successful login
        // res.status(200).json({
        //     message: 'Login successful',
        //     customerId: customer._id,
        //     firstName: customer.first_name,
        //     companyName: customer.company_name
        // });
    } catch (error) {
        console.error('Error logging in customer:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
