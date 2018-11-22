// Dependencies
const htmlRoutes = require('./app/routes/htmlRoutes');
const apiRoutes = require('./app/routes/apiRoutes');
const express = require('express');
const path = require('path');

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '/app/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routing
app.use(htmlRoutes);
app.use(apiRoutes);
app.get('*', (req, res) => res.redirect('/'));

// Listen
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}...`));