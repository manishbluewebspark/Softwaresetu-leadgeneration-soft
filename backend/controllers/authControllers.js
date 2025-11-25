import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../config/db.js";
dotenv.config();
import {decryptPassword} from '../controllers/employeeController.js'

// ============================================= login ===========================================

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email & password required" });
//     }

//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     const user = result.rows[0]; 

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.id, role: user.role, name: user.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (e) {
//     console.error("Login error:", e);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email & password required" });
//     }

//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     const user = result.rows[0]; 

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // 🔹 Decrypt password instead of bcrypt
//     const decryptedPassword = decryptPassword(user.password, user.iv);

//     if (password !== decryptedPassword) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.id, role: user.role, name: user.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (e) {
//     console.error("Login error:", e);
//     res.status(500).json({ message: "Server error" });
//   }
// };





export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔹 Decrypt password instead of bcrypt
    const decryptedPassword = decryptPassword(user.password, user.iv);

    if (password !== decryptedPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Step 1: Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Step 2: Agar logged-in user employee hai → admin ka data bhi fetch karo
    let adminData = null;

    if (user.role === "employee") {
      const adminResult = await pool.query(
        "SELECT id, name, email, role, avatar FROM users WHERE role = 'admin' LIMIT 1"
      );
      adminData = adminResult.rows[0] || null;
    }

    // ✅ Final Response
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        logo: user.avatar,
      },
      admin: adminData ? {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role,
        logo: adminData.avatar,
      } : null
    });

  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.body.id; // <-- frontend se aaya id
    const { name } = req.body;

    let avatarPath = null;

    if (req.file) {
      avatarPath = `uploads/profile/${req.file.filename}`;
    }

    // Purana user data
    const old = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (old.rows.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const finalName = name || old.rows[0].name;
    const finalAvatar = avatarPath || old.rows[0].avatar;

    const updated = await pool.query(
      `UPDATE users 
       SET name = $1, avatar = $2 
       WHERE id = $3 
       RETURNING id, name, email, avatar`,
      [finalName, finalAvatar, userId]
    );

    res.json({
      success: true,
      message: "Profile Updated",
      user: updated.rows[0],
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};