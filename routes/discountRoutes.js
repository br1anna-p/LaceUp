import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// VALIDATE DISCOUNT CODE
router.post("/apply", async (req, res) => {
  const { code } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM discounts WHERE code = ? AND active = TRUE",
    [code]
  );

  if (rows.length === 0)
    return res.status(400).json({ error: "Invalid or inactive code" });

  res.json(rows[0]);
});

export default router;
