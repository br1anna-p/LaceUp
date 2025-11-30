import express from "express";
import db from "../database/connection.js";

const router = express.Router();

// FEATURED PRODUCTS (homepage)
router.get("/featured", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products LIMIT 6");
  res.json(rows);
});

// ALL PRODUCTS
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
});

// SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

  if (rows.length === 0) return res.status(404).json({ error: "Product not found" });

  res.json(rows[0]);
});

export default router;
