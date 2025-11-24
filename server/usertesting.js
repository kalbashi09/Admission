// 1. Define the API endpoint for ticket validation
const VALIDATION_API_URL = "http://localhost:3000/api/validate-ticket";

// 2. Define the page to redirect to upon successful validation
const NEXT_PAGE_URL = "/client/pages/form.html";

// 3. Get the form and input elements
// Changed to use querySelector(".input-area") to match the original script's logic,
// though form itself is often more reliable
const form = document.querySelector(".input-area");
const ticketInput = document.getElementById("ticketinput");
const submitButton = document.getElementById("submitbtn");

// ⭐️ NEW: Select the <h4> element inside the button for text changes
const submitButtonText = submitButton ? submitButton.querySelector("h4") : null;

// --- Alert Modal Elements (Must be present in the HTML where this script runs) ---
const alertModal = document.getElementById("customAlert");
const alertContent = document.getElementById("alertContent");
const alertIcon = document.getElementById("alertIcon");
const alertTitle = document.getElementById("alertTitle");
const alertMessageEl = document.getElementById("alertMessage");
const alertCloseBtn = document.getElementById("alertCloseBtn");

// --- UTILITY FUNCTIONS ---

/**
 * Custom alert replacement for window.alert() and window.confirm()
 * NOTE: This function requires the 'customAlert' modal structure in the HTML.
 */
function alertMessage(title, message, color = "#2563eb") {
  // Check if modal elements exist before trying to use them
  if (
    !alertModal ||
    !alertTitle ||
    !alertMessageEl ||
    !alertCloseBtn ||
    !alertIcon ||
    !alertContent
  ) {
    console.error(
      "Custom alert elements not found. Falling back to console log."
    );
    console.log(`ALERT: ${title} - ${message}`);
    return;
  }

  alertTitle.textContent = title;
  alertMessageEl.textContent = message;

  // Set button color and modal styles
  alertCloseBtn.style.backgroundColor = color;
  alertContent.style.borderColor = color;
  alertIcon.style.color = color;

  // Set hover style and icon path
  let iconPath = "";
  if (color === "#2563eb") {
    alertCloseBtn.className = "modal-close-btn hover-blue";
    iconPath = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`;
  } else if (color === "#dc2626") {
    alertCloseBtn.className = "modal-close-btn hover-red";
    iconPath = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />`;
  } else if (color === "#22c55e") {
    alertCloseBtn.className = "modal-close-btn hover-green";
    iconPath = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`;
  } else {
    alertCloseBtn.className = "modal-close-btn";
  }
  alertIcon.innerHTML = iconPath;

  alertModal.style.display = "flex";
}

// Attach close listener for the custom alert
if (alertCloseBtn) {
  alertCloseBtn.addEventListener("click", () => {
    alertModal.style.display = "none";
  });
}

/**
 * Handles the ticket submission and verification by calling the server API.
 * @param {Event} event The form submission event.
 */
async function handleTicketSubmission(event) {
  event.preventDefault(); // Prevent default form submission
  removeErrorMessage(); // Clear any previous error message

  const enteredTicket = ticketInput.value.trim();
  if (!enteredTicket) {
    displayErrorMessage("Please enter your admission ticket code.");
    return;
  }

  // Disable the button to prevent multiple submissions
  submitButton.disabled = true;

  // ⭐️ FIX APPLIED: Change only the text content of the H4 tag
  const originalButtonText = "Submit your ticket";
  if (submitButtonText) {
    submitButtonText.textContent = "Verifying...";
  } else {
    // Fallback for unexpected button structure
    submitButton.innerHTML = "Verifying...";
  }

  try {
    // === NEW: SIMULATE NETWORK DELAY (5 seconds) ===
    console.log("Simulating 5-second network latency...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // ===========================================

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

    if (response.ok && result.success) {
      // --- Success Case ---
      sessionStorage.setItem("validatedTicket", enteredTicket);

      // ⭐️ FIX: Replacing alert() with custom alertMessage()
      alertMessage(
        "Ticket Verified!",
        `Proceeding to the application form. Ticket: ${enteredTicket}`,
        "#22c55e" // Green
      );

      // Delay redirection slightly so the user can see the success message
      setTimeout(() => {
        window.location.href = NEXT_PAGE_URL;
      }, 1500);
    } else {
      // --- Failure Case ---
      const message =
        result.message ||
        "Ticket validation failed. Please check your ticket and try again.";
      // Use result.message for server-side validation errors (e.g., ticket expired/used)
      alertMessage(
        "Validation Failed",
        message,
        "#dc2626" // Red
      );
      displayErrorMessage(message);
    }
  } catch (error) {
    // Handle network errors (e.g., server is offline)
    console.error("Fetch error:", error);
    const message =
      "Could not connect to the validation service. Please check your network or try again later.";
    alertMessage(
      "Connection Error",
      message,
      "#dc2626" // Red
    );
    displayErrorMessage(message);
  } finally {
    // Re-enable the button regardless of success or failure
    submitButton.disabled = false;

    // ⭐️ FIX APPLIED: Revert the text content of the H4 tag
    if (submitButtonText) {
      submitButtonText.textContent = originalButtonText;
    } else {
      // Fallback
      submitButton.innerHTML = originalButtonText;
    }
  }
}

// Keep your utility functions as they are
function displayErrorMessage(message) {
  if (document.getElementById("ticket-error-message")) {
    return;
  }
  const errorMessage = document.createElement("p");
  errorMessage.id = "ticket-error-message";
  // Styling is now handled mostly by CSS selector #ticket-error-message
  errorMessage.textContent = message;

  // Revert to using querySelector(".input-area") to match original JS logic
  const ticketEntryDiv = document.querySelector(".input-area");
  if (ticketEntryDiv) {
    // Append the error message
    ticketEntryDiv.appendChild(errorMessage);
  }
}

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
