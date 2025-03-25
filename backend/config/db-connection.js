import { connect } from 'mongoose'; // Import the connect function from mongoose
import dotenv from 'dotenv'; // Import dotenv to load environment variables from a .env file

dotenv.config(); // Load environment variables from .env file

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Use the new URL parser
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });
    console.log('MongoDB connected successfully'); // Log success message
  } catch (error) {
    console.error('MongoDB connection error:', error); // Log error message
    process.exit(1); // Exit process with failure
  }
};

export default connectDB; // Export the connectDB function as the default export