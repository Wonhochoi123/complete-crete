const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customer');
const projectRoutes = require('./routes/project');
const path = require('path');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/projects', projectRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
