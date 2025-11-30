import express from "express";
import db from "../database/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { F_name, L_name, email, password } = req.body;

  if (!F_name || !L_name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (F_name, L_name, email, password_hash) VALUES (?, ?, ?, ?)",
      [F_name, L_name, email, hashed]
    );

    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Email already in use or DB error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

  res.json({ message: "Logged in", token });
});

export default router;
