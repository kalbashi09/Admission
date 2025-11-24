/**
 * Ticket Generator Script
 * Generates and stores a specified number of unique ticket codes
 * in the database via the ticketdb module.
 * * Format: 6 Random Letters (mixed case) + 3 Random Numbers, shuffled.
 * Usage: Run this script with Node.js.
 * command: node server/admin/ticketgenerator.js
 */

// --- Import Database Interaction Functions ---
// We import the functions needed to check and store tickets.
const { isCodeUnique, insertTicketCode } = require("./ticketdb");

// --- Configuration ---
const CODE_LENGTH = 9;
const LETTERS_COUNT = 6;
const NUMBERS_COUNT = 3;
const CHARS_LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CHARS_NUMBERS = "0123456789";
const TICKETS_TO_GENERATE = 10; // Number of unique codes to generate

// --- Core Generation Functions (No Change Needed Here) ---

/**
 * Generates a single random string part of a specified length.
 * @param {string} characterSet - The string of characters allowed.
 * @param {number} length - The desired length.
 * @returns {string} - The randomly generated string part.
 */
function generateRandomPart(characterSet, length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    // Get a random index from the character set
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    // Append the character at that index to the result
    result += characterSet.charAt(randomIndex);
  }
  return result;
}

/**
 * Generates a single, mixed-case, 9-character ticket code.
 * Format: 6 Letters (mixed case) followed by 3 Numbers, then shuffled.
 * @returns {string} The generated and shuffled ticket code (e.g., Hx9T2E4sa).
 */
function generateTicketCode() {
  const letters = generateRandomPart(CHARS_LETTERS, LETTERS_COUNT);
  const numbers = generateRandomPart(CHARS_NUMBERS, NUMBERS_COUNT);

  // 1. Combine all available characters (6 letters + 3 numbers)
  const allChars = (letters + numbers).split("");

  // 2. Shuffle the array using the Fisher-Yates (Knuth) algorithm for randomness
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  // 3. Return the joined, shuffled string
  return allChars.join("");
}

// --- Execution & Storage Logic (Updated to Handle Async DB Calls) ---

/**
 * Main function to generate, ensure uniqueness, and store tickets.
 * @param {number} count The number of codes to generate and store.
 */
async function runGenerator(count) {
  // MUST BE ASYNC
  console.log(
    `\n--- Starting Ticket Generation: ${count} codes to be stored ---\n`
  );

  let generatedCount = 0;
  while (generatedCount < count) {
    let newCode;
    let unique = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    // 1. Loop until a unique code is found or max attempts reached
    do {
      newCode = generateTicketCode();
      attempts++;

      try {
        // Call the imported database function to check uniqueness
        unique = await isCodeUnique(newCode);
      } catch (e) {
        // Database is down or critical failure, stop the process
        console.error(
          `CRITICAL: Database connection failed. Aborting generation.`
        );
        return;
      }

      if (!unique) {
        console.log(
          `- Collision (Attempt ${attempts}/${MAX_ATTEMPTS}): ${newCode}. Retrying...`
        );
      }

      if (attempts >= MAX_ATTEMPTS) {
        console.error(
          `\nSTOPPED: Failed to find a unique code after ${MAX_ATTEMPTS} attempts. The character space might be too small, or the table is nearly full.`
        );
        return;
      }
    } while (!unique);

    // 2. Insert the unique code into the database
    const success = await insertTicketCode(newCode);

    if (success) {
      console.log(
        `[OK] Ticket ${generatedCount + 1}: ${newCode} (Stored in DB)`
      );
      generatedCount++;
    } else {
      console.log(
        `[FAIL] Could not store code: ${newCode}. Database insertion error occurred.`
      );
    }
  }

  console.log(
    `\n------------------- Generation Complete (${generatedCount} codes stored) -------------------\n`
  );
}

// Start the ticket generation process (must be called with await)
runGenerator(TICKETS_TO_GENERATE);
