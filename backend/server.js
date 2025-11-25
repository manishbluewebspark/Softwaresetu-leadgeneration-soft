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






