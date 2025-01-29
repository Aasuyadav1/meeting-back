import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import userRoute from "./routes/user-route.js";
import eventRoute from "./routes/event-route.js";

dotenv.config();

const app = express();

const corsOptions = {
  // Replace with your actual frontend URL
  origin: [
    "https://meeting-front-2vf9.vercel.app",
    "https://meeting-front-hduvsdaf.vercel.app",
    "https://meeting-front-nboa.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware for pa`rsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRoute);
app.use("/api", eventRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

const PORT = process.env.PORT || 3899;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
