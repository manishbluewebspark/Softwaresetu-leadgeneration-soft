import { pool } from "../config/db.js";

export const createTemplate = async (req, res) => {
  try {
    // FIXED: match frontend keys
    const { templateName, editorContent, delta } = req.body;

    if (!templateName || !editorContent) {
      return res.status(400).json({ message: "Name and content are required" });
    }

    const result = await pool.query(
      "INSERT INTO templates (name, content, delta) VALUES ($1, $2, $3) RETURNING *",
      [templateName, editorContent, delta]
    );

    res.status(201).json({
      message: "Template created successfully",
      template: result.rows[0],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getTemplates = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM templates ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM templates WHERE id = $1", [id]);

    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { templateName, editorContent } = req.body;

    if (!templateName || !editorContent) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      "UPDATE templates SET name = $1, content = $2 WHERE id = $3 RETURNING *",
      [templateName, editorContent, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json({ message: "Template updated", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSingleTemplates = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM templates ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error" });
  }
};

