import { read, utils } from "xlsx";
import { pool } from "../config/db.js";



// export const uploadExcel = async (req, res) => {
//   const client = await pool.connect();
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     if (!req.body.source_name) {
//       return res.status(400).json({ message: "Source name is required" });
//     }

//     // Read Excel file
//     const workbook = read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     let data = utils.sheet_to_json(sheet, { defval: "" });

//     // Normalize keys to lowercase and trim
//     data = data.map((row) => {
//       const normalized = {};
//       for (let key in row) {
//         const newKey = key.toString().trim().toLowerCase();
//         normalized[newKey] = row[key];
//       }
//       return normalized;
//     });

//     // Start transaction
//     await client.query("BEGIN");

//     // Insert into batches and get batch ID (inside transaction)
//     // const batchResult = await client.query(
//     //   "INSERT INTO batches (source_name) VALUES ($1) RETURNING batch_id",
//     //   [req.body.source_name]
//     // );
//     const batchResult = await client.query(
//   "INSERT INTO batches (source_name, description) VALUES ($1, $2) RETURNING batch_id",
//   [req.body.source_name, req.body.description || ""]
// );

//     if (batchResult.rows.length === 0) {
//       throw new Error("Failed to insert batch");
//     }
//     const batchId = batchResult.rows[0].batch_id;

//     // Prepare customer values (and normalize mobile to digits only)
//     const prepared = data.map((row) => {
//       const name = row.name || row["full name"] || row["fullname"] || "";
//       const email = row.email || row["e-mail"] || row.mail || "";
//       let mobile = row.mobile || row.phone || "";
//       if (mobile || mobile === 0) {
//         mobile = mobile.toString().replace(/\D/g, ""); // keep only digits
//       } else {
//         mobile = "";
//       }
//       const address = row.address || row.location || "";
//       const status = "Pending";
//       const status_id = 5;
//       return { batchId, name, email, mobile, address, status, status_id };
//     });

//     // Collect mobiles that are non-empty for duplicate-check
//     const mobilesToCheck = Array.from(
//       new Set(prepared
//         .map((p) => (p.mobile && p.mobile.length > 0 ? p.mobile : null))
//         .filter(Boolean))
//     ); // unique, non-empty mobiles

//     // Query DB for existing mobiles (only if there are mobiles to check)
//     let existingMobileSet = new Set();
//     if (mobilesToCheck.length > 0) {
//       // Use ANY($1::text[]) to pass an array param
//       const existingRes = await client.query(
//         "SELECT mobile FROM customers WHERE mobile = ANY($1::text[])",
//         [mobilesToCheck]
//       );
//       existingRes.rows.forEach((r) => {
//         if (r.mobile) existingMobileSet.add(r.mobile.toString());
//       });
//     }

//     // Filter out prepared rows whose mobile is already present
//     const toInsert = prepared.filter((p) => {
//       // If mobile is empty string, we allow insert (based on your original logic).
//       // If you want to skip empty mobiles as duplicates or require mobiles, change this behavior.
//       if (!p.mobile || p.mobile.length === 0) return true;
//       return !existingMobileSet.has(p.mobile.toString());
//     });

//     if (toInsert.length === 0) {
//       // nothing to insert, commit the transaction (we still keep the batch)
//       await client.query("COMMIT");
//       return res.json({
//         message: "Excel uploaded successfully — but no new customers to insert (all mobiles existed).",
//         batchId,
//         inserted: 0,
//         skipped: prepared.length,
//       });
//     }

//     // Build bulk insert placeholders and values
//     // Each row has 7 columns: batch_id, name, email, mobile, address, status, status_id
//     const placeholders = toInsert
//       .map((_, i) => {
//         const base = i * 7;
//         return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`;
//       })
//       .join(", ");

//     const flatValues = toInsert.flatMap((p) => [
//       p.batchId,
//       p.name,
//       p.email,
//       p.mobile,
//       p.address,
//       p.status,
//       p.status_id,
//     ]);

//     await client.query(
//       `INSERT INTO customers (batch_id, name, email, mobile, address, status, status_id) VALUES ${placeholders}`,
//       flatValues
//     );

//     await client.query("COMMIT");

//     // Stats for response
//     const skippedCount = prepared.length - toInsert.length;
//     res.json({
//       message: "Excel uploaded successfully",
//       batchId,
//       inserted: toInsert.length,
//       skipped: skippedCount,
//     });
//   } catch (err) {
//     await client.query("ROLLBACK").catch(() => {});
//     console.error("Error uploading excel:", err);
//     res.status(500).json({ message: "Error uploading excel", error: err.message });
//   } finally {
//     client.release();
//   }
// };


// export const uploadExcel = async (req, res) => {
//   const client = await pool.connect();
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     if (!req.body.source_name) {
//       return res.status(400).json({ message: "Source name is required" });
//     }

//     // Read Excel file
//     const workbook = read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     let data = utils.sheet_to_json(sheet, { defval: "", raw: false });

//     // Normalize keys to lowercase and trim
//     data = data.map((row) => {
//       const normalized = {};
//       for (let key in row) {
//         const newKey = key.toString().trim().toLowerCase()
//           .replace(/[^\w\s]/gi, '') // Remove special characters
//           .replace(/\s+/g, '_'); // Replace spaces with underscores
//         normalized[newKey] = row[key];
//       }
//       return normalized;
//     });

//     // Start transaction
//     await client.query("BEGIN");

//     // Insert into batches and get batch ID
//     const batchResult = await client.query(
//       "INSERT INTO batches (source_name, description) VALUES ($1, $2) RETURNING batch_id",
//       [req.body.source_name, req.body.description || ""]
//     );

//     if (batchResult.rows.length === 0) {
//       throw new Error("Failed to insert batch");
//     }
//     const batchId = batchResult.rows[0].batch_id;

//     // Define expected column mappings with priority
//     const columnMappings = {
//       name: ['name', 'full_name', 'fullname', 'customer_name', 'client_name', 'contact_person'],
//       mobile: ['mobile', 'phone', 'contact', 'phone_number', 'contact_number', 'mobileno'],
//       email: ['email', 'e_mail', 'mail', 'email_id'],
//       address: ['address', 'location', 'city', 'area', 'street', 'full_address']
//     };

//     // Find actual column names in the data
//     const findColumn = (possibleNames) => {
//       for (const name of possibleNames) {
//         if (data[0] && data[0][name] !== undefined) {
//           return name;
//         }
//       }
//       return null;
//     };

//     const nameColumn = findColumn(columnMappings.name);
//     const mobileColumn = findColumn(columnMappings.mobile);
//     const emailColumn = findColumn(columnMappings.email);
//     const addressColumn = findColumn(columnMappings.address);

//     // Validate required columns
//     if (!nameColumn) {
//       await client.query("ROLLBACK");
//       return res.status(400).json({ 
//         message: "Excel must contain a 'Name' column", 
//         availableColumns: Object.keys(data[0] || {}) 
//       });
//     }

//     if (!mobileColumn) {
//       await client.query("ROLLBACK");
//       return res.status(400).json({ 
//         message: "Excel must contain a 'Mobile' or 'Phone' column",
//         availableColumns: Object.keys(data[0] || {}) 
//       });
//     }

//     // Prepare and validate customer data
//     const prepared = [];
//     const errors = [];
//     const duplicatesInFile = new Set();
//     const mobileSet = new Set();

//     data.forEach((row, index) => {
//       const rowNum = index + 2; // Excel rows are 1-indexed, header is row 1
      
//       // Extract values with fallbacks
//       let name = (row[nameColumn] || '').toString().trim();
//       let email = emailColumn ? (row[emailColumn] || '').toString().trim().toLowerCase() : '';
//       let mobile = (row[mobileColumn] || '').toString().trim();
//       let address = addressColumn ? (row[addressColumn] || '').toString().trim() : '';

//       // Clean mobile number - keep only digits, remove country code if it's 91
//       if (mobile) {
//         mobile = mobile.replace(/\D/g, ''); // Remove non-digits
//         // Remove leading 91 (India code) if number is 12 digits starting with 91
//         if (mobile.length === 12 && mobile.startsWith('91')) {
//           mobile = mobile.substring(2);
//         }
//         // Remove leading 0 if present
//         if (mobile.startsWith('0')) {
//           mobile = mobile.substring(1);
//         }
//       }

//       // Validation rules
//       if (!name || name.length === 0) {
//         errors.push(`Row ${rowNum}: Name is required`);
//         return;
//       }

//       if (!mobile || mobile.length === 0) {
//         errors.push(`Row ${rowNum}: Mobile number is required`);
//         return;
//       }

//       if (mobile.length < 10 || mobile.length > 15) {
//         errors.push(`Row ${rowNum}: Mobile number must be 10-15 digits (got ${mobile.length})`);
//         return;
//       }

//       // Check for duplicate mobile within same file
//       if (mobileSet.has(mobile)) {
//         duplicatesInFile.add(mobile);
//         errors.push(`Row ${rowNum}: Duplicate mobile number in file: ${mobile}`);
//         return;
//       }
//       mobileSet.add(mobile);

//       // Validate email format if provided
//       if (email && !isValidEmail(email)) {
//         errors.push(`Row ${rowNum}: Invalid email format: ${email}`);
//         return;
//       }

//       // Truncate long values to match database constraints
//       if (name.length > 100) {
//         name = name.substring(0, 100);
//       }
//       if (address.length > 255) {
//         address = address.substring(0, 255);
//       }
//       if (email.length > 100) {
//         email = email.substring(0, 100);
//       }

//       prepared.push({
//         batchId,
//         name,
//         email,
//         mobile,
//         address,
//         status: "Pending",
//         status_id: 5
//       });
//     });

//     // If validation errors, rollback and return errors
//     if (errors.length > 0) {
//       await client.query("ROLLBACK");
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: errors.slice(0, 20), // Return first 20 errors only
//         totalErrors: errors.length,
//         duplicatesInFile: Array.from(duplicatesInFile)
//       });
//     }

//     if (prepared.length === 0) {
//       await client.query("ROLLBACK");
//       return res.status(400).json({ 
//         message: "No valid data to import after validation" 
//       });
//     }

//     // Check for duplicates in database
//     const mobilesToCheck = prepared.map(p => p.mobile);
//     let existingMobileSet = new Set();
    
//     if (mobilesToCheck.length > 0) {
//       const existingRes = await client.query(
//         "SELECT mobile FROM customers WHERE mobile = ANY($1::text[])",
//         [mobilesToCheck]
//       );
//       existingRes.rows.forEach((r) => {
//         if (r.mobile) existingMobileSet.add(r.mobile.toString());
//       });
//     }

//     // Separate new and duplicate records
//     const toInsert = [];
//     const duplicatesInDB = [];
    
//     prepared.forEach((customer) => {
//       if (existingMobileSet.has(customer.mobile)) {
//         duplicatesInDB.push(customer.mobile);
//       } else {
//         toInsert.push(customer);
//       }
//     });

//     if (toInsert.length === 0) {
//       await client.query("ROLLBACK");
//       return res.status(400).json({
//         message: "All mobile numbers already exist in database",
//         duplicates: duplicatesInDB.slice(0, 10), // Show first 10 duplicates
//         totalDuplicates: duplicatesInDB.length
//       });
//     }

//     // Insert valid records
//     const placeholders = toInsert
//       .map((_, i) => {
//         const base = i * 7;
//         return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`;
//       })
//       .join(", ");

//     const flatValues = toInsert.flatMap((p) => [
//       p.batchId,
//       p.name,
//       p.email,
//       p.mobile,
//       p.address,
//       p.status,
//       p.status_id,
//     ]);

//     await client.query(
//       `INSERT INTO customers (batch_id, name, email, mobile, address, status, status_id) VALUES ${placeholders}`,
//       flatValues
//     );

//     await client.query("COMMIT");

//     // Generate summary report
//     const summary = {
//       totalRowsInExcel: data.length,
//       validRows: prepared.length,
//       inserted: toInsert.length,
//       skippedDueToValidation: data.length - prepared.length,
//       skippedDueToDBDuplicates: duplicatesInDB.length,
//       batchId: batchId,
//       columnMapping: {
//         name: nameColumn,
//         mobile: mobileColumn,
//         email: emailColumn || 'Not found',
//         address: addressColumn || 'Not found'
//       }
//     };

//     res.json({
//       message: "Excel uploaded successfully",
//       summary,
//       warnings: duplicatesInDB.length > 0 ? 
//         `${duplicatesInDB.length} records skipped (already in database)` : 
//         undefined
//     });

//   } catch (err) {
//     await client.query("ROLLBACK").catch(() => {});
//     console.error("Error uploading excel:", err);
    
//     // More specific error messages
//     let errorMessage = "Error uploading excel";
//     if (err.message.includes("invalid input syntax")) {
//       errorMessage = "Data format error - check for special characters";
//     } else if (err.message.includes("value too long")) {
//       errorMessage = "Data too long for database columns";
//     }
    
//     res.status(500).json({ 
//       message: errorMessage, 
//       error: err.message 
//     });
//   } finally {
//     client.release();
//   }
// };








export const uploadExcel = async (req, res) => {
  const client = await pool.connect();
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!req.body.source_name) {
      return res.status(400).json({ message: "Source name is required" });
    }

    // Read Excel file
    const workbook = read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let data = utils.sheet_to_json(sheet, { defval: "", raw: false });

    // Normalize keys to lowercase and trim
    data = data.map((row) => {
      const normalized = {};
      for (let key in row) {
        const newKey = key.toString().trim().toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '_');
        normalized[newKey] = row[key];
      }
      return normalized;
    });

    // Start transaction
    await client.query("BEGIN");

    // Insert into batches and get batch ID
    const batchResult = await client.query(
      "INSERT INTO batches (source_name, description) VALUES ($1, $2) RETURNING batch_id",
      [req.body.source_name, req.body.description || ""]
    );

    if (batchResult.rows.length === 0) {
      throw new Error("Failed to insert batch");
    }
    const batchId = batchResult.rows[0].batch_id;

    // Define expected column mappings with priority
    const columnMappings = {
      name: ['name', 'full_name', 'fullname', 'customer_name', 'client_name', 'contact_person'],
      mobile: ['mobile', 'phone', 'contact', 'phone_number', 'contact_number', 'mobileno'],
      email: ['email', 'e_mail', 'mail', 'email_id'],
      address: ['address', 'location', 'city', 'area', 'street', 'full_address']
    };

    // Find actual column names in the data
    const findColumn = (possibleNames) => {
      for (const name of possibleNames) {
        if (data[0] && data[0][name] !== undefined) {
          return name;
        }
      }
      return null;
    };

    const nameColumn = findColumn(columnMappings.name);
    const mobileColumn = findColumn(columnMappings.mobile);
    const emailColumn = findColumn(columnMappings.email);
    const addressColumn = findColumn(columnMappings.address);

    // Validate required columns
    if (!nameColumn) {
      await client.query("ROLLBACK");
      return res.status(400).json({ 
        message: "Excel must contain a 'Name' column", 
        availableColumns: Object.keys(data[0] || {}) 
      });
    }

    if (!mobileColumn) {
      await client.query("ROLLBACK");
      return res.status(400).json({ 
        message: "Excel must contain a 'Mobile' or 'Phone' column",
        availableColumns: Object.keys(data[0] || {}) 
      });
    }

    // Prepare and validate customer data
    const prepared = [];
    const validationErrors = [];
    const inFileDuplicates = []; // Store in-file duplicate details
    const mobileSet = new Set();
    const mobileToRowMap = new Map(); // Track mobile to row data mapping

    data.forEach((row, index) => {
      const rowNum = index + 2;
      
      // Extract values with fallbacks
      let name = (row[nameColumn] || '').toString().trim();
      let email = emailColumn ? (row[emailColumn] || '').toString().trim().toLowerCase() : '';
      let mobile = (row[mobileColumn] || '').toString().trim();
      let address = addressColumn ? (row[addressColumn] || '').toString().trim() : '';

      // Clean mobile number
      if (mobile) {
        mobile = mobile.replace(/\D/g, '');
        if (mobile.length === 12 && mobile.startsWith('91')) {
          mobile = mobile.substring(2);
        }
        if (mobile.startsWith('0')) {
          mobile = mobile.substring(1);
        }
      }

      // Validation rules
      if (!name || name.length === 0) {
        validationErrors.push(`Row ${rowNum}: Name is required`);
        return;
      }

      if (!mobile || mobile.length === 0) {
        validationErrors.push(`Row ${rowNum}: Mobile number is required`);
        return;
      }

      if (mobile.length < 10 || mobile.length > 15) {
        validationErrors.push(`Row ${rowNum}: Mobile number must be 10-15 digits (got ${mobile.length})`);
        return;
      }

      // Check for duplicate mobile within same file
      if (mobileSet.has(mobile)) {
        // This is a duplicate within the file
        inFileDuplicates.push({
          rowNum,
          name,
          mobile,
          email,
          address,
          batchId,
          sourceName: req.body.source_name,
          duplicateType: 'in_file'
        });
        return; // Skip this row
      }
      mobileSet.add(mobile);
      mobileToRowMap.set(mobile, { name, email, address, rowNum });

      // Validate email format if provided
      if (email && !isValidEmail(email)) {
        validationErrors.push(`Row ${rowNum}: Invalid email format: ${email}`);
        return;
      }

      // Truncate long values
      if (name.length > 100) name = name.substring(0, 100);
      if (address.length > 255) address = address.substring(0, 255);
      if (email.length > 100) email = email.substring(0, 100);

      prepared.push({
        batchId,
        name,
        email,
        mobile,
        address,
        status: "Pending",
        status_id: 5
      });
    });

    // If only validation errors (not duplicates), rollback
    if (validationErrors.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors.slice(0, 20),
        totalErrors: validationErrors.length
      });
    }

    if (prepared.length === 0 && inFileDuplicates.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ 
        message: "No valid data to import" 
      });
    }

    // Check for duplicates in database
    const mobilesToCheck = prepared.map(p => p.mobile);
    const dbDuplicates = [];
    
    if (mobilesToCheck.length > 0) {
      const existingRes = await client.query(
        `SELECT c.mobile, c.name, c.email, c.address, b.batch_id, b.source_name 
         FROM customers c 
         JOIN batches b ON c.batch_id = b.batch_id 
         WHERE c.mobile = ANY($1::text[])`,
        [mobilesToCheck]
      );
      
      const existingMobileMap = new Map();
      existingRes.rows.forEach((row) => {
        existingMobileMap.set(row.mobile.toString(), row);
      });

      // Separate new and duplicate records
      const toInsert = [];
      prepared.forEach((customer) => {
        if (existingMobileMap.has(customer.mobile)) {
          const existing = existingMobileMap.get(customer.mobile);
          dbDuplicates.push({
            rowNum: mobileToRowMap.get(customer.mobile)?.rowNum,
            name: customer.name,
            mobile: customer.mobile,
            email: customer.email,
            address: customer.address,
            batchId,
            sourceName: req.body.source_name,
            existingBatchId: existing.batch_id,
            existingSourceName: existing.source_name,
            duplicateType: 'in_database'
          });
        } else {
          toInsert.push(customer);
        }
      });

      // Insert in-file duplicates to logs
      if (inFileDuplicates.length > 0) {
        const inFileLogs = inFileDuplicates.map(dup => [
          batchId,
          dup.sourceName,
          dup.name,
          dup.mobile,
          dup.email || '',
          dup.address || '',
          null, // existing_batch_id
          null, // existing_source_name
          'in_file'
        ]);

        await client.query(
          `INSERT INTO duplicate_logs 
           (batch_id, source_name, customer_name, mobile, email, address, 
            existing_batch_id, existing_source_name, duplicate_type) 
           VALUES ${inFileDuplicates.map((_, i) => 
             `($${i*9 + 1}, $${i*9 + 2}, $${i*9 + 3}, $${i*9 + 4}, $${i*9 + 5}, 
               $${i*9 + 6}, $${i*9 + 7}, $${i*9 + 8}, $${i*9 + 9})`
           ).join(', ')}`,
          inFileLogs.flat()
        );
      }

      // Insert database duplicates to logs
      if (dbDuplicates.length > 0) {
        const dbLogs = dbDuplicates.map(dup => [
          batchId,
          dup.sourceName,
          dup.name,
          dup.mobile,
          dup.email || '',
          dup.address || '',
          dup.existingBatchId,
          dup.existingSourceName,
          'in_database'
        ]);



        await client.query(
          `INSERT INTO duplicate_logs 
           (batch_id, source_name, customer_name, mobile, email, address, 
            existing_batch_id, existing_source_name, duplicate_type) 
           VALUES ${dbDuplicates.map((_, i) => 
             `($${i*9 + 1}, $${i*9 + 2}, $${i*9 + 3}, $${i*9 + 4}, $${i*9 + 5}, 
               $${i*9 + 6}, $${i*9 + 7}, $${i*9 + 8}, $${i*9 + 9})`
           ).join(', ')}`,
          dbLogs.flat()
        );
      }

      // Insert only unique records
      if (toInsert.length > 0) {
        const placeholders = toInsert
          .map((_, i) => {
            const base = i * 7;
            return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`;
          })
          .join(", ");

        const flatValues = toInsert.flatMap((p) => [
          p.batchId,
          p.name,
          p.email,
          p.mobile,
          p.address,
          p.status,
          p.status_id,
        ]);

        await client.query(
          `INSERT INTO customers (batch_id, name, email, mobile, address, status, status_id) 
           VALUES ${placeholders}`,
          flatValues
        );
      }

      await client.query("COMMIT");

      // Generate summary report
      const summary = {
        totalRowsInExcel: data.length,
        inserted: toInsert.length,
        skippedInFileDuplicates: inFileDuplicates.length,
        skippedDbDuplicates: dbDuplicates.length,
        skippedValidationErrors: validationErrors.length,
        batchId: batchId,
        columnMapping: {
          name: nameColumn,
          mobile: mobileColumn,
          email: emailColumn || 'Not found',
          address: addressColumn || 'Not found'
        }
      };

      res.json({
        message: "Excel uploaded successfully",
        summary,
        warnings: []
      });

    } else {
      await client.query("ROLLBACK");
      res.json({
        message: "No new records to insert (all were duplicates)",
        summary: {
          totalRowsInExcel: data.length,
          inserted: 0,
          skippedInFileDuplicates: inFileDuplicates.length,
          skippedDbDuplicates: 0,
          skippedValidationErrors: 0,
          batchId: null
        }
      });
    }

  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error uploading excel:", err);
    
    let errorMessage = "Error uploading excel";
    if (err.message.includes("invalid input syntax")) {
      errorMessage = "Data format error - check for special characters";
    } else if (err.message.includes("value too long")) {
      errorMessage = "Data too long for database columns";
    }
    
    res.status(500).json({ 
      message: errorMessage, 
      error: err.message 
    });
  } finally {
    client.release();
  }
};






// Get duplicate logs for a batch
export const getDuplicateLogs = async (req, res) => {
  const { batchId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
         log_id,
         batch_id,
         source_name,
         customer_name,
         mobile,
         email,
         address,
         existing_batch_id,
         existing_source_name,
         duplicate_type,
         created_at
       FROM duplicate_logs 
       WHERE batch_id = $1 
       ORDER BY created_at DESC`,
      [batchId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching duplicate logs:", err);
    res.status(500).json({ message: "Error fetching duplicate logs" });
  }
};


// Get all duplicate logs with pagination
export const getAllDuplicateLogs = async (req, res) => {
  const { page = 1, limit = 50, search = '', type = '' } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = `
      SELECT 
        log_id,
        batch_id,
        source_name,
        customer_name,
        mobile,
        email,
        address,
        existing_batch_id,
        existing_source_name,
        duplicate_type,
        created_at
      FROM duplicate_logs 
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (search) {
      query += ` AND (customer_name ILIKE $${paramCount} OR mobile ILIKE $${paramCount} OR source_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    if (type) {
      query += ` AND duplicate_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM duplicate_logs 
      WHERE 1=1 
      ${search ? `AND (customer_name ILIKE '%${search}%' OR mobile ILIKE '%${search}%' OR source_name ILIKE '%${search}%')` : ''}
      ${type ? `AND duplicate_type = '${type}'` : ''}
    `;
    
    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery)
    ]);
    
    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    });
  } catch (err) {
    console.error("Error fetching all duplicate logs:", err);
    res.status(500).json({ message: "Error fetching duplicate logs" });
  }
};




export const getDuplicateCount = async (req, res) => {
  const { batchId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count 
       FROM duplicate_logs 
       WHERE batch_id = $1`,
      [batchId]
    );
    
    res.json({
      count: parseInt(result.rows[0].count)
    });
  } catch (err) {
    console.error("Error fetching duplicate count:", err);
    res.status(500).json({ 
      message: "Error fetching duplicate count",
      count: 0
    });
  }
};



// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Optional: Add this function to handle different date formats
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // Try different date formats
  const formats = [
    'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD',
    'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY/MM/DD'
  ];
  
  for (const format of formats) {
    const parsed = moment(dateStr, format, true);
    if (parsed.isValid()) {
      return parsed.toDate();
    }
  }
  
  return null;
}



// export async function getBatches(req, res) {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM batches ORDER BY created_at DESC"
//     );
//     res.json(result.rows); // rows is inside result
//   } catch (err) {
//     console.error("Error fetching batches:", err);
//     res.status(500).json({ message: "Error fetching batches" });
//   }
// }

export async function getBatches(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        (
          SELECT COUNT(*) 
          FROM customers 
          WHERE batch_id = b.batch_id 
          AND status = 'Pending'
        ) as pending_count
      FROM batches b
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ message: "Error fetching batches" });
  }
}


export async function getCustomersByBatch(req, res) {
  try {
    const { batchId } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE batch_id = $1",
      [batchId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ message: "Error fetching customers" });
  }
}


// export async function getCustomers(req, res) {
  
//   try {
//     const query = `
//       SELECT 
//         c.*, 
//         b.source_name,
//         u.name AS assigned_to_name,
//         c.comment,
//         c.batch_id
//       FROM customers c
//       LEFT JOIN batches b 
//         ON c.batch_id = b.batch_id
//       LEFT JOIN users u
//         ON c.assigned_to = u.id
//       LEFT JOIN customer_notes cn  
//         ON c.id = cn.customer_id
//       ORDER BY c.id DESC
//     `;

//     const result = await pool.query(query);
//     res.json(result.rows);
//   } catch (error) {
//     console.error(
//       "Error fetching customers with source name and assigned user:",
//       error
//     );
//     res.status(500).json({ message: "Server error" });
//   }
// }



export async function getCustomers(req, res) {
  try {
    const query = `
      SELECT 
        c.*, 
        c.id,
        c.name,
        c.email,
        c.mobile,
        c.comment,
        c.batch_id,
        b.source_name,
        u.name AS assigned_to_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', cn.id,
              'note', cn.notes,
              'customerid', cn.customer_id
            )
          ) FILTER (WHERE cn.id IS NOT NULL),
          '[]'
        ) AS customer_notes
      FROM customers c
      LEFT JOIN batches b 
        ON c.batch_id = b.batch_id
      LEFT JOIN users u
        ON c.assigned_to = u.id
      LEFT JOIN customer_notes cn  
        ON c.id = cn.customer_id
      GROUP BY c.id, b.source_name, u.name
      ORDER BY c.id DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(
      "Error fetching customers with notes:",
  
      error.message,  
      error.stack
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
}






export const getAssignedCustomers = async (req, res) => {
  try {
    const { assigned_to } = req.query;

    if (!assigned_to) {
      return res.status(400).json({ message: "assigned_to is required" });
    }

    const result = await pool.query(
      `SELECT customer_id, name, mobile, address, status, followup_datetime,comment,batch_id
       FROM assining_customers 
       WHERE assigned_to = $1`,
      [assigned_to]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching assigned customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const changeStatus = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id, 10);
//     console.log("Updating status for customer ID:", id);

//     if (!id) {
//       return res.status(400).json({ success: false, error: "Invalid or missing customer ID" });
//     }

//     const { status, updated_by_id, updated_by_name, followup_datetime, customer_id, statusid } = req.body;

//     // Only keep followup_datetime if status is Demo or Follow Up
//     const finalDateTime =
//       status === "Demo" || status === "Follow Up" ? followup_datetime : null;

//     // ✅ Update customers table with updated_at
//     await pool.query(
//       `UPDATE customers 
//        SET status = $1, followup_datetime = $2, updated_at = NOW() , status_id=$3
//        WHERE id =$4`,
//       [status, finalDateTime,statusid ,id ]
//     );

//     // ✅ Update assining_customers table with updated_at
//     await pool.query(
//       `UPDATE assining_customers 
//        SET status = $1, followup_datetime = $2, updated_at = NOW() , status_id=$3
//        WHERE customer_id =$4 `,
//       [status, finalDateTime,  statusid , id ] 
//     );

//     // Fetch updated customer
//     const result = await pool.query(
//       `SELECT id, name, email, mobile, address, status, followup_datetime , status_id
//        FROM customers 
//        WHERE id = $1`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: "Customer not found" });
//     }

//     const customer = result.rows[0];

//     // Insert into lead_history
//     await pool.query(
//       `INSERT INTO lead_history 
//        (name, email, mobile, address, status, followup_datetime, customer_id, created_at, updated_at, updated_by_id, updated_by,status_id) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9 ,$10)`,
//       [
//         customer.name,
//         customer.email,
//         customer.mobile,
//         customer.address,
//         customer.status,
//         customer.followup_datetime,
//         customer_id,
//         updated_by_id,
//         updated_by_name,
//         statusid,
//       ]
//     );

//     res.json({
//       success: true,
//       message: "Status & Date/Time updated and history recorded!",
//     });
//   } catch (err) {
//     console.error("Error updating status:", err);
//     res.status(500).json({ success: false, error: "Failed to update status" });
//   }
// };

export const changeStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log("Updating status for customer ID:", id);

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or missing customer ID" });
    }


    


    const {
      status,
      updated_by_id,
      updated_by_name,
      followup_datetime,
      customer_id,
      statusid,
      comment,
      batch_id
    } = req.body;


     if (!batch_id) {
      return res
        .status(400)
        .json({ success: false, error: "Batch ID is required" });
    }



    const finalDateTime =
      status === "Demo" || status === "Follow Up" ? followup_datetime : null;

    await pool.query(
      `UPDATE customers 
       SET status = $1, followup_datetime = $2, updated_at = NOW(), status_id = $3, comment = $4
       WHERE id = $5`,
      [status, finalDateTime, statusid, comment || null, id]
    );

    await pool.query(
      `UPDATE assining_customers 
       SET status = $1, followup_datetime = $2, updated_at = NOW(), status_id = $3, comment = $4
       WHERE customer_id = $5`,
      [status, finalDateTime, statusid, comment || null, id]
    );

    const result = await pool.query(
      `SELECT id, name, email, mobile, address, status, followup_datetime, status_id, comment
       FROM customers 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    const customer = result.rows[0];

    await pool.query(
      `INSERT INTO lead_history 
       (name, email, mobile, address, status, followup_datetime, customer_id, created_at, updated_at, updated_by_id, updated_by, status_id, comment,batch_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8, $9, $10, $11,$12)`,
      [
        customer.name,
        customer.email,
        customer.mobile,
        customer.address,
        customer.status,
        customer.followup_datetime,
        customer_id,
        updated_by_id,
        updated_by_name,
        statusid,
        comment|| null,
        batch_id
      ]
    );

    res.json({
      success: true,
      message: "Status, Date/Time & Comment updated and history recorded!",
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, error: "Failed to update status" });
  }
};


// export const leadData = async (req, res) => {
//   try {
   

//     const result = await pool.query(`
//   SELECT lh.*, ac.*
//   FROM lead_history lh
//   INNER JOIN (
//       SELECT name, address, mobile, MAX(id) AS max_id
//       FROM lead_history
//       GROUP BY name, address, mobile
//   ) AS uniq
//     ON lh.id = uniq.max_id
//   INNER JOIN assining_customers ac
//     ON lh.customer_id = ac.customer_id
// `);


//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error("Error getting data:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const leadData = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        lh.*, 
        ac.*,
        b.* 
      FROM lead_history lh
      INNER JOIN (
          SELECT name, address, mobile, MAX(id) AS max_id
          FROM lead_history
          GROUP BY name, address, mobile
      ) AS uniq
        ON lh.id = uniq.max_id
      INNER JOIN assining_customers ac
        ON lh.customer_id = ac.customer_id
      LEFT JOIN batches b
        ON ac.batch_id = b.batch_id
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error getting data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const dashboardBoxData = async (req, res) => {
  try {
    const query = `
      SELECT employee_name, status
      FROM assining_customers
      WHERE status = ANY($1)
      ORDER BY employee_name;
    `;

    const statuses = ['Pending', 'Demo', 'Follow Up', 'Not Picked Call', 'Deal','Interested'];

    const result = await pool.query(query, [statuses]);

    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const dashboardBoxDataUser = async (req, res) => {
   const {id}=req.params
  try {
    const query = `
      SELECT employee_name, status
      FROM assining_customers
      WHERE status = ANY($1) AND assigned_to=$2
      ORDER BY employee_name;
    `;

    const statuses = ['Pending', 'Demo', 'Follow Up', 'Not Picked Call', 'Deal','Interested'];

    const result = await pool.query(query, [statuses,id]);

    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};





// export const getLeadHistoryByCustomerId = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const customerResult = await pool.query(
//       `SELECT customer_id 
//        FROM lead_history 
//        WHERE customer_id = $1 
//        LIMIT 1`,
//       [id]
//     );

//     if (customerResult.rows.length === 0) {
//       return res.status(404).json({ message: "Record not found" });
//     }

//     const query = `
//       SELECT 
        // id,
        // name,
        // email,
        // mobile,
        // address,
        // status,
        // updated_by,
        // created_at,
        // updated_at,
        // customer_id,
        // comment,
//         followup_datetime
//       FROM lead_history
//       WHERE customer_id = $1
//       ORDER BY created_at DESC
//     `;

//     const result = await pool.query(query, [id]);

//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching lead history:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const getLeadHistoryByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Lead History
    const leadResult = await pool.query(
      `SELECT 
         id,
        name,
        email,
        mobile,
        address,
        status,
        updated_by,
        created_at,
        updated_at,
        customer_id,
        comment,
        followup_datetime
       FROM lead_history
       WHERE customer_id = $1`,
      [id]
    );

    // ✅ Customer Notes
    const notesResult = await pool.query(
      `SELECT 
        id,
        notes,
        customer_id
       FROM customer_notes
       WHERE customer_id = $1`,
      [id]
    );

    // 🟢 Leads map karo
    const leads = leadResult.rows.map(l => ({
      ...l,
      type: "lead"
    }));

    // 🟢 Notes flatten karo (agar JSON array hai to parse karo)
    const notes = [];
    notesResult.rows.forEach(n => {
      let parsedNotes = [];
      try {
        parsedNotes = Array.isArray(n.notes) ? n.notes : JSON.parse(n.notes);
      } catch (err) {
        console.error("Error parsing notes JSON:", err);
      }

      parsedNotes.forEach(singleNote => {
        notes.push({
          note: singleNote.text || singleNote.note || singleNote, // adjust field name
          created_at: singleNote.created_at,
          updatedby_name: singleNote.updatedby_name,
          updatedby_id: singleNote.updatedby_id,
          customer_id: n.customer_id,
          note_id: n.id,
          type: "note"
        });
      });
    });

    // 🟢 Merge aur sort by created_at DESC
    const timeline = [...leads, ...notes].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.json({ lead_history: timeline });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




export const getName = async (req, res) => {
  try {
    const query = `
      SELECT id, name, mobile, address, email
      FROM customers
      ORDER BY id DESC
    `;

    const result = await pool.query(query); // returns { rows, rowCount }

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ================================= add bank details =================================


export const addBankDetails = async (req, res) => {
  try {
    const { clientId, mobile, address, bankName, accountNumber, ifsc,accountholdername } = req.body;

    if (!clientId || !bankName || !accountNumber || !ifsc || !accountholdername) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if client already has a bank record
    const { rows } = await pool.query(
      `SELECT bank_details FROM bank_master WHERE client_id = $1`,
      [clientId]
    );

    const newBank = {
      bankName,
      accountholdername,
      accountNumber,
      ifsc,
      mobile: mobile || null,
      address: address || null,
      addedAt: new Date()
    };

    if (rows.length > 0) {
      // Append new bank entry to existing JSONB array
      const updatedBanks = [...rows[0].bank_details, newBank];

      await pool.query(
        `UPDATE bank_master 
         SET bank_details = $1::jsonb, updated_at = NOW()
         WHERE client_id = $2`,
        [JSON.stringify(updatedBanks), clientId] // stringify here
      );
    } else {
      // Create new row with first bank entry
      await pool.query(
        `INSERT INTO bank_master (client_id, bank_details, created_at, updated_at)
         VALUES ($1, $2::jsonb, NOW(), NOW())`,
        [clientId, JSON.stringify([newBank])] // stringify array
      );
    }

    res.status(201).json({ message: "Bank details saved successfully" });
  } catch (error) {
    console.error("Error adding bank details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





// =================================== get bank details ===================================

export const getBankDetails = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ message: "clientId is required" });
    }

    const { rows } = await pool.query(
      `SELECT bank_details 
       FROM bank_master 
       WHERE client_id = $1`,
      [clientId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No bank details found for this client" });
    }

    // rows[0].bank_details is already JSONB, no need to parse
    res.status(200).json(rows[0].bank_details);
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================= EARNING FORM DATA =======================

export const earning = async (req, res) => {
  try {
    const { clientId, name, amount, bank, mobile, comment, receivedDate } = req.body;

    if (!clientId || !name || !amount || !bank || !mobile  || !receivedDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newEarning = {
      name,
      amount,
      bank,
      mobile,
      comment: comment || null,
      receivedDate
    };
    const existingRes = await pool.query(
      "SELECT earnings_list FROM earnings WHERE client_id = $1",
      [clientId]
    );

    if (existingRes.rows.length > 0) {
      const updatedEarnings = [
        ...existingRes.rows[0].earnings_list,
        newEarning
      ];

      const updateQuery = `
                UPDATE earnings
                SET earnings_list = $1::jsonb, updated_at = NOW()
                WHERE client_id = $2
                RETURNING *
            `;
      const { rows } = await pool.query(updateQuery, [JSON.stringify(updatedEarnings), clientId]);
      return res.status(200).json({ message: "Earning appended successfully", earning: rows[0] });
    } else {
      const insertQuery = `
                INSERT INTO earnings (client_id, earnings_list)
                VALUES ($1, $2::jsonb)
                RETURNING *
            `;
      const { rows } = await pool.query(insertQuery, [clientId, JSON.stringify([newEarning])]);
      return res.status(201).json({ message: "Earning added successfully", earning: rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==================== Status Data id wise month wise ====================


// getStatusByDataForEmployee -----------------old ---------------------getStatusByDataForEmployee


// getStatusByDataForEmployee -----------------new---------------------getStatusByDataForEmployee




// export const getStatusByDataForEmployee = async (req, res) => {
//   try {
//     const { start, end, month } = req.query;

//     let startDate, endDate;

//     if (start && end) {
//       startDate = new Date(start);
//       endDate = new Date(end);
//       endDate.setDate(endDate.getDate() + 1);
//     } else if (month) {
//       const currentMonth = new Date(month);
//       startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//       endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
//     } else {
//       const now = new Date();
//       startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//       endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//     }

 
//     const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
//     const statuses = statusRes.rows;

//     const sanitizeColumnName = (name, id) => {
//   if (!name || name.trim() === "") {
//     return `status_${id}`;
//   }
  
//   return name.replace(/[^a-zA-Z0-9_]/g, "_");
// };

// const countColumns = statuses
//   .map(
//     (s) =>
//       `SUM(CASE WHEN ac.status_id = ${s.id} THEN 1 ELSE 0 END) AS "${sanitizeColumnName(
//         s.name,
//         s.id
//       )}"`
//   )
//   .join(",\n");


//     // 3. Query with LEFT JOIN (so missing statuses still give 0)
//     const query = `
//       SELECT
//         ac.assigned_to,
//         ac.employee_name,
//         DATE_TRUNC('month', ac.updated_at) AS month,
//         ${countColumns}
//       FROM assining_customers ac
//       WHERE ac.updated_at >= $1
//         AND ac.updated_at < $2
//       GROUP BY ac.assigned_to, ac.employee_name, month
//       ORDER BY month, ac.assigned_to;
//     `;

//     const { rows } = await pool.query(query, [startDate, endDate]);

//     res.json({ success: true, data: rows, statuses });
//   } catch (err) {
//     console.error("Error in getStatusByDataForEmployee:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


export const getStatusByDataForEmployee = async (req, res) => {
  try {
    const { start, end, month } = req.query;

    let startDate, endDate;

    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);
    } else if (month) {
      const currentMonth = new Date(month);
      startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // Fetch statuses
    const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
    const statuses = statusRes.rows;

    // Sanitize column name
    const sanitizeColumnName = (name, id) => {
      if (!name || name.trim() === "") {
        return `status_${id}`;
      }
      return name.replace(/[^a-zA-Z0-9_]/g, "_");
    };

    // Dynamic status count columns
    const countColumns = statuses
      .map(
        (s) =>
          `SUM(CASE WHEN ac.status_id = ${s.id} THEN 1 ELSE 0 END) AS "${sanitizeColumnName(
            s.name,
            s.id
          )}"`
      )
      .join(",\n");

    // ✅ Add total leads count column
    const totalLeadColumn = `COUNT(ac.id) AS "TOTAL_LEAD"`;

    // Final Query
    const query = `
      SELECT
        ac.assigned_to,
        ac.employee_name,
        DATE_TRUNC('month', ac.updated_at) AS month,
        ${totalLeadColumn},
        ${countColumns}
      FROM assining_customers ac
      WHERE ac.updated_at >= $1
        AND ac.updated_at < $2
      GROUP BY ac.assigned_to, ac.employee_name, month
      ORDER BY month, ac.assigned_to;
    `;

    const { rows } = await pool.query(query, [startDate, endDate]);

    res.json({ success: true, data: rows, statuses });
  } catch (err) {
    console.error("Error in getStatusByDataForEmployee:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};











// getStatusByDataForEmployee -----------------new ---------------------getStatusByDataForEmployee







// const sanitizeColumnName = (name, id) => {
//   if (!name || name.trim() === "") {
//     return `status_${id}`; // fallback name
//   }
//   // Non-alphanumeric ko "_" me convert
//   return name.replace(/[^a-zA-Z0-9_]/g, "_");
// };


// export const getStatusByDataForEmployeeCurrentDate = async (req, res) => {
//   try {
//     // 1. Get statuses
//     const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
//     const statuses = statusRes.rows;

//     // 2. Build dynamic status count columns
//     const countColumns = statuses
//       .map(
//         (s) =>
//           `COUNT(*) FILTER (WHERE ac.status_id = ${s.id}) AS "${sanitizeColumnName(
//             s.name,
//             s.id
//           )}"`
//       )
//       .join(",\n");

  
//    const query = `
//   SELECT
//     u.id AS assigned_to,
//     COALESCE(ac.employee_name, u.name) || ' - ' || u.email || ' - ' || u.mobile AS employee,
//     TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') AS date,

  
//     ${countColumns},

    
//     (SELECT COUNT(*) 
//      FROM assining_customers ac3 
//      WHERE ac3.assigned_to = u.id 
//        AND ac3.status = 'Pending') AS total_pending,

   
//     (SELECT COUNT(*) 
//      FROM assining_customers ac2 
//      WHERE ac2.assigned_to = u.id 
//        AND ac2.status_id IS NOT NULL) AS total_lead

//   FROM users u
//   LEFT JOIN assining_customers ac
//     ON ac.assigned_to = u.id
//    AND ac.updated_at::date = CURRENT_DATE  
//    AND ac.status_id IS NOT NULL
//   WHERE u.id IN (SELECT DISTINCT assigned_to FROM assining_customers) 
//   GROUP BY 
//     u.id, u.name, u.email, u.mobile, ac.employee_name
//   ORDER BY date, u.id;
// `;



//     const { rows } = await pool.query(query);

//     res.json({ success: true, data: rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };





const sanitizeColumnName = (name, id) => {
  if (!name || name.trim() === "") {
    return `status_${id}`; // fallback name
  }
  // Non-alphanumeric ko "_" me convert
  return name.replace(/[^a-zA-Z0-9_]/g, "_");
};

export const getStatusByDataForEmployeeCurrentDate = async (req, res) => {
  try {
    // 1. Get statuses
    const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
    const statuses = statusRes.rows;

    // 2. Build dynamic status count columns
    const countColumns = statuses
      .map(
        (s) =>
          `COUNT(*) FILTER (WHERE ac.status_id = ${s.id}) AS "${sanitizeColumnName(
            s.name,
            s.id
          )}"`
      )
      .join(",\n");

    // 3. Query with total_today excluding Pending
    const query = `
      SELECT
        u.id AS assigned_to,
        COALESCE(ac.employee_name, u.name) || ' - ' || u.email || ' - ' || u.mobile AS employee,
        TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') AS date,

        ${countColumns},

        -- 👇 total without Pending
        COUNT(*) FILTER (WHERE ac.status_id IS NOT NULL AND ac.status != 'Pending') AS total_today,

        (SELECT COUNT(*) 
         FROM assining_customers ac3 
         WHERE ac3.assigned_to = u.id 
           AND ac3.status = 'Pending') AS total_pending,

        (SELECT COUNT(*) 
         FROM assining_customers ac2 
         WHERE ac2.assigned_to = u.id 
           AND ac2.status_id IS NOT NULL) AS total_lead

      FROM users u
      LEFT JOIN assining_customers ac
        ON ac.assigned_to = u.id
       AND ac.updated_at::date = CURRENT_DATE  
       AND ac.status_id IS NOT NULL
      WHERE u.id IN (SELECT DISTINCT assigned_to FROM assining_customers) 
      GROUP BY 
        u.id, u.name, u.email, u.mobile, ac.employee_name
      ORDER BY date, u.id;
    `;

    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};



// =============================last status pending==========================

// const sanitizeColumnNamenew = (name, id) => {
//   if (!name || name.trim() === "") {
//     return `status_${id}`; // fallback name
//   }
//   // Non-alphanumeric ko "_" me convert
//   return name.replace(/[^a-zA-Z0-9_]/g, "_");
// };

// export const getStatusByDataForEmployeeCurrentDateNew = async (req, res) => {
//   try {
//     // 1. Get statuses
//     const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
//     const statuses = statusRes.rows;

//     // 2. Build dynamic status count columns - ONLY for single entry leads
//     const countColumns = statuses
//       .map(
//         (s) =>
//           `COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status_id = ${s.id} THEN ac.mobile ELSE NULL END) AS "${sanitizeColumnNamenew(
//             s.name,
//             s.id
//           )}"`
//       )
//       .join(",\n");

//     // 3. Query with only single entry leads
//     const query = `
//       SELECT
//         u.id AS assigned_to,
//         COALESCE(ac.employee_name, u.name) || ' - ' || u.email || ' - ' || u.mobile AS employee,
//         TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') AS date,

//         ${countColumns},

//         -- 👇 total without Pending (single entry only)
//         COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status_id IS NOT NULL AND ac.status != 'Pending' THEN ac.mobile ELSE NULL END) AS total_today,

//         -- 👇 total pending (single entry only)
//         COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status = 'Pending' THEN ac.mobile ELSE NULL END) AS total_pending,

//         -- 👇 total lead (single entry only)
//         COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status_id IS NOT NULL THEN ac.mobile ELSE NULL END) AS total_lead

//       FROM users u
//       LEFT JOIN assining_customers ac
//         ON ac.assigned_to = u.id
//        AND ac.updated_at::date = CURRENT_DATE  
//        AND ac.status_id IS NOT NULL
//       LEFT JOIN (
//         -- Subquery to count entries per mobile in lead_history
//         SELECT mobile, COUNT(*) as lead_count
//         FROM lead_history 
//         GROUP BY mobile
//       ) lh ON ac.mobile = lh.mobile
//       WHERE u.id IN (SELECT DISTINCT assigned_to FROM assining_customers) 
//       GROUP BY 
//         u.id, u.name, u.email, u.mobile, ac.employee_name
//       ORDER BY date, u.id;
//     `;

//     const { rows } = await pool.query(query);
//     res.json({ success: true, data: rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


const sanitizeColumnNamenew = (name, id) => {
  if (!name || name.trim() === "") {
    return `status_${id}`; // fallback name
  }
  // Non-alphanumeric ko "_" me convert
  return name.replace(/[^a-zA-Z0-9_]/g, "_");
};

export const getStatusByDataForEmployeeCurrentDateNew = async (req, res) => {
  try {
    // 1. Get statuses
    const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
    const statuses = statusRes.rows;

    // 2. Dynamic columns
    const countColumns = statuses
      .map(
        (s) =>
          `COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status_id = ${s.id} THEN ac.mobile ELSE NULL END) AS "${sanitizeColumnNamenew(
            s.name,
            s.id
          )}"`
      )
      .join(",\n");

    // 3. Main query
    const innerQuery = `
      SELECT
        u.id AS assigned_to,
        COALESCE(ac.employee_name, u.name) || ' - ' || u.email || ' - ' || u.mobile AS employee,
        TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') AS date,

        ${countColumns},

        COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status_id IS NOT NULL AND ac.status != 'Pending' THEN ac.mobile ELSE NULL END) AS total_today,
        COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status = 'Pending' THEN ac.mobile ELSE NULL END) AS total_pending,
        COUNT(DISTINCT CASE WHEN lh.lead_count = 1 AND ac.status_id IS NOT NULL THEN ac.mobile ELSE NULL END) AS total_lead

      FROM users u
      LEFT JOIN assining_customers ac
        ON ac.assigned_to = u.id
       AND ac.updated_at::date = CURRENT_DATE  
       AND ac.status_id IS NOT NULL
      LEFT JOIN (
        SELECT mobile, COUNT(*) as lead_count
        FROM lead_history 
        GROUP BY mobile
      ) lh ON ac.mobile = lh.mobile
      WHERE u.id IN (SELECT DISTINCT assigned_to FROM assining_customers) 
      GROUP BY 
        u.id, u.name, u.email, u.mobile, ac.employee_name
    `;

    // 4. Filter rows where all counts are zero
    const havingConditions = [
      ...statuses.map(
        (s) => `"${sanitizeColumnNamenew(s.name, s.id)}" > 0`
      ),
      `total_today > 0`,
      `total_pending > 0`,
      `total_lead > 0`,
    ].join(" OR ");

    const finalQuery = `
      SELECT * FROM (
        ${innerQuery}
      ) AS t
      WHERE ${havingConditions}
      ORDER BY date, assigned_to;
    `;

    // Execute
    const { rows } = await pool.query(finalQuery);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

//  =========================== daily Demo ===========================

export const getDailyDemos = async (req, res) => {
  try {
    const query = `
SELECT 
          TO_CHAR(followup_datetime::date, 'YYYY-MM-DD') AS demo_date,
          COUNT(*) AS total_demos,
          JSON_AGG(
              JSON_BUILD_OBJECT(
                  'id', id,
                  'name', name,
                  'mobile', mobile,
                  'assigned_to', assigned_to,
                  'employee_name', employee_name,
                  'status', status,
                  'followup_datetime', followup_datetime
              )
          ) AS demo_data
      FROM assining_customers
      WHERE status = 'Demo'
      GROUP BY followup_datetime::date
      ORDER BY demo_date;
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching daily demos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// ============================= earning data =============================

export const earningData = async (req, res) => {
  try {
    const query = `
      SELECT * FROM earnings
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching earnings data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




export const batchDelete = async (req, res) => {
  try {
    const { batchId } = req.params;



    if (!batchId) {
      return res.status(400).json({ error: "Batch ID is required" });
    }

    // Delete customers by batch_id
    const result = await pool.query(
      "DELETE FROM customers WHERE batch_id = $1 RETURNING *",
      [batchId]
    );


    const resultss = await pool.query(
      "DELETE FROM assining_customers WHERE batch_id = $1 RETURNING *",
      [batchId]
    );


    const results = await pool.query(
      "DELETE FROM batches WHERE batch_id = $1 RETURNING *",
      [batchId]
    );

    const resultsss = await pool.query(
      "DELETE FROM lead_history WHERE batch_id = $1 RETURNING *",
      [batchId]
    );


    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No customers found for this batch" });
    }

    res.json({
      message: "Batch deleted successfully",
      deletedCount: result.rowCount,
    });
  } catch (err) {
    console.error("Error deleting batch:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const getLeadHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    const query = `
      SELECT *
      FROM lead_history
      WHERE customer_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [customerId]);

    if (result.rows.length > 0) {
      res.status(200).json({ data: result.rows });
    } else {
      res.status(404).json({ message: "No history found for this customer" });
    }
  } catch (err) {
    console.error("Error fetching lead history:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};






// export const getStatusByDataForSourceDaily = async (req, res) => {
//   try {
//     // 🧱 Fetch all statuses
//     const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
//     const statuses = statusRes.rows;

//     // Sanitize column names
//     const sanitizeColumnName = (name, id) => {
//       if (!name || name.trim() === "") return `status_${id}`;
//       return name.replace(/[^a-zA-Z0-9_]/g, "_");
//     };

//     // 🧮 Dynamic columns for each status
//     const countColumns = statuses
//       .map(
//         (s) =>
//           `SUM(CASE WHEN ac.status_id = ${s.id} THEN 1 ELSE 0 END) AS "${sanitizeColumnName(
//             s.name,
//             s.id
//           )}"`
//       )
//       .join(",\n");

//     // 🧠 Main Query - per source_name (no date filter)
//     const query = `
//       SELECT
//         b.source_name,
//         ${countColumns}
//       FROM assining_customers ac
//       LEFT JOIN batches b ON ac.batch_id = b.batch_id
//       GROUP BY b.source_name
//       ORDER BY b.source_name;
//     `;

//     const { rows } = await pool.query(query);

//     res.json({
//       success: true,
//       data: rows,
//       statuses,
//     });
//   } catch (err) {
//     console.error("Error in getStatusByDataForSourceDaily:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };



export const getStatusByDataForSourceDaily = async (req, res) => {
  try {
    // 🧱 Fetch all statuses
    const statusRes = await pool.query("SELECT id, name FROM status_master ORDER BY id");
    const statuses = statusRes.rows;

    // 🧼 Sanitize column names
    const sanitizeColumnName = (name, id) => {
      if (!name || name.trim() === "") return `status_${id}`;
      return name.replace(/[^a-zA-Z0-9_]/g, "_");
    };

    // 🧮 Dynamic columns for each status
    const countColumns = statuses
      .map(
        (s) =>
          `SUM(CASE WHEN ac.status_id = ${s.id} THEN 1 ELSE 0 END) AS "${sanitizeColumnName(
            s.name,
            s.id
          )}"`
      )
      .join(",\n");

    // ✅ Add total leads count column
    const totalLeadColumn = `COUNT(ac.id) AS "TOTAL_LEAD"`;

    // 🧠 Main Query - per source_name (no date filter)
    const query = `
      SELECT
        b.source_name,
        ${totalLeadColumn},
        ${countColumns}
      FROM assining_customers ac
      LEFT JOIN batches b ON ac.batch_id = b.batch_id
      GROUP BY b.source_name
      ORDER BY b.source_name;
    `;

    const { rows } = await pool.query(query);

    res.json({
      success: true,
      data: rows,
      statuses,
    });
  } catch (err) {
    console.error("Error in getStatusByDataForSourceDaily:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};





export const getUsers = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT assigned_to as user_id, employee_name 
      FROM assining_customers 
      WHERE assigned_to IS NOT NULL 
      ORDER BY employee_name
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};






export const getDailyDemoUser = async (req, res) => {
  try {
    const { userId } = req.query;

    const params = [];
    let userFilter = '';

    if (userId && userId !== 'all') {
      userFilter = `AND lh.updated_by_id = $1`;
      params.push(userId);
    }

    const query = `
      WITH date_series AS (
        SELECT generate_series(
          (CURRENT_DATE - interval '29 days'),
          CURRENT_DATE,
          interval '1 day'
        )::date AS demo_date
      ),

      -- 🟢 demo/followup data from assining_customers
      daily_demo_followup AS (
        SELECT 
          followup_datetime::date AS demo_date,
          COUNT(*) AS total_all,
          COUNT(*) FILTER (WHERE status = 'Demo') AS total_demos,
          COUNT(*) FILTER (WHERE status = 'Follow Up') AS total_followups
        FROM assining_customers
        WHERE status IN ('Demo', 'Follow Up')
        ${userId && userId !== 'all' ? `AND assigned_to = $1` : ''}
        GROUP BY followup_datetime::date
      ),

      -- 🟠 unique leads worked on per day from lead_history
      daily_worked_leads AS (
        SELECT 
          updated_at::date AS work_date,
          COUNT(DISTINCT mobile) AS total_worked
        FROM lead_history lh
        WHERE updated_at::date >= (CURRENT_DATE - interval '29 days')
        ${userFilter}
        GROUP BY updated_at::date
      )

      SELECT 
        TO_CHAR(ds.demo_date, 'YYYY-MM-DD') AS demo_date,
        COALESCE(ddf.total_all, 0) AS total_all,
        COALESCE(ddf.total_demos, 0) AS total_demos,
        COALESCE(ddf.total_followups, 0) AS total_followups,
        COALESCE(dwl.total_worked, 0) AS total_worked
      FROM date_series ds
      LEFT JOIN daily_demo_followup ddf ON ds.demo_date = ddf.demo_date
      LEFT JOIN daily_worked_leads dwl ON ds.demo_date = dwl.work_date
      ORDER BY ds.demo_date ASC;
    `;

    const { rows } = await pool.query(query, params);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error fetching daily demos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




export const getMonthlyDeals = async (req, res) => {
    try {
        const { userId, year = new Date().getFullYear() } = req.query;

        const params = [year];
        let userFilter = '';

        if (userId && userId !== 'all') {
            userFilter = `AND ac.assigned_to = $2`;
            params.push(userId);
        }

        // Direct customers table se count karein
        const query = `
            SELECT 
                TO_CHAR(c.updated_at, 'Month') AS month,
                EXTRACT(YEAR FROM c.updated_at) AS year,
                COUNT(*) AS total_deals
            FROM customers c
            LEFT JOIN assining_customers ac ON c.id = ac.customer_id
            WHERE c.status = 'Deal'
                AND EXTRACT(YEAR FROM c.updated_at) = $1
                ${userFilter}
            GROUP BY TO_CHAR(c.updated_at, 'Month'), EXTRACT(YEAR FROM c.updated_at)
            ORDER BY MIN(EXTRACT(MONTH FROM c.updated_at));
        `;

        const { rows } = await pool.query(query, params);
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const allMonthsData = monthNames.map((month, index) => {
            const foundRow = rows.find(row => row.month.trim() === month);
            return {
                month: month,
                year: parseInt(year),
                total_deals: foundRow ? parseInt(foundRow.total_deals) : 0
            };
        });

        res.status(200).json(allMonthsData);

    } catch (error) {
        console.error('Error fetching monthly deals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getMonthlyDealDetails = async (req, res) => {
    try {
        const { userId, year = new Date().getFullYear() } = req.query;

        const params = [year];
        let userFilter = '';

        if (userId && userId !== 'all') {
            userFilter = `AND ac.assigned_to = $2`;
            params.push(userId);
        }

        // Pehle monthly counts nikalte hain
        const countQuery = `
            SELECT 
                TO_CHAR(c.updated_at, 'Month') AS month,
                EXTRACT(YEAR FROM c.updated_at) AS year,
                COUNT(*) AS total_deals
            FROM customers c
            LEFT JOIN assining_customers ac ON c.id = ac.customer_id
            WHERE c.status = 'Deal'
                AND EXTRACT(YEAR FROM c.updated_at) = $1
                ${userFilter}
            GROUP BY TO_CHAR(c.updated_at, 'Month'), EXTRACT(YEAR FROM c.updated_at)
            ORDER BY MIN(EXTRACT(MONTH FROM c.updated_at));
        `;

        const { rows: countRows } = await pool.query(countQuery, params);
        
        // Ab har month ke leads ka complete data nikalte hain
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const allMonthsData = await Promise.all(
            monthNames.map(async (month, index) => {
                const foundRow = countRows.find(row => row.month.trim() === month);
                const totalDeals = foundRow ? parseInt(foundRow.total_deals) : 0;
                
                // Agar deals hain to leads ka data fetch karo
                let leads = [];
                if (totalDeals > 0) {
                    const monthNumber = index + 1;
                    
                    const leadsQuery = `
                        SELECT 
                            c.id,
                            c.name,
                            
                            c.email,
                            c.mobile,
                            c.updated_at,
                            u.name as assigned_user_name,
                            c.status,
                            c.created_at
                        FROM customers c
                        LEFT JOIN assining_customers ac ON c.id = ac.customer_id
                        LEFT JOIN users u ON ac.assigned_to = u.id
                        WHERE c.status = 'Deal'
                            AND EXTRACT(MONTH FROM c.updated_at) = $1
                            AND EXTRACT(YEAR FROM c.updated_at) = $2
                            ${userFilter ? 'AND ac.assigned_to = $3' : ''}
                        ORDER BY c.updated_at DESC;
                    `;
                    
                    const leadsParams = userFilter ? [monthNumber, year, userId] : [monthNumber, year];
                    const { rows: leadRows } = await pool.query(leadsQuery, leadsParams);
                    leads = leadRows;
                }
                
                return {
                    month: month,
                    year: parseInt(year),
                    total_deals: totalDeals,
                    leads: leads
                };
            })
        );

        res.status(200).json(allMonthsData);

    } catch (error) {
        console.error('Error fetching monthly deals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// export const getDailyDemoUser = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     let query = `
//       SELECT 
//         TO_CHAR(followup_datetime::date, 'YYYY-MM-DD') AS demo_date,
//         COUNT(*) AS total_all,
//         COUNT(*) FILTER (WHERE status = 'Demo') AS total_demos,
//         COUNT(*) FILTER (WHERE status = 'Follow Up') AS total_followups,
//         COUNT(*) FILTER (WHERE status = 'Worked') AS total_worked,
//         JSON_AGG(
//           JSON_BUILD_OBJECT(
//             'id', id,
//             'name', name,
//             'mobile', mobile,
//             'assigned_to', assigned_to,
//             'employee_name', employee_name,
//             'status', status,
//             'followup_datetime', followup_datetime
//           ) ORDER BY followup_datetime DESC
//         ) AS demo_data
//       FROM assining_customers
//       WHERE status IN ('Demo', 'Follow Up', 'Worked')
//     `;

//     if (userId && userId !== 'all') {
//       query += ` AND assigned_to = $1`;
//     }

//     query += ` GROUP BY followup_datetime::date ORDER BY demo_date DESC;`;

//     const params = userId && userId !== 'all' ? [userId] : [];
//     const { rows } = await pool.query(query, params);

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching daily demos:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };





async function getStatusNameById(statusId) {
  if (!statusId || statusId === '0') {
    return null;
  }

  try {
    const query = 'SELECT name FROM status_master WHERE id = $1';
    const result = await pool.query(query, [statusId]);
    
    if (result.rows.length > 0) {
      return result.rows[0].name;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching status name:', error);
    return null;
  }
}

export const clearCustomerStatusSimple = async (req, res) => {
  const { source, currentStatus, setStatus, comment = "Status cleared by admin" } = req.body;

  // Step 1: Get status names
  const currentStatusName = await getStatusNameById(currentStatus);
  const setStatusName = await getStatusNameById(setStatus);

  console.log('Clear Status Request:', { 
    source, 
    currentStatus, 
    currentStatusName, 
    setStatus, 
    setStatusName, 
    comment  
  });

  // Validation
  if (!source || source === '0') {
    return res.status(400).json({
      success: false,
      error: 'Source is required'
    });
  }

  if (!setStatus || setStatus === '0' || !setStatusName) {
    return res.status(400).json({
      success: false,
      error: 'Valid set status is required'
    });
  }

  try {
    // Step 2: Delete from assining_customers
    let deleteQuery = 'DELETE FROM assining_customers WHERE batch_id = $1';
    const deleteParams = [source];
    
    if (currentStatus && currentStatus !== '0' && currentStatus !== '') {
      deleteQuery += ' AND status_id = $2 AND status = $3';
      deleteParams.push(currentStatus);
      deleteParams.push(currentStatusName);
    }
    
    const deleteResult = await pool.query(deleteQuery, deleteParams);

    console.log(`Deleted ${deleteResult.rowCount} records from assining_customers`);

    // Step 3: Update customers table
    let updateQuery = `
      UPDATE customers 
      SET 
        status_id = $1,
        status = $2,
        comment = $3,
        updated_at = $4,
        assigned_to =$5
      WHERE batch_id = $6 AND status = $7 
    `;
    
    const updateParams = [
      setStatus,       // status_id
      setStatusName,   // status name
      comment,         // comment
      new Date(),      // updated_at
      null,
      source ,           // batch_id (WHERE)
      currentStatusName ,
    ];

    if (currentStatus && currentStatus !== '0' && currentStatus !== '' ) {
      updateQuery += ' AND status_id = $8';
      updateParams.push(currentStatus);
    }

    const updateResult = await pool.query(updateQuery, updateParams);
    console.log(`Updated ${updateResult.rowCount} records in customers table`);

    // Success response
    return res.json({
      success: true,
      message: 'Status cleared successfully',
      data: {
        deletedFromAssigning: deleteResult.rowCount,
        updatedCustomers: updateResult.rowCount,
        newStatus: setStatusName,
        oldStatusFilter: currentStatusName || 'All Statuses',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in clearCustomerStatusSimple:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process request',
      details: error.message
    });
  }
};