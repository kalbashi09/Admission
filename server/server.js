const express = require("express");
const cors = require("cors");
const db = require("./dbconnection"); // Assuming dbconnection.js is in the same directory
// Import the new validation function from the ticket database module
const { validateAndUseTicket } = require("./admin/ticketdb");
const app = express();

// 1. Setup Middleware
app.use(cors());
app.use(express.json());

// ==========================================================
// 2. TICKET VALIDATION ROUTE (Using actual DB logic)
//    Handles POST requests from scripts/usertickets.js
// ==========================================================
app.post("/api/validate-ticket", async (req, res) => {
  const { ticketCode } = req.body;

  console.log(
    `\n--- TICKET VALIDATION REQUEST RECEIVED for: ${ticketCode} ---`
  );

  if (!ticketCode || ticketCode.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Ticket code cannot be empty." });
  }

  try {
    // Call the real validation and usage function
    // THIS LINE REQUIRES THE FUNCTION TO BE EXPORTED IN ticketdb.js
    const validationResult = await validateAndUseTicket(ticketCode.trim());

    if (validationResult.success) {
      console.log("Ticket successfully validated and marked as used in DB.");
      // Success response: HTTP 200 and success: true
      res.status(200).json(validationResult);
    } else {
      console.log(`Ticket validation failed: ${validationResult.message}`);
      // Failure response: HTTP 400 (Bad Request)
      res.status(400).json(validationResult);
    }
  } catch (error) {
    console.error("SERVER-SIDE ERROR during ticket validation:", error.message);
    res.status(500).json({
      success: false,
      message:
        "Server Error: Failed to communicate with the database for validation.",
    });
  }
});

// 3. The Route: Handles application submission and database insertion
app.post("/save-application", async (req, res) => {
  const data = req.body;

  // =================================================
  // CONSOLE OUTPUT (FROM APPLICANTINFO.JS LOGIC)
  // =================================================
  console.log("\n=================================================");
  console.log("APPLICANT DATA RECEIVED FROM CLIENT (FOR BACKEND):");
  console.log("=================================================");
  console.log("Personal Information Highlights:");
  console.log(`  Full Name: ${data.personal?.fullName || "N/A"}`);
  console.log(`  Email: ${data.personal?.email || "N/A"}`);
  console.log(`  Course Code: ${data.course}`);
  console.log("\nFull Application JSON Object (The Raw Data):");
  // Print the entire collected object to the server console, nicely formatted
  console.log(JSON.stringify(data, null, 2));
  console.log("=================================================");
  // =================================================

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

    // 4. Prepare SQL Query
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

    // 5. Execute Query: *** AWAITING THE PROMISE ***
    // The database library returns an array where the first element is the result object.
    const [result] = await db.query(sql, values);

    // --- SUCCESS BLOCK ---
    const applicantId = result.insertId;
    console.log("Data Saved! New Applicant ID:", applicantId);

    // Send success response back to the client
    res.status(200).json({
      message: "Application Saved Successfully!",
      applicantId: applicantId,
    });
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

// 6. Start Server
app.listen(3000, () => {
  console.log("---------------------------------------");
  console.log("Backend Server running on Port 3000");
  console.log("Waiting for data from form...");
  console.log("---------------------------------------");
});
