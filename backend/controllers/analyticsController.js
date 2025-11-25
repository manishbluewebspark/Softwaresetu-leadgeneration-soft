import { pool } from "../config/db.js";

// Employees list ke liye
export const getEmployees = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        updated_by_id as id, 
        updated_by as name 
      FROM lead_history 
      WHERE updated_by_id IS NOT NULL 
      AND updated_by IS NOT NULL
      ORDER BY updated_by
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching employees" 
    });
  }
};

// Hourly calls data ke liye
// export const getHourlyCalls = async (req, res) => {
//   try {
//     const { employee_id, date_range = 'today' } = req.query;
    
//     // Indian time zone set karna - IST (UTC+5:30)
//     const timeZone = 'Asia/Kolkata';
    
//     // Date condition set karna - Indian time ke according
//     let dateCondition = "";
//     switch (date_range) {
//       case 'today':
//         dateCondition = "DATE(updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = CURRENT_DATE";
//         break;
//       case 'week':
//         dateCondition = "updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' >= DATE_TRUNC('week', CURRENT_DATE)";
//         break;
//       case 'month':
//         dateCondition = "updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' >= DATE_TRUNC('month', CURRENT_DATE)";
//         break;
//       default:
//         dateCondition = "DATE(updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = CURRENT_DATE";
//     }

//     // Employee condition set karna
//     let employeeCondition = "";
//     const queryParams = [];
    
//     if (employee_id && employee_id !== 'all') {
//       employeeCondition = `AND updated_by_id = $1`;
//       queryParams.push(parseInt(employee_id));
//     }

//     // Pehle current date ki first update ka Indian time find karo
//     const firstUpdateQuery = `
//       SELECT MIN(updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') as first_update_time_ist
//       FROM lead_history 
//       WHERE ${dateCondition} ${employeeCondition}
//     `;

//     const firstUpdateResult = queryParams.length > 0 
//       ? await pool.query(firstUpdateQuery, queryParams)
//       : await pool.query(firstUpdateQuery);

//     let startHour = 0;
//     let endHour = 23;

//     // Agar data available hai to first update ke Indian hour se start karo
//     if (firstUpdateResult.rows[0]?.first_update_time_ist) {
//       const firstUpdateTime = new Date(firstUpdateResult.rows[0].first_update_time_ist);
//       startHour = firstUpdateTime.getHours();
      
//       // Current Indian time tak show karo ya 23 tak
//       const now = new Date();
//       const currentIndianHour = now.getHours(); // Server Indian time zone mein hona chahiye
//       endHour = Math.min(currentIndianHour, 23);
      
//       // Ensure startHour <= endHour
//       if (startHour > endHour) {
//         startHour = endHour;
//       }
//     }

//     // Main query - Indian time ke according
//     const mainQuery = `
//       SELECT 
//         TO_CHAR(DATE_TRUNC('hour', updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'), 'HH24:00') as hour_ist,
//         COUNT(*) as call_count
//       FROM lead_history 
//       WHERE ${dateCondition} ${employeeCondition}
//         AND EXTRACT(HOUR FROM updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') BETWEEN ${startHour} AND ${endHour}
//       GROUP BY DATE_TRUNC('hour', updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')
//       ORDER BY hour_ist
//     `;

//     const result = queryParams.length > 0 
//       ? await pool.query(mainQuery, queryParams)
//       : await pool.query(mainQuery);

//     // Hours generate karo first update time se current Indian time tak
//     const hourlyData = {};
//     result.rows.forEach(row => {
//       hourlyData[row.hour_ist] = parseInt(row.call_count);
//     });

//     const completeData = [];
//     for (let i = startHour; i <= endHour; i++) {
//       const hour = `${i.toString().padStart(2, '0')}:00`;
//       const nextHour = `${(i + 1).toString().padStart(2, '0')}:00`;
      
//       completeData.push({
//         hour: hour,
//         time_range: `${hour} - ${nextHour} IST`,
//         call_count: hourlyData[hour] || 0
//       });
//     }

//     res.json({
//       success: true,
//       data: completeData,
//       time_range: {
//         start_hour: `${startHour.toString().padStart(2, '0')}:00`,
//         end_hour: `${endHour.toString().padStart(2, '0')}:00`,
//         first_update_time_ist: firstUpdateResult.rows[0]?.first_update_time_ist || null
//       }
//     });

//   } catch (err) {
//     console.error("Error fetching hourly calls:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Error fetching hourly calls data" 
//     });
//   }
// };


export const getHourlyCalls = async (req, res) => {
  try {
    const { employee_id, date_range = 'today' } = req.query;
    
    console.log('Received request with params:', { employee_id, date_range });
    
    // Employee condition set karna
    let employeeCondition = "";
    const queryParams = [];
    
    if (employee_id && employee_id !== 'all') {
      employeeCondition = `AND updated_by_id = $1`;
      queryParams.push(parseInt(employee_id));
    }

    // Correct query with UTC to IST conversion
    const mainQuery = `
      SELECT 
        EXTRACT(HOUR FROM (updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')) as hour_ist,
        COUNT(*) as call_count
      FROM lead_history 
      WHERE DATE(updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = CURRENT_DATE
      ${employeeCondition}
      GROUP BY EXTRACT(HOUR FROM (updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'))
      ORDER BY hour_ist
    `;

    console.log('Main query:', mainQuery);
    console.log('Query params:', queryParams);

    const result = queryParams.length > 0 
      ? await pool.query(mainQuery, queryParams)
      : await pool.query(mainQuery);

    console.log('Query result rows:', result.rows);

    // Debugging ke liye raw data bhi check karein
    if (result.rows.length === 0) {
      console.log('No data found for current date in IST. Checking raw data...');
      
      const debugQuery = `
        SELECT 
          updated_at as utc_time,
          updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as ist_time,
          EXTRACT(HOUR FROM updated_at) as utc_hour,
          EXTRACT(HOUR FROM (updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')) as ist_hour
        FROM lead_history 
        ${employeeCondition ? 'WHERE ' + employeeCondition.replace('AND ', '') : ''}
        ORDER BY updated_at DESC
        LIMIT 5
      `;
      
      const debugResult = await pool.query(debugQuery, queryParams);
      console.log('Debug - Time conversion samples:', debugResult.rows);
    }

    // All hours (0-23) ke liye data prepare karein
    const hourlyData = {};
    result.rows.forEach(row => {
      hourlyData[parseInt(row.hour_ist)] = parseInt(row.call_count);
    });

    const completeData = [];
    for (let i = 0; i <= 23; i++) {
      const hour = `${i.toString().padStart(2, '0')}:00`;
      const nextHour = `${(i + 1).toString().padStart(2, '0')}:00`;
      
      completeData.push({
        hour: hour,
        time_range: `${hour} - ${nextHour} IST`,
        call_count: hourlyData[i] || 0
      });
    }

    console.log('Complete data:', completeData);

    const response = {
      success: true,
      data: completeData,
      time_range: {
        start_hour: "00:00",
        end_hour: "23:00",
        message: "Showing today's data in IST"
      },
      debug: {
        total_records_found: result.rows.length,
        query_used: mainQuery
      }
    };

    console.log('Final response:', response);
    res.json(response);

  } catch (err) {
    console.error("Error fetching hourly calls:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching hourly calls data",
      error: err.message 
    });
  }
};




// Additional analytics summary ke liye
export const getCallAnalyticsSummary = async (req, res) => {
  try {
    const { employee_id, date_range = 'today' } = req.query;
    
    let dateCondition = "";
    switch (date_range) {
      case 'today':
        dateCondition = "DATE(created_at) = CURRENT_DATE";
        break;
      case 'week':
        dateCondition = "created_at >= DATE_TRUNC('week', CURRENT_DATE)";
        break;
      case 'month':
        dateCondition = "created_at >= DATE_TRUNC('month', CURRENT_DATE)";
        break;
      default:
        dateCondition = "DATE(created_at) = CURRENT_DATE";
    }

    let employeeCondition = "";
    const queryParams = [];
    
    if (employee_id && employee_id !== 'all') {
      employeeCondition = `AND updated_by_id = $1`;
      queryParams.push(parseInt(employee_id));
    }

    // Total calls
    const totalCallsQuery = `
      SELECT COUNT(*) as total_calls
      FROM lead_history 
      WHERE ${dateCondition} ${employeeCondition}
    `;

    // Peak hour
    const peakHourQuery = `
      SELECT 
        TO_CHAR(DATE_TRUNC('hour', created_at), 'HH24:00') as peak_hour,
        COUNT(*) as call_count
      FROM lead_history 
      WHERE ${dateCondition} ${employeeCondition}
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY call_count DESC
      LIMIT 1
    `;

    // Average calls per hour
    const avgCallsQuery = `
      SELECT 
        COUNT(*) / 24 as avg_calls_per_hour
      FROM lead_history 
      WHERE ${dateCondition} ${employeeCondition}
    `;

    const [totalCallsResult, peakHourResult, avgCallsResult] = await Promise.all([
      queryParams.length > 0 
        ? pool.query(totalCallsQuery, queryParams)
        : pool.query(totalCallsQuery),
      
      queryParams.length > 0 
        ? pool.query(peakHourQuery, queryParams)
        : pool.query(peakHourQuery),
      
      queryParams.length > 0 
        ? pool.query(avgCallsQuery, queryParams)
        : pool.query(avgCallsQuery)
    ]);

    const summary = {
      total_calls: parseInt(totalCallsResult.rows[0]?.total_calls) || 0,
      peak_hour: peakHourResult.rows[0]?.peak_hour || '00:00',
      peak_hour_calls: parseInt(peakHourResult.rows[0]?.call_count) || 0,
      avg_calls_per_hour: parseFloat(avgCallsResult.rows[0]?.avg_calls_per_hour) || 0
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {
    console.error("Error fetching call summary:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching call analytics summary" 
    });
  }
};