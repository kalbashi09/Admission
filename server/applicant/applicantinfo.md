const express = require("express");
const cors = require("cors");
const db = require("../dbconnection"); // Assuming dbconnection.js is in 'server' directory
const app = express();

// 1. Setup Middleware
app.use(cors());
app.use(express.json());

// 2. The Route: *** NOW ASYNCHRONOUS to use await with db.query() ***
app.post("/save-application", async (req, res) => {
  const data = req.body;

  console.log("Received Data:", data);

  // >>>>>> CRITICAL FIX: The try/catch block now handles both sync and async errors <<<<<<
  try {
    // CRITICAL FIX 1: Robustly check if subjects is an array before trying to join it.
    const subjectString = Array.isArray(data.subjects)
      ? data.subjects.join(", ")
      : "";

    // Optional Check: Ensure required data is present
    if (!data.personal || !data.personal.fullName || !data.course) {
      throw new Error(
        "Missing required personal or course data in request body."
      );
    }

    // 3. Prepare SQL Query
    const sql = `
        INSERT INTO applicants
        (full_name, birthdate, email, gender, phone, course_code, subjects_enrolled, date_enrolled) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    // The 'values' array only contains the 7 placeholders for the form data
    const values = [
      data.personal.fullName,
      data.personal.birthdate,
      data.personal.email,
      data.personal.gender,
      data.personal.phone,
      data.course,
      subjectString,
    ];

    // 4. Execute Query: *** AWAITING THE PROMISE (Fix for callback/promise mix) ***
    // The database library returns an array where the first element is the result object.
    const [result] = await db.query(sql, values);

    // --- SUCCESS BLOCK ---
    console.log("Data Saved! New Applicant ID:", result.insertId);
    console.log("[STEP 6] DATABASE CALLBACK EXECUTED!");
    res.status(200).json({ message: "Application Saved Successfully!" });
  } catch (error) {
    // This catches all errors: sync (data prep) and async (database errors).
    console.error(
      "SERVER-SIDE ERROR during submission:",
      error.sqlMessage || error.message
    );

    // Server sends a guaranteed error response back to the client.
    res.status(500).json({
      message: "Server Error: Could not process or save application.",
      error: error.sqlMessage || error.message || error.toString(),
    });
  }
});

// 5. Start Server
app.listen(3000, () => {
  console.log("---------------------------------------");
  console.log("Backend Server running on Port 3000");
  console.log("Waiting for data from form...");
  console.log("---------------------------------------");
});
