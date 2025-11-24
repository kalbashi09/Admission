/**
 * Database Connection Pool Configuration
 * * IMPORTANT: This file has been updated to use 'mysql2/promise' and
 * 'createPool' instead of 'createConnection'. This ensures the database
 * operations (in ticketdb.js) are promise-based and connections are
 * managed safely for a server environment (using .getConnection() and .release()).
 */
const mysql = require("mysql2/promise"); // Use the promise-based version

// Create a connection pool instead of a single connection.
// Pools are safer and more efficient for server applications.
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "shinju0728",
  database: "tccadmissiondb",
  waitForConnections: true, // Wait for connections if pool limit is reached
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // No limit on the queue (if connectionLimit is hit)
});

// A quick test to confirm the pool can get a connection (optional but helpful)
pool
  .getConnection()
  .then((connection) => {
    console.log("MySQL connection pool successfully created and tested!");
    connection.release(); // Release the test connection immediately
  })
  .catch((err) => {
    console.error(
      "CRITICAL: Failed to connect to MySQL database pool:",
      err.message
    );
    // You might want to exit the process here if the connection is critical
    // process.exit(1);
  });

// Export the pool object, which has the .getConnection() method
module.exports = pool;
