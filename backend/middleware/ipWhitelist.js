import { pool } from "../config/db.js";

// Function to get client IP
export const getClientIP = (req) => {
    return req.headers["x-forwarded-for"]?.split(",")[0] || 
           req.headers["x-real-ip"] || 
           req.connection.remoteAddress || 
           req.ip ||
           req.socket.remoteAddress;
};

// IP Whitelist Middleware
const ipWhitelist = async (req, res, next) => {
    try {
        const clientIP = getClientIP(req);
        const path = req.path;
        const userAgent = req.headers["user-agent"];
        
        console.log(`Access attempt from IP: ${clientIP} to path: ${path}`);
        
        // Development me localhost ko allow karein
        if (process.env.NODE_ENV === "development") {
            if (clientIP === "127.0.0.1" || clientIP === "::1") {
                await logAccess(clientIP, path, userAgent, "allowed");
                return next();
            }
        }
        
        // Check if IP is whitelisted
        const [rows] = await pool.query(
            "SELECT * FROM whitelisted_ips WHERE ip_address = ? AND is_active = TRUE",
            [clientIP]
        );
        
        if (rows.length > 0) {
            // Access allowed
            await logAccess(clientIP, path, userAgent, "allowed");
            next();
        } else {
            // Access denied
            await logAccess(clientIP, path, userAgent, "blocked");
            
            // Agar API request hai to JSON response
            if (req.path.startsWith("/api")) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: Your IP is not whitelisted",
                    ip: clientIP,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Agar web page request hai to HTML response
            return res.status(403).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Access Denied</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            height: 100vh; 
                            margin: 0; 
                            background-color: #f5f5f5; 
                        }
                        .container { 
                            text-align: center; 
                            padding: 40px; 
                            background: white; 
                            border-radius: 10px; 
                            box-shadow: 0 0 20px rgba(0,0,0,0.1); 
                        }
                        h1 { color: #e74c3c; }
                        .ip-info { 
                            background: #f8f9fa; 
                            padding: 10px; 
                            border-radius: 5px; 
                            margin: 20px 0; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🚫 Access Denied</h1>
                        <p>Your IP address is not authorized to access this application.</p>
                        <div class="ip-info">
                            <strong>Your IP:</strong> ${clientIP}<br>
                            <strong>Time:</strong> ${new Date().toLocaleString()}
                        </div>
                        <p>Please contact the administrator to request access.</p>
                        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Retry
                        </button>
                    </div>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error("IP Whitelist Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Function to log access attempts
const logAccess = async (ip, path, userAgent, status) => {
    try {
        await pool.query(
            "INSERT INTO access_logs (ip_address, path, user_agent, status) VALUES (?, ?, ?, ?)",
            [ip, path, userAgent, status]
        );
    } catch (error) {
        console.error("Failed to log access:", error);
    }
};

export default ipWhitelist;