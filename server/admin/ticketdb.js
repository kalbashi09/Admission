/**
 * Ticket Database Operations (DAO)
 * Contains functions for interacting with the AdmissionTickets table.
 * * Assumes:
 * - dbconnection.js exports an object/pool that supports .getConnection() and
 * returns a connection object with a promise-based .query() method (e.g., mysql2/promise).
 */
const db = require("../dbconnection"); // Import the main database connection utility

/**
 * Checks the database to see if a given ticket code already exists.
 * @param {string} code - The ticket code to check.
 * @returns {Promise<boolean>} - True if the code is unique (does not exist), False otherwise.
 */
async function isCodeUnique(code) {
  let connection;
  try {
    connection = await db.getConnection(); // Get a connection from the pool
    const [rows] = await connection.query(
      "SELECT ticket_id FROM AdmissionTickets WHERE ticket_code = ?",
      [code]
    );
    // If no rows are returned, the code is unique
    return rows.length === 0;
  } catch (error) {
    console.error(
      "DATABASE ERROR: Failed during uniqueness check for code:",
      code,
      "\nDetails:",
      error
    );
    // Treat database error as non-unique to prevent accidental duplication
    return false;
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
}

/**
 * Inserts a new unique ticket code into the AdmissionTickets table.
 * @param {string} code - The unique ticket code to store.
 * @returns {Promise<boolean>} - True if the insert was successful, False otherwise.
 */
async function insertTicketCode(code) {
  let connection;
  try {
    connection = await db.getConnection(); // Get a connection from the pool
    // Only inserting the ticket_code; is_used defaults to 0 and other fields are NULL.
    const [result] = await connection.query(
      "INSERT INTO AdmissionTickets (ticket_code) VALUES (?)",
      [code]
    );
    // Check if exactly one row was affected by the insert
    return result.affectedRows === 1;
  } catch (error) {
    console.error(
      "DATABASE ERROR: Failed to insert code:",
      code,
      "\nDetails:",
      error
    );
    return false;
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
}

/**
 * Validates a ticket code (must exist and be unused) and marks it as used by setting is_used = 1.
 * This is the function used by the client-facing validation API.
 * @param {string} code - The ticket code to validate and use.
 * @returns {Promise<{success: boolean, message: string}>} - Result of the validation/usage.
 */
async function validateAndUseTicket(code) {
  let connection;
  try {
    connection = await db.getConnection();

    // 1. Check if the ticket exists and is UNUSED (is_used = 0)
    const [rows] = await connection.query(
      "SELECT ticket_id, is_used FROM AdmissionTickets WHERE ticket_code = ?",
      [code]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: "Admission ticket not found. Please check your code.",
      };
    }

    const ticket = rows[0];
    if (ticket.is_used === 1) {
      return {
        success: false,
        message: "Admission ticket has already been used and cannot be reused.",
      };
    }

    // 2. Mark the ticket as used and record the date
    const [updateResult] = await connection.query(
      "UPDATE AdmissionTickets SET is_used = 1, date_used = NOW() WHERE ticket_id = ?",
      [ticket.ticket_id]
    );

    if (updateResult.affectedRows === 1) {
      return { success: true, message: "Ticket validated successfully." };
    } else {
      // Failsafe in case of a concurrent update issue
      return {
        success: false,
        message: "Database error during ticket usage update. Please try again.",
      };
    }
  } catch (error) {
    console.error(
      "DATABASE ERROR: Failed during ticket validation/usage check for code:",
      code,
      "\nDetails:",
      error
    );
    return {
      success: false,
      message: "A server-side database error occurred during validation.",
    };
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  isCodeUnique,
  insertTicketCode,
  validateAndUseTicket, // <-- Now correctly exported
};
