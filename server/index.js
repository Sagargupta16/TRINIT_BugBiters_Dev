// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const { authenticateUser } = require('./middleware/authMiddleware.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.DB_CONNECTION_STRING;

mongoose
	.connect(uri)
	.then(() => console.log('Database connected!'))
	.catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

// Middleware to hide version information
app.disable('x-powered-by');

// Use the authRoutes only once
app.use('/auth', authRoutes);

// Use the userRoutes only once
app.use('/users', userRoutes);

app.get('/token-check', authenticateUser, (req, res) => {
	try {
		res.status(200).json({ isAuthenticated: true });
	} catch (error) {
		res.status(401).json({ isAuthenticated: false });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
