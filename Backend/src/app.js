import express from 'express';
import cors from 'cors';
import connectDB from './Db/db.js'
import dotenv from 'dotenv';
dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

import agencyRoutes from './Routes/agencyRoutes.js';
import clientRoutes from './Routes/clientRoutes.js';


app.use('/api', agencyRoutes);
app.use('/api', clientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
