import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// CREATE ORDER
router.post("/", async (req, res) => {
  const { user_id, subtotal, discount, tax, total } = req.body;

  const [result] = await db.query(
    "INSERT INTO orders (user_id, subtotal, discount, tax, total) VALUES (?, ?, ?, ?, ?)",
    [user_id, subtotal, discount, tax, total]
  );

  res.json({ order_id: result.insertId });
});

// GET ORDERS FOR USER
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const [rows] = await db.query("SELECT * FROM orders WHERE user_id = ?", [
    user_id,
  ]);

  res.json(rows);
});

export default router;
