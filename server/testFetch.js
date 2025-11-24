/**
 * Test Fetch Script (Promise-Based)
 * * Tests connectivity and queries the 'test' table using the promise-based
 * connection pool exported by dbconnection.js.
 */
const db = require("./dbconnection"); // Imports the connection pool

async function runTestFetch() {
  let connection;
  try {
    // 1. Get a promise-based connection from the pool
    connection = await db.getConnection();

    console.log(
      "Successfully retrieved connection from pool. Running query..."
    );

    // 2. Execute the query using the connection's promise-based method
    const [results] = await connection.query("SELECT * FROM test");

    console.log("------------------------------------------");
    console.log("Fetched test table results:");
    console.log(results);
    console.log("------------------------------------------");
  } catch (error) {
    console.error("Query error in testFetch:", error.message);
  } finally {
    // 3. IMPORTANT: Release the connection back to the pool
    if (connection) {
      connection.release();
      console.log("Connection released.");
    }
  }
}

// Run the async function
runTestFetch();
