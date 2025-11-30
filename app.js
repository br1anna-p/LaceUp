import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Database connection
import db from "./database/connection.js";

// Route files
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sizeRoutes from "./routes/sizeRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemRoutes from "./routes/orderItemRoutes.js";

const app = express();

// Needed to fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 fallback (IMPORTANT: do NOT use `/*`)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
