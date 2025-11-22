document.addEventListener("DOMContentLoaded", () => {
  // --- REFERENCES (ERROR CHECK: Ensure these elements exist in the HTML) ---
  const toggleNavDiv = document.getElementById("toggle-nav");
  const menuButton = toggleNavDiv ? toggleNavDiv.querySelector("button") : null;
  const navContainer = document.querySelector(".nav-container");

  // --- MENU TOGGLE LOGIC ---
  let isTransitioning = false;
  const clickInterval = 300; // Cooldown to prevent rapid clicks

  function toggleMenu() {
    if (isTransitioning || !navContainer || !menuButton) {
      // ERROR CHECK: Exit if elements are missing or transition is active
      return;
    }

    isTransitioning = true;
    navContainer.classList.toggle("active");

    // Icon switching logic
    const isNavOpen = navContainer.classList.contains("active");
    const svgIcon = menuButton.querySelector("svg");

    if (svgIcon) {
      if (isNavOpen) {
        // Open state icon (X)
        svgIcon.innerHTML = `
                    <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708 0z"/>
                `;
      } else {
        // Closed state icon (Hamburger)
        svgIcon.innerHTML = `
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                `;
      }
    }

    setTimeout(() => {
      isTransitioning = false;
    }, clickInterval);
  }

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  // --- Auto-Close Nav Bar Logic for Mobile ---
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navContainer && navContainer.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  // --- VIDEO CONTROL LOGIC ---
  // CRITICAL: Using ID "pingPongVideo" as defined in your HTML.
  const video = document.getElementById("pingPongVideo");

  if (video) {
    video.onended = () => {
      video.pause();
      video.currentTime = video.duration;
    };

    video.play().catch((error) => {
      console.log("Video Autoplay prevented.", error);
    });
  } else {
    console.error("ERROR: Video element ID 'pingPongVideo' not found in DOM.");
  }

  // -------------------------------------------------------------
  // --- SMART HEADER LOGIC (Hide/Show on Scroll) ---
  // -------------------------------------------------------------
  const navContainerElement = document.querySelector(".nav-container");
  let lastScrollY = 0;
  const scrollThreshold = 50;

  // CRITICAL: Define the media query that determines "mobile view"
  // NOTE: Use the same width defined in your CSS media query (max-width: 600px)
  const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

  function handleSmartScroll() {
    if (!navContainerElement) {
      // ERROR CHECK: Exit if nav container is missing
      return;
    }

    // NEW LOGIC: If the screen matches the mobile media query, stop the smart scroll.
    if (mobileMediaQuery.matches) {
      // Ensure the header is visible and stable when the script stops tracking on mobile
      navContainerElement.classList.remove("nav-hidden");
      return; // Exit the function completely on mobile
    }

    const currentScrollY = window.scrollY;

    // --- DESKTOP SCROLL LOGIC ONLY ---
    // Scroll Down: HIDE navigation if scrolled past 200px
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      navContainerElement.classList.add("nav-hidden");
    }
    // Scroll Up OR near top: SHOW navigation
    else if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold) {
      navContainerElement.classList.remove("nav-hidden");
    }

    // Update scroll position for next comparison
    lastScrollY = currentScrollY;
  }

  window.addEventListener("scroll", handleSmartScroll);
});

document.addEventListener("DOMContentLoaded", (event) => {
  // 1. Get a reference to the target element
  const targetElement = document.getElementById("header1");

  if (targetElement) {
    // 2. Use the scrollIntoView() method to scroll the element into the viewport
    targetElement.scrollIntoView({
      behavior: "smooth", // Optional: Makes the scroll smooth
      block: "start", // Optional: Aligns the top of the element to the top of the viewport
    });
  }
});
