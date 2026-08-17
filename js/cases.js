/* ==========================================================================
   FindSafe AI - Case Management & Directory Renderer
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cases-grid-container")) {
    renderCasesDirectory();
    setupSearchAndFilters();
  }

  if (document.getElementById("case-details-container")) {
    renderCaseDetailsPage();
  }

  if (document.getElementById("featured-cases-container")) {
    renderFeaturedCases();
  }
});

let currentFilterStatus = "All";
let currentSearchQuery = "";
let currentSortOrder = "newest";

// Render Full Search Directory Grid
function renderCasesDirectory() {
  const container = document.getElementById("cases-grid-container");
  if (!container) return;

  let cases = getCases();

  // Apply Status Filter
  if (currentFilterStatus !== "All") {
    cases = cases.filter(c => c.status === currentFilterStatus);
  }

  // Apply Search Query
  if (currentSearchQuery.trim() !== "") {
    const q = currentSearchQuery.toLowerCase();
    cases = cases.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      (c.clothingDescription && c.clothingDescription.toLowerCase().includes(q))
    );
  }

  // Apply Sorting
  cases.sort((a, b) => {
    if (currentSortOrder === "newest") return new Date(b.dateMissing) - new Date(a.dateMissing);
    if (currentSortOrder === "oldest") return new Date(a.dateMissing) - new Date(b.dateMissing);
    if (currentSortOrder === "name") return a.name.localeCompare(b.name);
    if (currentSortOrder === "age") return a.age - b.age;
    return 0;
  });

  // Empty State Handler
  if (cases.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--white); border-radius: var(--radius-xl); border: 1px dashed var(--neutral-300);">
        <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--neutral-400); margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.3rem; color: var(--primary-900);">No Missing Person Records Found</h3>
        <p style="color: var(--neutral-500); max-width: 450px; margin: 0.5rem auto 1.5rem;">No cases matched your filter criteria "${currentSearchQuery || currentFilterStatus}". Try resetting your search.</p>
        <button class="btn btn-outline" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = cases.map(c => createCaseCardHtml(c)).join("");
}

// Case Card Template Generator
function createCaseCardHtml(c) {
  const badgeClass = getBadgeClass(c.status);
  return `
    <article class="case-card">
      <div class="case-image-wrapper">
        <img src="${c.photo}" alt="Photograph of ${c.name}" class="case-image" loading="lazy"/>
        <span class="case-badge ${badgeClass}">${c.status}</span>
        <span class="case-id-tag">${c.id}</span>
      </div>
      <div class="case-content">
        <h3 class="case-name">${c.name}</h3>
        <div class="case-meta-grid">
          <div class="case-meta-item">
            <i class="fa-solid fa-user"></i>
            <span>${c.age} yrs • ${c.gender}</span>
          </div>
          <div class="case-meta-item">
            <i class="fa-solid fa-calendar-day"></i>
            <span>${c.dateMissing}</span>
          </div>
          <div class="case-meta-item" style="grid-column: 1 / -1;">
            <i class="fa-solid fa-location-dot"></i>
            <span>${c.city}, ${c.state}</span>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--neutral-600); margin-bottom: 1rem; line-clamp: 2; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">
          ${c.clothingDescription || c.additionalInfo || 'No detailed description available.'}
        </p>
        <div class="case-actions">
          <a href="case.html?id=${c.id}" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-file-invoice"></i> View Dossier
          </a>
          <button class="btn btn-outline btn-sm" onclick="openAIMatchModal('${c.id}')" title="Run AI Lead Simulation">
            <i class="fa-solid fa-microchip"></i> Match AI
          </button>
        </div>
      </div>
    </article>
  `;
}

// Render Featured Cases on Home Page
function renderFeaturedCases() {
  const container = document.getElementById("featured-cases-container");
  if (!container) return;

  const cases = getCases().slice(0, 3);
  container.innerHTML = cases.map(c => createCaseCardHtml(c)).join("");
}

// Setup Search Inputs & Filter Toolbar Listeners
function setupSearchAndFilters() {
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const filterPills = document.querySelectorAll(".filter-pill");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      renderCasesDirectory();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSortOrder = e.target.value;
      renderCasesDirectory();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilterStatus = pill.getAttribute("data-filter");
      renderCasesDirectory();
    });
  });
}

function resetFilters() {
  currentFilterStatus = "All";
  currentSearchQuery = "";
  currentSortOrder = "newest";

  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";

  const filterPills = document.querySelectorAll(".filter-pill");
  filterPills.forEach(p => {
    if (p.getAttribute("data-filter") === "All") p.classList.add("active");
    else p.classList.remove("active");
  });

  renderCasesDirectory();
}

// Render Case Details Page (case.html?id=FS-2026-0001)
function renderCaseDetailsPage() {
  const container = document.getElementById("case-details-container");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id") || "FS-2026-0001";

  const c = getCaseById(caseId);
  if (!c) {
    container.innerHTML = `
      <div style="text-align:center; padding:5rem 1rem;">
        <h2>Case Not Found</h2>
        <p>The requested missing person dossier "${caseId}" could not be located in local memory.</p>
        <a href="search.html" class="btn btn-primary" style="margin-top:1rem;">Back to Directory</a>
      </div>
    `;
    return;
  }

  const sightings = getSightingsByCaseId(c.id);
  const badgeClass = getBadgeClass(c.status);

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:2.5rem; align-items:start;">
      <!-- Left Column: Photo & Quick Actions -->
      <div style="background:var(--white); border-radius:var(--radius-xl); padding:1.5rem; border:1px solid var(--neutral-200); box-shadow:var(--shadow-lg);">
        <div style="position:relative; width:100%; height:320px; border-radius:var(--radius-lg); overflow:hidden; margin-bottom:1.25rem;">
          <img src="${c.photo}" alt="${c.name}" style="width:100%; height:100%; object-fit:cover;"/>
          <span class="case-badge ${badgeClass}" style="top:1rem; right:1rem;">${c.status}</span>
        </div>
        <div style="text-align:center; margin-bottom:1.5rem;">
          <h1 style="font-size:1.85rem; font-weight:800; color:var(--primary-900);">${c.name}</h1>
          <span style="font-family:var(--font-mono); color:var(--accent-500); font-weight:700; font-size:1rem;">${c.id}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <a href="sighting.html?caseId=${c.id}" class="btn btn-primary" style="width:100%;">
            <i class="fa-solid fa-eye"></i> Report Sighting
          </a>
          <button class="btn btn-secondary" style="width:100%; background:var(--primary-800);" onclick="openAIMatchModal('${c.id}')">
            <i class="fa-solid fa-microchip"></i> Run AI Match Lead Engine
          </button>
          <button class="btn btn-outline" style="width:100%;" onclick="copyToClipboard(window.location.href)">
            <i class="fa-solid fa-share-nodes"></i> Share Dossier Link
          </button>
        </div>
      </div>

      <!-- Right Column: Case Dossier & Attributes -->
      <div style="display:flex; flex-direction:column; gap:2rem;">
        <div style="background:var(--white); border-radius:var(--radius-xl); padding:2rem; border:1px solid var(--neutral-200); box-shadow:var(--shadow-md);">
          <h2 style="font-size:1.35rem; font-weight:800; color:var(--primary-900); margin-bottom:1.25rem; border-bottom:2px solid var(--neutral-100); padding-bottom:0.75rem;">
            Physical Attributes & Timeline
          </h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem;">
            <div><strong>Age:</strong> ${c.age} years old</div>
            <div><strong>Gender:</strong> ${c.gender}</div>
            <div><strong>Height:</strong> ${c.height || 'N/A'}</div>
            <div><strong>Date Missing:</strong> ${c.dateMissing} (${c.timeMissing || 'Unknown'})</div>
            <div><strong>Last Location:</strong> ${c.lastSeenLocation}</div>
            <div><strong>City / State:</strong> ${c.city}, ${c.state}, ${c.country || 'USA'}</div>
          </div>
          <div style="margin-bottom:1.25rem;">
            <strong style="display:block; color:var(--primary-900); margin-bottom:0.25rem;">Clothing Description:</strong>
            <p style="color:var(--neutral-700); font-size:0.95rem;">${c.clothingDescription || 'No clothing record uploaded.'}</p>
          </div>
          <div style="margin-bottom:1.25rem;">
            <strong style="display:block; color:var(--primary-900); margin-bottom:0.25rem;">Identifying Marks & Tattoos:</strong>
            <p style="color:var(--neutral-700); font-size:0.95rem;">${c.identifyingMarks || 'None recorded.'}</p>
          </div>
          <div>
            <strong style="display:block; color:var(--primary-900); margin-bottom:0.25rem;">Contact & Law Enforcement Agency:</strong>
            <p style="color:var(--accent-600); font-weight:600; font-size:0.95rem;">${c.contactInfo || 'Local Responders'}</p>
          </div>
        </div>

        <!-- Sightings History Timeline -->
        <div style="background:var(--white); border-radius:var(--radius-xl); padding:2rem; border:1px solid var(--neutral-200); box-shadow:var(--shadow-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <h2 style="font-size:1.35rem; font-weight:800; color:var(--primary-900);">
              Reported Sightings (${sightings.length})
            </h2>
            <a href="sighting.html?caseId=${c.id}" class="btn btn-outline btn-sm">+ Add Sighting</a>
          </div>

          ${sightings.length === 0 ? `
            <p style="color:var(--neutral-500); text-align:center; padding:2rem 0;">No community sightings reported for this case yet.</p>
          ` : `
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${sightings.map(s => `
                <div style="background:var(--neutral-50); border:1px solid var(--neutral-200); border-radius:var(--radius-md); padding:1rem 1.25rem;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <strong style="color:var(--primary-900); font-size:0.95rem;"><i class="fa-solid fa-location-dot" style="color:var(--accent-500);"></i> ${s.location}, ${s.city}</strong>
                    <span style="font-size:0.8rem; color:var(--neutral-500);">${s.date} at ${s.time}</span>
                  </div>
                  <p style="font-size:0.9rem; color:var(--neutral-700); margin-bottom:0.5rem;">${s.description}</p>
                  <div style="font-size:0.775rem; color:var(--neutral-500);">Reported by: ${s.isAnonymous ? 'Anonymous Tipster' : s.reporterName}</div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
