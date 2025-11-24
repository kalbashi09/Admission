// ../scripts/usertickets.js

// 1. Define the API endpoint for ticket validation
// This must match the URL and port of your running server.js
const VALIDATION_API_URL = "http://localhost:3000/api/validate-ticket";

// 2. Define the page to redirect to upon successful validation
const NEXT_PAGE_URL = "/client/pages/form.html";

// 3. Get the form and input elements
const form = document.querySelector(".input-area");
const ticketInput = document.getElementById("ticketinput");
const submitButton = document.getElementById("submitbtn");

/**
 * Handles the ticket submission and verification by calling the server API.
 * @param {Event} event The form submission event.
 */
async function handleTicketSubmission(event) {
  event.preventDefault(); // Prevent default form submission
  removeErrorMessage(); // Clear any previous error message

  // Disable the button to prevent multiple submissions
  submitButton.disabled = true;
  submitButton.innerHTML = "Verifying...";

  const enteredTicket = ticketInput.value.trim();

  try {
    const response = await fetch(VALIDATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Send the ticket code to the server in JSON format
      body: JSON.stringify({ ticketCode: enteredTicket }),
    });

    // Parse the JSON response from the server
    const result = await response.json();

    if (result.success) {
      // --- Success Case ---
      // Save the ticket code for use in the next form (optional but useful)
      sessionStorage.setItem("validatedTicket", enteredTicket);

      alert(
        `Ticket Verified! Proceeding to the application form. Ticket: ${enteredTicket}`
      );
      window.location.href = NEXT_PAGE_URL;
    } else {
      // --- Failure Case ---
      // Display the specific error message returned by the server
      displayErrorMessage(result.message);
    }
  } catch (error) {
    // Handle network errors (e.g., server is offline)
    console.error("Fetch error:", error);
    displayErrorMessage(
      "Could not connect to the validation service. Please try again later."
    );
  } finally {
    // Re-enable the button regardless of success or failure
    submitButton.disabled = false;
    submitButton.innerHTML = "Submit your ticket";
  }
}

// Keep your utility functions as they are
function displayErrorMessage(message) {
  // ... (Your existing displayErrorMessage function)
  if (document.getElementById("ticket-error-message")) {
    return;
  }
  const errorMessage = document.createElement("p");
  errorMessage.id = "ticket-error-message";
  errorMessage.style.color = "red";
  errorMessage.style.marginTop = "10px";
  errorMessage.style.fontWeight = "bold";
  errorMessage.textContent = message;
  const ticketEntryDiv = document.querySelector(".input-area"); // Changed selector to .input-area
  if (ticketEntryDiv) {
    ticketEntryDiv.appendChild(errorMessage);
  }
}

function removeErrorMessage() {
  // ... (Your existing removeErrorMessage function)
  const existingError = document.getElementById("ticket-error-message");
  if (existingError) {
    existingError.remove();
  }
}

// 4. Attach the event listener to the form's submit event
if (form) {
  form.addEventListener("submit", handleTicketSubmission);
}
