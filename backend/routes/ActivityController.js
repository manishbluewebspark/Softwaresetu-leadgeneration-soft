import { pool } from "../config/db.js";

export const AcivateHistoryForUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM lead_history WHERE updated_by_id = $1`,
      [id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user history:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const AcivateHistoryForAdmin = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM lead_history ORDER BY updated_at DESC`);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user history:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

