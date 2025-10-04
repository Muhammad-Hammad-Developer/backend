import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

// ✅ Trust proxy (important for cookies behind Nginx/HTTPS)
app.set("trust proxy", 1);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS Setup
app.use(
  cors({
    origin: [
      "https://nexzenow.com",                // main frontend
      "https://admin-rose-delta.vercel.app", // admin panel
      "http://localhost:5173",               // local dev frontend
      "http://localhost:5174", 
      "https://nexznow.vercel.app"  ,            // another local dev
      /\.loca\.lt$/,                         // allow localtunnel subdomains
      /\.ngrok-free\.app$/                   // allow ngrok subdomains
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Start Server
const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

start();

