import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDb from './config/db.js';
import userRoute from './routes/user-route.js';
import eventRoute from './routes/event-route.js';

dotenv.config();



const app = express();

const corsOptions = {
    origin: '*', // Allow all origins
    credentials: true, // Allow credentials (cookies, headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow headers
};
  
  app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoute);
app.use('/api', eventRoute);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;

connectDb()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})