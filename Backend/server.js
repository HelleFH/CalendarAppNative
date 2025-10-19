// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import entryRoutes from './Routes/routes.js';

dotenv.config();

const app = express();
const port = 5000;

 app.use(express.json())
// Middleware
const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.error('MongoDB connection error:', err));

// Use entry routes
app.use('/entries', entryRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
export default app; 