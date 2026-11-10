const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
// ...el resto igual



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const productRoutes = require('./src/routes/productRoute');
const categoryRoutes = require('./src/routes/categoryRoute');
const userRoutes = require('./src/routes/userRoute');

const app = express();

connectDB();

app.use(cors());           // CORS obligatorio
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));