import express from "express";
import { pool } from "../config/db.js";


const router = express.Router();

// Admin ke liye sab routes (JWT authentication required)


// Get all whitelisted IPs
router.get("/whitelisted-ips", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM whitelisted_ips ORDER BY created_at DESC"
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add new IP
router.post("/whitelisted-ips", async (req, res) => {
    try {
        const { ip_address, description } = req.body;
        
        if (!ip_address) {
            return res.status(400).json({ 
                success: false, 
                message: "IP address is required" 
            });
        }
        
        const [result] = await pool.query(
            `INSERT INTO whitelisted_ips (ip_address, description, created_by) 
             VALUES (?, ?, ?) 
             RETURNING *`,
            [ip_address, description, req.user.id]
        );
        
        res.json({ success: true, data: result[0] });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.code === "23505") {
            res.status(400).json({ 
                success: false, 
                message: "IP address already exists" 
            });
        } else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});

// Update IP
router.put("/whitelisted-ips/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { ip_address, description, is_active } = req.body;
        
        const [result] = await pool.query(
            `UPDATE whitelisted_ips 
             SET ip_address = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? 
             RETURNING *`,
            [ip_address, description, is_active, id]
        );
        
        if (result.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "IP not found" 
            });
        }
        
        res.json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete IP
router.delete("/whitelisted-ips/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.query(
            "DELETE FROM whitelisted_ips WHERE id = ?",
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "IP not found" 
            });
        }
        
        res.json({ success: true, message: "IP deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get access logs
router.get("/access-logs", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM access_logs ORDER BY attempted_at DESC LIMIT 100"
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;