const bcrypt = require('bcrypt');
const csvUtils = require('../utils/csvUtils');
const path = require('path');
const fs = require('fs');

// CSV folder for customer data
const customerFolderPath = './data/customers/';

// Helper functions for validation
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}

function isValidPhone(phone) {
    const phonePattern = /^\+?\d{10,15}$/;
    return phonePattern.test(phone);
}

// Helper function to check for commas
function hasComma(value) {
    return typeof value === 'string' && value.includes(',');
}

// Register a new customer
exports.createCustomer = async (req, res) => {
    const { first_name, last_name, email, password, phone, company_name, company_address } = req.body;

    try {
        // Validate for commas
        if ([first_name, last_name, phone, company_name, company_address].some(hasComma)) {
            return res.status(400).json({ message: 'Fields cannot contain commas.' });
        }

        // Check if customer already exists
        const customerFilePath = path.join(customerFolderPath, `${email}.csv`);
        if (fs.existsSync(customerFilePath)) {
            return res.status(400).json({ message: 'Customer with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the customer data
        const customerData = {
            id: Date.now().toString(),
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            company_name,
            company_address
        };

        // Write the data to a new CSV file for this customer
        csvUtils.writeDataToCustomerFile(email, customerData);

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
        // Read customer data from CSV file
        const customerData = await csvUtils.readLastLineFromCustomerFile(email);

        if (!customerData) {
            return res.status(400).json({ message: 'Email is not registered' });
        }

        // Split the CSV line into its respective fields
        const [id, first_name, last_name, customerEmail, hashedPassword, phone, company_name, company_address] = customerData.split(',');

        // Check password
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Send response on successful login
        res.status(200).json({
            message: 'Login successful',
            customer: {
                _id: id,
                first_name,
                last_name,
                company_name,
                email: customerEmail,
                phone,
                company_address
            }
        });
    } catch (error) {
        console.error('Error logging in customer:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update customer information
exports.updateCustomer = async (req, res) => {
    const { id, first_name, last_name, email: old_email, new_email, password, phone, company_name, company_address } = req.body;

    try {
        // Validate for commas
        if ([first_name, last_name, phone, company_name, company_address].some(hasComma)) {
            return res.status(400).json({ message: 'Fields cannot contain commas.' });
        }

        // Determine file paths
        const oldCustomerFilePath = path.join(customerFolderPath, `${old_email}.csv`);
        const newCustomerFilePath = path.join(customerFolderPath, `${new_email || old_email}.csv`);

        // Read current customer data from old CSV
        const customerData = await csvUtils.readLastLineFromCustomerFile(old_email);

        if (!customerData) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customer = customerData.split(',');

        // Prepare updated customer object
        const updatedCustomer = {
            id: customer[0],
            first_name: first_name || customer[1],
            last_name: last_name || customer[2],
            email: new_email || customer[3],  // Use new email if provided
            password: customer[4],  // Default to existing password
            phone: phone || customer[5],
            company_name: company_name || customer[6],
            company_address: company_address || customer[7],
        };

        // Hash the new password if provided
        if (password) {
            updatedCustomer.password = await bcrypt.hash(password, 10);
        }

        // Write updated customer data to new or existing CSV file
        await csvUtils.writeDataToCustomerFile(updatedCustomer.email, updatedCustomer);

        // If email changed, delete old CSV file
        if (new_email && new_email !== old_email) {
            fs.unlinkSync(oldCustomerFilePath);  // Remove old file
        }

        res.status(200).json({
            message: 'Account updated successfully',
            customer: updatedCustomer
        });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
