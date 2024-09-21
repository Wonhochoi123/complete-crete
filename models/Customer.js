const csvUtils = require('../utils/csvUtils');
const bcrypt = require('bcrypt');

// CSV file location for customer data
const customerFilePath = './data/customers.csv';
const customerHeaders = ['id', 'first_name', 'last_name', 'email', 'password', 'phone', 'company_name', 'company_address'];

// Register a new customer
exports.createCustomer = async (req, res) => {
    const { first_name, last_name, email, password, phone, company_name, company_address } = req.body;

    // Validate the data (same as before)

    try {
        // Read existing customers from CSV
        const customers = await csvUtils.readDataFromCSV(customerFilePath, customerHeaders);

        // Check if email already exists
        const existingCustomer = customers.find(c => c.email === email);
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new customer object
        const newCustomer = {
            id: Date.now().toString(),  // Unique ID for the customer
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            company_name,
            company_address,
        };

        // Write the new customer to the CSV
        await csvUtils.writeDataToCSV(customerFilePath, newCustomer, customerHeaders);

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
        // Read customers from CSV
        const customers = await csvUtils.readDataFromCSV(customerFilePath, customerHeaders);

        // Find customer by email
        const customer = customers.find(c => c.email === email);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Respond with success on login
        res.status(200).json({
            message: 'Login successful',
            customer: {
                id: customer.id,
                first_name: customer.first_name,
                last_name: customer.last_name,
                company_name: customer.company_name,
                email: customer.email,
                phone: customer.phone,
                company_address: customer.company_address,
            },
        });
    } catch (error) {
        console.error('Error logging in customer:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update customer details
exports.updateCustomer = async (req, res) => {
    const { id, first_name, last_name, email, phone, company_name, company_address, password } = req.body;

    try {
        // Read existing customers
        const customers = await csvUtils.readDataFromCSV(customerFilePath, customerHeaders);

        // Find the customer by ID
        const customerIndex = customers.findIndex(c => c.id === id);
        if (customerIndex === -1) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customer = customers[customerIndex];

        // Update fields
        const updatedCustomer = {
            ...customer,
            first_name: first_name || customer.first_name,
            last_name: last_name || customer.last_name,
            email: email || customer.email,
            phone: phone || customer.phone,
            company_name: company_name || customer.company_name,
            company_address: company_address || customer.company_address,
        };

        // If the user provided a new password, hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedCustomer.password = hashedPassword;
        }

        // Write the updated customer to the CSV
        await csvUtils.updateCSV(customerFilePath, updatedCustomer, id, customerHeaders);

        res.status(200).json({ message: 'Account updated successfully', customer: updatedCustomer });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
