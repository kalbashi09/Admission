let formData = {
  personal: {},
  course: "",
  subjects: [],
};

// --- DOM ELEMENTS ---
const termsContainer = document.getElementById("terms-condition");
const tcContentBox = document.getElementById("tcContentBox");
const acceptBtn = document.getElementById("tc-accept");
const declineBtn = document.getElementById("tc-decline");
const mainForm = document.getElementById("admissionForm");
const courseSelect = document.getElementById("course");
const declineMessage = document.getElementById("declineMessage");
const reopenTermsBtn = document.getElementById("reopenTerms");
const asideForm = document.getElementById("form-aside");

// Progress Bar Elements
const step1Circle = document.getElementById("step1-circle");
const step2Circle = document.getElementById("step2-circle");
const step3Circle = document.getElementById("step3-circle");
const step1Subtitle = document.getElementById("step1-subtitle");
const step2Subtitle = document.getElementById("step2-subtitle");
const step3Subtitle = document.getElementById("step3-subtitle");

const alertModal = document.getElementById("customAlert");
const alertTitle = document.getElementById("alertTitle");
const alertMessageEl = document.getElementById("alertMessage");
const alertCloseBtn = document.getElementById("alertCloseBtn");

// --- UTILITY FUNCTIONS ---

/**
 * Custom alert replacement for window.alert() and window.confirm()
 */
function alertMessage(title, message, color = "#2563eb") {
  // We use a try...catch here because this function was the source of a UI crash
  try {
    alertTitle.textContent = title;
    alertMessageEl.textContent = message; // Set button color and class for hover effects

    const button = alertCloseBtn;
    button.style.backgroundColor = color;

    if (color === "#2563eb") button.className = "hover-blue";
    else if (color === "#dc2626") button.className = "hover-red";
    else if (color === "#22c55e") button.className = "hover-green";
    else button.className = "";

    alertModal.style.display = "flex";
  } catch (e) {
    console.error("CRITICAL ERROR: Custom alert failed to render.", e);
    console.error(
      "Ensure these elements exist in your HTML:",
      "#customAlert",
      "#alertTitle",
      "#alertMessage",
      "#alertCloseBtn"
    );
  }
}

// Ensure event listener is properly attached
if (alertCloseBtn) {
  alertCloseBtn.addEventListener("click", () => {
    alertModal.style.display = "none";
  });
}

/**
 * Shows the specified form/step element and hides all others.
 * The element must have the class 'enrollment-popup' or be 'admissionForm'.
 */
function showForm(formId) {
  const formElements = [
    mainForm,
    ...document.querySelectorAll(".enrollment-popup"),
  ];

  formElements.forEach((element) => {
    element.style.display = element.id === formId ? "flex" : "none";
  }); // If we are showing the review details, the back button should go to the subject form

  if (formId === "reviewalldetails") {
    const backButton = document.querySelector("#reviewalldetails .btn-close");
    const lastSubjectFormId =
      Array.from(document.querySelectorAll(".enrollment-popup")).find(
        (f) => f.dataset.for === formData.course
      )?.id || "admissionForm"; // If a back button exists, set its onclick to go to the specific Step 2 form.

    if (backButton) {
      backButton.onclick = () =>
        closePopup("reviewalldetails", lastSubjectFormId);
    }
  } // Determine the current step index

  let step = 1;
  if (formId.startsWith("subjectenroll") && formId !== "reviewalldetails") {
    step = 2;
  } else if (formId === "reviewalldetails") {
    step = 3;
  }
  updateProgressBar(step);
}

/**
 * Updates the visual progress tracker (stepper).
 */
function updateProgressBar(step) {
  const steps = [
    { circle: step1Circle, subtitle: step1Subtitle },
    { circle: step2Circle, subtitle: step2Subtitle },
    { circle: step3Circle, subtitle: step3Subtitle },
  ];

  steps.forEach((el, index) => {
    const currentStep = index + 1;

    el.circle.classList.remove("active", "completed");
    el.subtitle.textContent = "Pending";
    el.subtitle.style.color = "#9ca3af";

    if (currentStep < step) {
      el.circle.classList.add("completed");
      el.subtitle.textContent = "Completed";
    } else if (currentStep === step) {
      el.circle.classList.add("active");
      el.subtitle.textContent = currentStep === 3 ? "Reviewing" : "In Progress";
    }
  });
}

/**
 * Handles navigation back from Step 2/3 to a previous step.
 * @param {string} currentFormId - The ID of the form being closed.
 * @param {string} [targetFormId='admissionForm'] - The ID of the form to go back to.
 */
function closePopup(currentFormId, targetFormId = "admissionForm") {
  // 1. Hide the current form/div
  document.getElementById(currentFormId).style.display = "none"; // 2. Show the target form (defaults to Step 1)

  showForm(targetFormId);
}

// --- TERMS & CONDITIONS LOGIC ---

if (acceptBtn) {
  acceptBtn.addEventListener("click", function () {
    termsContainer.style.display = "none";
    asideForm.style.display = "block";
    showForm(mainForm.id); // Show Step 1
  });
}

if (declineBtn) {
  declineBtn.addEventListener("click", function () {
    tcContentBox.style.display = "none";
    declineMessage.style.display = "block"; // Show persistent decline message
    mainForm.style.display = "none";
    asideForm.style.display = "none";
    alertMessage(
      "Application Blocked",
      "You must accept the Terms and Conditions to proceed.",
      "#dc2626"
    );
    updateProgressBar(0);
  });
}

if (reopenTermsBtn) {
  reopenTermsBtn.addEventListener("click", function () {
    declineMessage.style.display = "none";
    tcContentBox.style.display = "block";
  });
}

// --- STEP 1 HANDLER (Personal Info & Course) ---

mainForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 1. Save Personal Data

  const data = new FormData(this);
  formData.personal = Object.fromEntries(data.entries());
  formData.course = formData.personal.course; // 2. Determine and show the correct Step 2 form

  const selectedCourse = formData.course;
  const targetPopup = document.querySelector(
    `.enrollment-popup[data-for="${selectedCourse}"]`
  );

  if (targetPopup) {
    showForm(targetPopup.id);
  } else if (selectedCourse === "") {
    alertMessage(
      "Course Required",
      "Please select a course to proceed to enrollment.",
      "#dc2626"
    );
  } else {
    alertMessage(
      "Error",
      `No enrollment form found for course: ${selectedCourse}`,
      "#dc2626"
    );
  }
});

// --- STEP 2 HANDLER (Subject Enrollment) ---

document.querySelectorAll(".enrollment-popup").forEach((form) => {
  // Only attach listener to forms that are not the review form
  if (form.id.startsWith("subjectenroll")) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const selectedSubjects = Array.from(
        this.querySelectorAll('input[name="subjects"]:checked')
      ).map((checkbox) => checkbox.value);

      if (selectedSubjects.length === 0) {
        alertMessage(
          "Selection Required",
          "You must select at least one subject to proceed to review.",
          "#dc2626"
        );
        return;
      } // 1. Save Subjects

      formData.subjects = selectedSubjects; // 2. Go to Step 3 (Review)

      showForm("reviewalldetails"); // 3. Render the review details

      renderReviewDetails(formData);
    });
  }
});

// --- STEP 3 RENDERER (Review) ---

function renderReviewDetails(data) {
  const tableContainer = document.querySelector("#reviewalldetails table"); // Helper to map course codes to full names

  const courseMap = {
    indtech: "BS Industrial Technology (BSIndTech)",
    hospitalitymanagement: "BS Hospitality Management (BSHM)",
    secondaryeduc: "BS Secondary Education (BSED)",
  };
  const courseFullName = courseMap[data.course] || data.course || "N/A"; // Function to generate a table row

  const tr = (label, value) => `
   <tr>
   <td style="font-weight: 600; width: 40%;">${label}</td>
   <td>${value}</td>
   </tr>
  `; // Function to generate a section header

  const sectionHeader = (title) => `
   <tr><td colspan="2" class="section-header">${title}</td></tr>
  `; // ⭐️ NEW: Screenshot instruction text
  const screenshotInstruction = `
  <p style="margin-bottom: 1rem; color: #dc2626; font-weight: 600; font-size: 0.95rem;">
 🚨 Important: Please take a screenshot of this page for your records before submitting!
  </p>
 `;

  let tableHtml = `
   <thead>
   <tr><th colspan="2">Application Review</th></tr>
   </thead>
   <tbody>
  `; // 1. Personal Information Section

  tableHtml += sectionHeader("Personal Information");
  tableHtml += tr("Full Name", data.personal.fullName || "N/A");
  tableHtml += tr("Birthdate", data.personal.birthdate || "N/A");
  tableHtml += tr("Gender", data.personal.gender || "N/A");
  tableHtml += tr("Email", data.personal.email || "N/A");
  tableHtml += tr("Phone Number", data.personal.phone || "N/A"); // 2. Course and Subject Enrollment Section

  tableHtml += sectionHeader("Course & Subject Enrollment");
  tableHtml += tr("Selected Course", courseFullName);

  const subjectsList =
    data.subjects && data.subjects.length > 0
      ? `<ul style="list-style-type: disc; padding-left: 20px; margin: 0;">${data.subjects
          .map((sub) => `<li>${sub}</li>`)
          .join("")}</ul>`
      : "No subjects selected.";

  tableHtml += tr("Enrolled Subjects", subjectsList);

  tableHtml += `
   </tbody>
   <tfoot>
   <tr>
   <td colspan="2" style="padding: 1.5rem; text-align: center; background-color: #f0f0f0;">
   ${screenshotInstruction} 
   <button id="finalSubmit" class="bg-green hover-green" style="padding: 15px 30px; font-size: 1.2rem;">
    Final Submit Application
   </button>
   </td>
   </tr>
   </tfoot>
  `;

  tableContainer.innerHTML = tableHtml;

  const submitBtn = document.getElementById("finalSubmit"); // This is the FIXED section for your final submit handler // Replace the finalSubmit button click handler in your form.js

  submitBtn.addEventListener("click", () => {
    // 1. Change UI to Loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending to Database..."; // 2. Send to Port 3000

    fetch("http://localhost:3000/save-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Server Response:", result);

        if (result.message === "Application Saved Successfully!") {
          // SUCCESS!
          submitBtn.textContent = "Submitted ✓";

          alertMessage(
            "Success!",
            "Your application has been saved successfully! You will now be redirected.",
            "#22c55e"
          ); // Optional: Redirect after 2 seconds

          setTimeout(() => {
            // ⭐ MODIFICATION HERE: Redirect to index.html
            window.location.href = "index.html";
          }, 2000);
        } else {
          throw new Error("Unexpected server response");
        }
      })
      .catch((err) => {
        console.error("Application submission failed:", err);
        alertMessage(
          "Submission Failed",
          "There was a server or database error. Check your backend terminal for details.",
          "#dc2626"
        );
        submitBtn.disabled = false;
        submitBtn.textContent = "Final Submit Application";
      });
  });
}

// --- INITIALIZATION ---
window.onload = function () {
  // Ensure the T&C modal is visible first
  termsContainer.style.display = "flex";
  tcContentBox.style.display = "block";
  declineMessage.style.display = "none";
  mainForm.style.display = "none";
  asideForm.style.display = "none";
  updateProgressBar(0); // Set all steps to pending initially
};
