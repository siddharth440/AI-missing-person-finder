/* ==========================================================================
   FindSafe AI - Public Sighting Intake & Management
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupSightingForm();
});

function setupSightingForm() {
  const form = document.getElementById("sighting-report-form");
  if (!form) return;

  // Auto-fill Case ID from URL parameter if present
  const urlParams = new URLSearchParams(window.location.search);
  const caseIdFromUrl = urlParams.get("caseId");

  const caseIdInput = document.getElementById("sighting-case-id");
  if (caseIdInput && caseIdFromUrl) {
    caseIdInput.value = caseIdFromUrl;
    renderSelectedCasePreview(caseIdFromUrl);
  }

  if (caseIdInput) {
    caseIdInput.addEventListener("change", (e) => {
      renderSelectedCasePreview(e.target.value.trim());
    });
  }

  // Handle Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitSightingReport();
  });
}

function renderSelectedCasePreview(caseId) {
  const previewContainer = document.getElementById("sighting-case-preview");
  if (!previewContainer) return;

  const c = getCaseById(caseId);
  if (c) {
    previewContainer.innerHTML = `
      <div style="display:flex; gap:1rem; align-items:center; background:var(--accent-50); border:1px solid var(--accent-100); border-radius:var(--radius-md); padding:0.85rem 1rem; margin-top:0.5rem;">
        <img src="${c.photo}" alt="${c.name}" style="width:48px; height:48px; border-radius:var(--radius-sm); object-fit:cover;"/>
        <div>
          <strong style="color:var(--primary-900); font-size:0.95rem;">${c.name}</strong>
          <span style="display:block; font-size:0.8rem; color:var(--neutral-600);">${c.age} yrs • Last seen ${c.city}, ${c.state}</span>
        </div>
      </div>
    `;
  } else {
    previewContainer.innerHTML = `<span style="font-size:0.8rem; color:var(--rose-600); margin-top:0.25rem; display:block;">Case ID not found in database. Please verify the ID.</span>`;
  }
}

function submitSightingReport() {
  const caseId = document.getElementById("sighting-case-id").value.trim();
  const personDesc = document.getElementById("sighting-desc").value.trim();
  const date = document.getElementById("sighting-date").value;
  const time = document.getElementById("sighting-time").value;
  const location = document.getElementById("sighting-location").value.trim();
  const city = document.getElementById("sighting-city").value.trim();
  const state = document.getElementById("sighting-state").value.trim();
  const reporterName = document.getElementById("reporter-name").value.trim() || "Anonymous Tipster";
  const reporterContact = document.getElementById("reporter-contact").value.trim() || "N/A";
  const isAnonymous = document.getElementById("anonymous-toggle").checked;

  if (!caseId || !date || !location || !city) {
    showToast("Please complete all required fields (*)", "warning");
    return;
  }

  const sightingId = generateSightingId();

  const newSighting = {
    id: sightingId,
    caseId: caseId,
    personDescription: personDesc,
    date: date,
    time: time || "Unknown",
    location: location,
    city: city,
    state: state,
    description: personDesc,
    reporterName: isAnonymous ? "Anonymous Tipster" : reporterName,
    reporterContact: isAnonymous ? "Hidden" : reporterContact,
    isAnonymous: isAnonymous,
    verified: false,
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage
  saveSighting(newSighting);

  // Update Case status to "Under Investigation" if active
  const targetCase = getCaseById(caseId);
  if (targetCase && targetCase.status === "Active") {
    updateCase(caseId, { status: "Under Investigation" });
  }

  // Display Confirmation Modal
  showSightingSuccessModal(newSighting);
}

function showSightingSuccessModal(sighting) {
  let modal = document.getElementById("sighting-success-modal");
  if (!modal) {
    const modalHtml = `
      <div class="modal-overlay" id="sighting-success-modal">
        <div class="modal-dialog">
          <div class="modal-header" style="background:var(--emerald-600); color:var(--white);">
            <h3 class="modal-title" style="color:var(--white);"><i class="fa-solid fa-circle-check"></i> Sighting Tip Submitted</h3>
            <button class="modal-close" style="color:var(--white);" onclick="closeModal('sighting-success-modal')">&times;</button>
          </div>
          <div class="modal-body" style="text-align:center; padding:2rem 1.5rem;">
            <div style="width:64px; height:64px; border-radius:50%; background:var(--emerald-100); color:var(--emerald-600); font-size:2rem; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
              <i class="fa-solid fa-check"></i>
            </div>
            <h3 style="font-size:1.4rem; color:var(--primary-900); font-weight:800; margin-bottom:0.5rem;">Thank You for Your Report</h3>
            <p style="color:var(--neutral-600); margin-bottom:1.5rem; font-size:0.95rem;">
              Your sighting record has been safely logged with Sighting ID <strong style="font-family:var(--font-mono); color:var(--accent-600);" id="modal-sighting-id">ST-XXXX</strong>.
            </p>
            <div style="background:var(--neutral-100); padding:1rem; border-radius:var(--radius-md); text-align:left; font-size:0.875rem; margin-bottom:1.5rem;" id="modal-sighting-summary">
            </div>
            <div style="display:flex; gap:0.75rem; justify-content:center;">
              <a href="search.html" class="btn btn-outline">Back to Directory</a>
              <a href="" id="modal-view-case-btn" class="btn btn-primary">View Case Dossier</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    modal = document.getElementById("sighting-success-modal");
  }

  document.getElementById("modal-sighting-id").textContent = sighting.id;
  document.getElementById("modal-view-case-btn").href = `case.html?id=${sighting.caseId}`;
  document.getElementById("modal-sighting-summary").innerHTML = `
    <div><strong>Case ID:</strong> ${sighting.caseId}</div>
    <div><strong>Location:</strong> ${sighting.location}, ${sighting.city}</div>
    <div><strong>Date/Time:</strong> ${sighting.date} at ${sighting.time}</div>
  `;

  openModal("sighting-success-modal");
  showToast("Sighting report successfully transmitted!", "success");
}
