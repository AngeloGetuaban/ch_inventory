const express = require('express');
const session = require('express-session'); // Import express-session
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // To load environment variables from .env file
const app = express();

// Middleware to parse form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies (application/json)
app.use(express.json());

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize session
app.use(session({
    secret: 'your-secret-key',  // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // Set secure to true if using HTTPS
}));

// Middleware to pass Supabase client and session data to all routes
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// Import inventory routes
const inventoryRoutes = require('./routes/inventory');
app.use('/', inventoryRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
