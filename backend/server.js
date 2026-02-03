import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import employeeRoutes from "./routes/employeeRoutes.js";
import { pool } from "./config/db.js";
import authrouter from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import ActivityRoutes from './routes/ActivityRoutes.js'
import AnalyticsRoutes from './routes/AnalyticsRoutes.js'; 
import templateRoutes from "./routes/templateRoutes.js";
import offerLetterRoutes from "./routes/offerLetterRoutes.js";



dotenv.config();


const corsOptions = {
  origin:"*",
  credentials: true,  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

const app = express();

app.use(cors(corsOptions)); 
app.use(express.json());


app.use("/api/uploads", express.static("uploads"));


app.get("/api/health", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1+1 AS two");
    res.json({ ok: true, db: rows[0].two === 2 });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.use("/api/auth", authrouter);
app.use("/api/employee", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/activity", ActivityRoutes);
app.use("/api/analytics",AnalyticsRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/offerletters", offerLetterRoutes);

const PORT = 5000
app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });




// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// // Import routes
// import employeeRoutes from "./routes/employeeRoutes.js";
// import { pool } from "./config/db.js";
// import authrouter from "./routes/authRoutes.js";
// import customerRoutes from "./routes/customerRoutes.js";
// import statusRoutes from "./routes/statusRoutes.js";
// import ActivityRoutes from './routes/ActivityRoutes.js';
// import AnalyticsRoutes from './routes/AnalyticsRoutes.js'; 
// import templateRoutes from "./routes/templateRoutes.js";
// import offerLetterRoutes from "./routes/offerLetterRoutes.js";
// import ipRoutes from "./routes/ipRoutes.js";
// import ipWhitelist from "./middleware/ipWhitelist.js";
// import accessCheckRoutes from "./routes/accessCheckRoutes.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const corsOptions = {
//   origin: "*",
//   credentials: true,  
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], 
//   allowedHeaders: ['Content-Type', 'Authorization'] 
// };

// const app = express();

// app.use(cors(corsOptions)); 
// app.use(express.json());

// // Serve uploads statically
// app.use("/api/uploads", express.static("uploads"));

// // Health check route (IP check se pehle)
// app.get("/api/health", async (_req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT 1+1 AS two");
//     res.json({ ok: true, db: rows[0].two === 2 });
//   } catch {
//     res.status(500).json({ ok: false });
//   }
// });

// // IMPORTANT: IP check se pehle ke important routes
// // 1. Authentication routes - login ke liye
// app.use("/api/auth", authrouter);

// // 2. IP whitelist check for frontend (ye bhi pehle)
// app.use("/api/check-access", accessCheckRoutes);

// // 3. IP management routes (admin ke liye, pehle authenticate ho sake)
// app.use("/api/ips", ipRoutes);

// // Ab baaki sab routes par IP whitelist middleware apply karein
// app.use(ipWhitelist);

// // Baaki sab protected routes
// app.use("/api/employee", employeeRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/status", statusRoutes);
// app.use("/api/activity", ActivityRoutes);
// app.use("/api/analytics", AnalyticsRoutes);
// app.use("/api/templates", templateRoutes);
// app.use("/api/offerletters", offerLetterRoutes);

// // Admin panel ke liye React app serve karein (agar separate ho)
// app.get("/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "admin-build", "index.html"));
// });

// // Client app ke liye React app serve karein
// app.use(express.static(path.join(__dirname, "client-build")));

// // All other routes to React app
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client-build", "index.html"));
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



