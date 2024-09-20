const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');

// Helper functions for validation
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}

function isValidPhone(phone) {
    const phonePattern = /^\+?\d{10,15}$/;
    return phonePattern.test(phone);
}

// Register a new customer
exports.createCustomer = async (req, res) => {
    const { first_name, last_name, email, password, phone, company_name, company_address } = req.body;

    // Validate the data
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!isValidPhone(phone)) {
        return res.status(400).json({ message: 'Invalid phone number' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        // Check if email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new customer object
        const newCustomer = new Customer({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            company_name,
            company_address,
        });

        // Save the new customer to the database
        await newCustomer.save();

        // Respond with success
        res.status(201).json({ message: 'Customer created successfully' });
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login a customer
exports.loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find customer by email
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Send response
        res.status(200).json({
            message: 'Login successful',
            customer: {
                _id: customer._id,
                first_name: customer.first_name,
                last_name: customer.last_name,
                company_name: customer.company_name,
                email: customer.email,
                password: customer.password,
                company_address: customer.company_address,
                phone: customer.phone

            }
        });
    } catch (error) {
        console.error('Error logging in customer:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update customer details
exports.updateCustomer = async (req, res) => {
    const { customerId, first_name, last_name, email, phone, company_name, company_address, password } = req.body;

    try {
        // Build updateData object only with the fields that are not empty
        const updateData = {};
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (company_name) updateData.company_name = company_name;
        if (company_address) updateData.company_address = company_address;

        // Hash the password if it's provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Find the customer by ID and update the fields
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Respond with the updated customer data
        res.status(200).json({ message: 'Account updated successfully', customer: updatedCustomer });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



