const express = require('express');
const app = express();
const { createServer } = require('http');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './public');

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

// // Start server
// app.listen(3000, () => {
//     console.log('Server is running on port http://localhost:3000');
// });

// Create the HTTP server for Vercel
module.exports = (req, res) => {
    const server = createServer(app);
    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
};
