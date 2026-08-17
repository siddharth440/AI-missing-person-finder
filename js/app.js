/* ==========================================================================
   FindSafe AI - Core Application & Global UI Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupGlobalModals();
  updateHeaderStats();
});

// Mobile Nav Toggle & Active Page Link Highlighter
function setupNavigation() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // Highlight active link based on window location
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Global Toast Notification Drawer
function showToast(message, type = "info", duration = 4000) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconClass = "fa-circle-info";
  if (type === "success") iconClass = "fa-circle-check";
  if (type === "warning") iconClass = "fa-triangle-exclamation";
  if (type === "danger") iconClass = "fa-circle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <div style="flex-grow:1; font-size:0.9rem;">${message}</div>
    <button style="background:none; border:none; color:inherit; cursor:pointer; font-size:1rem;" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

// Global Modal Controller
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

function setupGlobalModals() {
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  document.querySelectorAll(".modal-close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
      const modal = closeBtn.closest(".modal-overlay");
      if (modal) closeModal(modal.id);
    });
  });
}

// Copy to Clipboard Utility
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard!`, "success");
  }).catch(err => {
    console.error("Clipboard error:", err);
    showToast("Failed to copy to clipboard", "warning");
  });
}

// Common Badge Class Mapping
function getBadgeClass(status) {
  switch (status) {
    case "Active": return "badge-active";
    case "Under Investigation": return "badge-investigation";
    case "Potential Match": return "badge-match";
    case "Found": return "badge-found";
    case "Closed": return "badge-closed";
    default: return "badge-active";
  }
}

// Global Quick Stat Counter Updates
function updateHeaderStats() {
  const cases = getCases();
  const sightings = getSightings();

  const activeCount = cases.filter(c => c.status === "Active").length;
  const foundCount = cases.filter(c => c.status === "Found").length;
  const matchCount = cases.filter(c => c.status === "Potential Match").length;

  const elActive = document.getElementById("stat-active-count");
  const elFound = document.getElementById("stat-found-count");
  const elSightings = document.getElementById("stat-sightings-count");
  const elMatches = document.getElementById("stat-matches-count");

  if (elActive) elActive.textContent = activeCount;
  if (elFound) elFound.textContent = foundCount;
  if (elSightings) elSightings.textContent = sightings.length;
  if (elMatches) elMatches.textContent = matchCount;
}
