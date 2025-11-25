
import puppeteer from 'puppeteer';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {pool} from "../config/db.js";

export const generateOfferLetter = async (req, res) => {
  try {
    const { templateId, name, position, joiningDate, salary } = req.body;

    // --- FIX: Always generate today's date same format as input (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // 1. Fetch template HTML
    const templateRes = await pool.query(
      "SELECT content FROM templates WHERE id = $1",
      [templateId]
    );

    if (templateRes.rowCount === 0) {
      return res.status(404).json({ message: "Template not found" });
    }

    let html = templateRes.rows[0].content;

    // 2. Replace placeholders with actual data
    html = html
      .replace(/{{name}}/g, name)
      .replace(/{{position}}/g, position)
      .replace(/{{joiningDate}}/g, joiningDate)
      .replace(/{{salary}}/g, salary)
      .replace(/{{currentDate}}/g, today);  // ✅ FIXED DATE HERE

    // 3. Insert generated letter into DB
    const insertRes = await pool.query(
      `INSERT INTO offer_letters 
      (template_id, employee_name, position, joining_date, salary, final_html) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [templateId, name, position, joiningDate, salary, html]
    );

    res.json({
      message: "Offer letter generated successfully",
      data: insertRes.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating offer letter" });
  }
};


export const getOfferLetters = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, employee_name, position, joining_date, salary, final_html
       FROM offer_letters ORDER BY id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching offer letters" });
  }
};

export const generatePDF = async (req, res) => {
  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: "HTML content is required" });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    // ⭐ EXTRACT FIRST IMAGE (Logo)
    const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/i;
    const firstImageMatch = htmlContent.match(imgRegex);

    let logoHTML = "";
    let contentHTML = htmlContent;

    if (firstImageMatch) {
      const firstImageTag = firstImageMatch[0];
      logoHTML = `<div class="logo-container">${firstImageTag}</div>`;
      contentHTML = htmlContent.replace(firstImageTag, "");
    }

    // ⭐ H2 ALWAYS FIRST PRIORITY
    let textMatch = contentHTML.match(/<h1[^>]*>(.*?)<\/h1>/i);

    // ⭐ If no H2 found → look for ql-size-large
    if (!textMatch) {
      const sizedRegex =
        /<(p|h1|h2|h3|h4|h5|strong|b|span)[^>]*?(ql-size-large)[^>]*>(.*?)<\/(p|h1|h2|h3|h4|h5|strong|b|span)>/i;
      textMatch = contentHTML.match(sizedRegex);
    }

    // ⭐ If still not found → take first NON-empty p/h tag
    if (!textMatch) {
      const fallbackRegex = /<(p|h1|h2|h3|h4|h5)[^>]*>(.*?)<\/(p|h1|h2|h3|h4|h5)>/i;
      let match = contentHTML.match(fallbackRegex);

      if (match) {
        const inner = match[2].trim();
        if (
          inner === "" ||
          inner === "<br>" ||
          inner === "<br/>" ||
          inner === "&nbsp;"
        ) {
          match = null;
        }
      }
      textMatch = match;
    }

    let centeredText = "";
    let remainingContent = contentHTML;

    if (textMatch) {
      remainingContent = contentHTML.replace(textMatch[0], "");
      centeredText = textMatch[1] || textMatch[3] || "";
      centeredText = centeredText.trim();
    }

    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
  /* A4 body layout */
  body {
    font-family: 'Playfair Display', serif;
    margin: 30px 40px;
    padding: 0;
    background: white;
    color: #333;
    line-height: 1.6;cd ba
    text-align: justify;
  }

  /* Logo */
  .logo-container {
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
    position: relative;
    z-index: 5;
  }

.logo-container img {
  max-width: 160px;        /* A4 ke hisaab se perfect */
  max-height: 80px;        /* Height control */
  width: auto;
  height: auto;
  object-fit: contain;     /* Prevent distortion */
}


  .separator-line {
    width: 100%;
    height: 2px;
    background: #000;
    margin: 10px 0 20px 0;
  }

  /* ⭐ FIX: H2 ALWAYS CENTER */
h1 {
  text-align: center !important;
  width: 100% !important;
  display: block !important;
  font-size: 26px !important;
  font-weight: 700 !important;
  margin-top: 10px !important;
  margin-bottom: 0 !important;   /* H2 ka gap remove */
  padding: 0 !important;
}

/* ⭐ NEW — gap completely removed */

h2 {
  position: absolute !important;
  top: 1000px;              /* ⭐ Yaha se vertical position control karo */
  left: 120px;             /* ⭐ Right side se distance */
  font-size: 18px !important;
  font-weight: 600 !important;
  margin: 0 !important;
  padding: 0 !important;
  text-align: right !important;
  width: auto !important;
  z-index: 10;
}

h3 {
  position: absolute !important;
  top: 1000px;              /* ⭐ Yaha se vertical position control karo */
  right: 120px;             /* ⭐ Right side se distance */
  font-size: 18px !important;
  font-weight: 600 !important;
  margin: 0 !important;
  padding: 0 !important;
  text-align: right !important;
  width: auto !important;
  z-index: 10;
}





  /* Centered first extracted text */
  .center-first-text {
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center !important;
    font-size: 26px;
    font-weight: 700;
  }

  .content-wrapper {
    margin-top: 5px;
  }
    
p {
  margin: 0 0 0 0;
  line-height: 1.3;
  font-size: 14px !important;   /* ⭐ Text size fixed */
}


  /* Purple Design */
  .header-bar {
    width: 100%;
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .header-bar::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50%;
    height: 50px;
    background: #C9C5C5;
    clip-path: polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%);
    z-index: 1;
  }
</style>
</head>

<body>

  <div class="header-bar">${logoHTML}</div>

  ${logoHTML ? `<div class="separator-line"></div>` : ""}

  ${centeredText ? `<h1>${centeredText}</h1>` : ""}

  <div class="content-wrapper">
    ${remainingContent}
  </div>

</body>
</html>
`;

    await page.setContent(fullHTML, { waitUntil: "networkidle0" });

    // PDF A4 Size
    const pdfBuffer = await page.pdf({
      printBackground: true,
      format: "A4",
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=offer-letter.pdf");
    res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).json({ error: "PDF generation failed", details: error.message });
  }
};


export const deleteOfferLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM offer_letters WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Offer letter not found" });
    }

    res.json({ message: "Offer letter deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer letter:", error);
    res.status(500).json({ error: "Failed to delete offer letter" });
  }
};
