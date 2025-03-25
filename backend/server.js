import connectDB from './config/db-connection.js';
import app from './app.js';

// Set up port
const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB()
  // If connection to database is successful, start server
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  // If connection to database fails, log error and exit process
  .catch((error) => {
    console.error('Failed to connect to database:', error);

    // Exit process with failure
    process.exit(1);
  });