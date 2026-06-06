require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const mongoose = require("mongoose"); // Added for health check

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'ExpenseIQ API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
try {
  const authRoutes = require("./routes/authRoutes");
  const incomeRoutes = require("./routes/incomeRoutes");
  const expenseRoutes=require("./routes/expenseRoutes");
  const dashboardRoutes=require("./routes/dashboardRoutes");

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/income", incomeRoutes);
  app.use("/api/v1/expense", expenseRoutes);
  app.use("/api/v1/dashboard", dashboardRoutes);

  console.log("Auth routes sucess");
} catch (error) {
  console.error("Error:", error.message);
}

// Add a health check that shows database status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Check if it's a database connection error
  if (err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({ 
      success: false,
      message: 'Database connection failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Database error'
    });
  }
  
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
});