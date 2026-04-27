require('dotenv').config();

const express = require('express');
const app = express();

const pool = require('./db');

// Middleware to read JSON body
app.use(express.json());

/* -----------------------------
   DB CHECK ROUTE (TEST ONLY)
------------------------------*/
app.get('/check-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database()');
    res.json({
      message: "Database connected successfully",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   ADMIN ROUTES
------------------------------*/
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

/* -----------------------------
   START SERVER
------------------------------*/
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});