// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const viewsRoutes = require('./routes/views');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
