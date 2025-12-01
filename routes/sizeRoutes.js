import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// GET SIZES FOR PRODUCT
router.get("/:product_id", async (req, res) => {
  const { product_id } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM product_sizes WHERE product_id = ?",
    [product_id]
  );

  res.json(rows);
});

export default router;
