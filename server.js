const express = require('express');
const app = express();

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('public', './public');

// Serve static files from 'public'
app.use(express.static('public'));

// Import admin routes
const inventoryRoutes = require('./routes/inventory');

// Set up routes
app.use('/', inventoryRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});

