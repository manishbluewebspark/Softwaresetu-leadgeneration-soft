import { pool } from "../config/db.js";

class WhitelistedIP {
    static async findByIP(ip) {
        const query = `
            SELECT * FROM whitelisted_ips 
            WHERE ip_address = $1 AND is_active = true
        `;
        const result = await pool.query(query, [ip]);
        return result.rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM whitelisted_ips ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    static async create(ipData) {
        const { ip_address, description, created_by } = ipData;
        const query = `
            INSERT INTO whitelisted_ips (ip_address, description, created_by)
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
        const result = await pool.query(query, [ip_address, description, created_by]);
        return result.rows[0];
    }

    static async update(id, ipData) {
        const { ip_address, description, is_active } = ipData;
        const query = `
            UPDATE whitelisted_ips 
            SET ip_address = $1, description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 
            RETURNING *
        `;
        const result = await pool.query(query, [ip_address, description, is_active, id]);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM whitelisted_ips WHERE id = $1';
        await pool.query(query, [id]);
        return true;
    }

    static async logAccess(ip, path, userAgent, status) {
        const query = `
            INSERT INTO access_logs (ip_address, path, user_agent, status)
            VALUES ($1, $2, $3, $4)
        `;
        await pool.query(query, [ip, path, userAgent, status]);
    }
}

module.exports = WhitelistedIP;