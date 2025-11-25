import { pool } from "../config/db.js";

export const AcivateHistoryForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminid=1

    const result = await pool.query(
      `SELECT * FROM lead_history WHERE updated_by_id = $1 or updated_by_id=$2`,
      [id,adminid]
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



export const saveCustomerNotes = async (req, res) => {
  const { customer_id } = req.params;
  const { note ,updatedby_name,updatedby_id } = req.body;

  try {
    if (!note || typeof note !== "string") {
      return res.status(400).json({ message: "Single note (string) required" });
    }

    const newNote = {
      text: note,
      created_at: new Date().toISOString(),
      updatedby_name:updatedby_name,
      updatedby_id:updatedby_id
    };

    const query = `
      INSERT INTO customer_notes (customer_id, notes)
      VALUES ($1, jsonb_build_array($2::jsonb))
      ON CONFLICT (customer_id) DO UPDATE
      SET notes = customer_notes.notes || jsonb_build_array($2::jsonb)
      RETURNING customer_id, notes;
    `;

    const result = await pool.query(query, [customer_id, JSON.stringify(newNote)]);
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error saving customer note:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};





export const getCustomerNotes = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const query = `
      SELECT n.note
      FROM customer_notes,
      LATERAL jsonb_array_elements(notes) AS n(note)
      WHERE customer_id = $1
      ORDER BY n.note->>'created_at' ASC;
    `;

    const result = await pool.query(query, [customer_id]);
    const notes = result.rows.map(r => r.note);

    return res.status(200).json({ customer_id, notes });
  } catch (error) {
    console.error("Error fetching customer notes:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};