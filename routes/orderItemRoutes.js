import express from "express";
import db from "../database/connection.js";

const router = express.Router();

// ADD ITEMS TO ORDER
router.post("/", async (req, res) => {
  const { order_id, product_id, size_id, quantity, unit_price } = req.body;

  const [result] = await db.query(
    "INSERT INTO order_items (order_id, product_id, size_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)",
    [order_id, product_id, size_id, quantity, unit_price]
  );

  res.json({ item_id: result.insertId });
});

// GET ITEMS FOR ORDER
router.get("/:order_id", async (req, res) => {
  const { order_id } = req.params;

  const [rows] = await db.query(
    `
    SELECT order_items.*, products.name, products.image_url 
    FROM order_items 
    JOIN products ON products.id = order_items.product_id
    WHERE order_id = ?
  `,
    [order_id]
  );

  res.json(rows);
});

export default router;
