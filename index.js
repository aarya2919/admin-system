// load environment variables from .env
require('dotenv').config();

// import express framework
const express = require('express');

// create express app
const app = express();

// import database (just to initialize connection)
require('./config/db');

// middleware to parse JSON request body
app.use(express.json());

/* ==============================
   ROUTES
============================== */

// import admin routes
const adminRoutes = require('./routes/adminRoutes');

// mount admin routes with base path
app.use('/admin', adminRoutes);


/* ==============================
   TEST ROUTE (optional)
============================== */

// simple route to check server is working
app.get('/', (req, res) => {
  res.send("Server is running 🚀");
});


/* ==============================
   START SERVER
============================== */

// start server on given port
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});