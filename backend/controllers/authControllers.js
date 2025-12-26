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





// export const login = async (req, res) => {
//   console.log(req.ip,25000)
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

//     // ✅ Step 1: Generate token
//     const token = jwt.sign(
//       { id: user.id, role: user.role, name: user.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // ✅ Step 2: Agar logged-in user employee hai → admin ka data bhi fetch karo
//     let adminData = null;

//     if (user.role === "employee") {
//       const adminResult = await pool.query(
//         "SELECT id, name, email, role, avatar FROM users WHERE role = 'admin' LIMIT 1"
//       );
//       adminData = adminResult.rows[0] || null;
//     }

//     // ✅ Final Response
//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         logo: user.avatar,
//       },
//       admin: adminData ? {
//         id: adminData.id,
//         name: adminData.name,
//         email: adminData.email,
//         role: adminData.role,
//         logo: adminData.avatar,
//       } : null
//     });

//   } catch (e) {
//     console.error("Login error:", e);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const login = async (req, res) => {
  console.log("Request Headers:", req.headers);
  console.log("Connection Remote Address:", req.connection.remoteAddress);
  console.log("Socket Remote Address:", req.socket.remoteAddress);
  
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

    // 🔹 Correct IP Extraction Function
    const getClientIP = (req) => {
      // 1. Try X-Forwarded-For header (load balancer/proxy)
      if (req.headers['x-forwarded-for']) {
        const ips = req.headers['x-forwarded-for'].split(',');
        return ips[0].trim();
      }
      
      // 2. Try X-Real-IP header (nginx proxy)
      if (req.headers['x-real-ip']) {
        return req.headers['x-real-ip'];
      }
      
      // 3. Try CF-Connecting-IP (Cloudflare)
      if (req.headers['cf-connecting-ip']) {
        return req.headers['cf-connecting-ip'];
      }
      
      // 4. Fallback to connection or socket address
      return req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
    };

    // Get actual client IP
    const clientIP = getClientIP(req);
    console.log("Detected Client IP:", clientIP);
    
    // Remove IPv6 prefix if present
    const cleanIP = clientIP.replace('::ffff:', '');
    console.log("Cleaned IP:", cleanIP);

    // 🔹 IP Restriction Logic (Only for non-admin users)

    if (user.role !== 'admin') {
      // Define allowed campus IPs/ranges
      // Aapka campus static IP yahan dalen
      let allowedips=process.env.CAMPUSIP
      const allowedCampusIPs = [
        allowedips,
        // '127.0.0.1',   
        //  '::1',
      ];
      
      // Helper function to check IP against range
      const isIPInRange = (ip, range) => {
        if (range.includes('/')) {
          // CIDR notation check (e.g., 192.168.1.0/24)
          const [rangeIP, mask] = range.split('/');
          const maskInt = parseInt(mask);
          
          // Simple check - for exact implementation use ipaddr.js library
          if (maskInt === 24 && ip.startsWith(rangeIP.split('.').slice(0, 3).join('.'))) {
            return true;
          }
          return ip === rangeIP;
        }
        return ip === range; // Exact match
      };
      
      // Check if IP is allowed
      let isAllowed = false;
      
      // Allow localhost during development
      if (process.env.NODE_ENV === 'development' && (cleanIP === '127.0.0.1' || cleanIP === '::1')) {
        console.log("Development mode: Allowing localhost");
        isAllowed = true;
      } else {
        // Production: Check against allowed IPs
        for (const allowedRange of allowedCampusIPs) {
          if (isIPInRange(cleanIP, allowedRange)) {
            isAllowed = true;
            break;
          }
        }
      }
      
      if (!isAllowed) {
        console.log(`Access denied: IP ${cleanIP} not in allowed ranges`);
        return res.status(403).json({
          message: `Access restricted to campus network only. Your IP: ${cleanIP}`,
          allowedIPs: allowedCampusIPs
        });
      }
    }

    // 🔹 Continue with password check...
    const decryptedPassword = decryptPassword(user.password, user.iv);
    if (password !== decryptedPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate token (with IP info for logging)
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        name: user.name,
        loginIP: cleanIP,
        timestamp: new Date().toISOString()
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Log successful login with IP
    console.log(`User ${email} (${user.role}) logged in from IP: ${cleanIP}`);

    // ✅ Admin data fetch for employees
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