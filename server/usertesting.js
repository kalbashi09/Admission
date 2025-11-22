// ../scripts/login.js

// 1. Define a list of valid tickets
// In a real application, this list would be fetched securely from a server-side database.
// For this client-side example, we'll use a hardcoded array.
const VALID_TICKETS = [
  "TCC2024-ADMIT-001",
  "TCC2024-ADMIT-002",
  "TCC2024-ADMIT-003",
  "TEST-TICKET-A1",
  "SUCCESS", // Example for easy testing
];

// 2. Define the page to redirect to upon successful validation
const NEXT_PAGE_URL = "/client/pages/form.html"; // Change this to your actual next page

// 3. Get the form and input elements
const form = document.querySelector(".input-area");
const ticketInput = document.getElementById("ticketinput");
const submitButton = document.getElementById("submitbtn");

/**
 * Handles the ticket submission and verification.
 * @param {Event} event The form submission event.
 */
function handleTicketSubmission(event) {
  // Prevent the default form submission (which would cause a page reload)
  event.preventDefault();

  // Clear any previous error message
  removeErrorMessage();

  const enteredTicket = ticketInput.value.trim().toUpperCase(); // Trim whitespace and convert to uppercase for robust matching

  // Check if the entered ticket is in the list of valid tickets
  if (VALID_TICKETS.includes(enteredTicket)) {
    // --- Success Case ---
    // Redirect the user to the next page
    alert("Ticket Verified! Proceeding to the application form.");
    window.location.href = NEXT_PAGE_URL;
  } else {
    // --- Failure Case ---
    // Display an error message to the user
    displayErrorMessage(
      "Invalid ticket. Please check your ticket number and try again."
    );
  }
}

/**
 * Creates and displays an error message below the input field.
 * @param {string} message The error message to display.
 */
function displayErrorMessage(message) {
  // Check if an error message already exists to avoid duplicates
  if (document.getElementById("ticket-error-message")) {
    return;
  }

  const errorMessage = document.createElement("p");
  errorMessage.id = "ticket-error-message";
  errorMessage.style.color = "red";
  errorMessage.style.marginTop = "10px";
  errorMessage.style.fontWeight = "bold";
  errorMessage.textContent = message;

  // Insert the error message after the ticket entry div
  const ticketEntryDiv = document.querySelector(".ticket-entry");
  if (ticketEntryDiv) {
    ticketEntryDiv.appendChild(errorMessage);
  }
}

/**
 * Removes the existing error message from the DOM.
 */
function removeErrorMessage() {
  const existingError = document.getElementById("ticket-error-message");
  if (existingError) {
    existingError.remove();
  }
}

// 4. Attach the event listener to the form's submit event
if (form) {
  form.addEventListener("submit", handleTicketSubmission);
}
