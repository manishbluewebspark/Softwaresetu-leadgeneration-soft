import express from "express";
import { getClientIP } from "../middleware/ipWhitelist.js";
import { pool } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const clientIP = getClientIP(req);
        const userAgent = req.headers["user-agent"];
        
        console.log(`Access check from IP: ${clientIP}`);
        
        // Development me localhost ko allow karein
        if (process.env.NODE_ENV === "development") {
            if (clientIP === "127.0.0.1" || clientIP === "::1") {
                return res.json({ 
                    allowed: true, 
                    ip: clientIP,
                    message: "Localhost access granted" 
                });
            }
        }
        
        // Database se check karein
        const [rows] = await pool.query(
            "SELECT * FROM whitelisted_ips WHERE ip_address = ? AND is_active = TRUE",
            [clientIP]
        );
        
        if (rows.length > 0) {
            // Log successful access check
            await pool.query(
                "INSERT INTO access_logs (ip_address, path, user_agent, status) VALUES (?, ?, ?, ?)",
                [clientIP, req.path, userAgent, "checked_allowed"]
            );
            
            return res.json({ 
                allowed: true, 
                ip: clientIP,
                message: "Access granted" 
            });
        } else {
            // Log blocked access check
            await pool.query(
                "INSERT INTO access_logs (ip_address, path, user_agent, status) VALUES (?, ?, ?, ?)",
                [clientIP, req.path, userAgent, "checked_denied"]
            );
            
            return res.json({ 
                allowed: false, 
                ip: clientIP,
                message: "Access denied. IP not whitelisted." 
            });
        }
    } catch (error) {
        console.error("Access check error:", error);
        res.status(500).json({ 
            allowed: false, 
            error: "Internal server error",
            message: "Unable to verify access" 
        });
    }
});

export default router;