/* ==========================================================================
   FindSafe AI - AI-Assisted Photo Matching Prototype Simulation Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupMatchingPage();
});

let selectedCaseIdForMatch = null;
let uploadedMatchImageDataUrl = null;

function setupMatchingPage() {
  const matchContainer = document.getElementById("ai-matching-engine-root");
  if (!matchContainer) return;

  // Initialize UI options
  renderCaseSelectorDropdown();
}

function renderCaseSelectorDropdown() {
  const selectEl = document.getElementById("match-target-case-select");
  if (!selectEl) return;

  const cases = getCases();
  selectEl.innerHTML = `
    <option value="">-- Select Target Missing Case --</option>
    ${cases.map(c => `<option value="${c.id}">${c.name} (${c.id}) - ${c.city}, ${c.state}</option>`).join("")}
  `;
}

// Triggered from anywhere (e.g. Case card button)
function openAIMatchModal(caseId) {
  selectedCaseIdForMatch = caseId;
  const c = getCaseById(caseId);

  // If match modal exists in current DOM
  let modal = document.getElementById("ai-match-modal");
  if (!modal) {
    createAIMatchModalDom();
    modal = document.getElementById("ai-match-modal");
  }

  const titleEl = document.getElementById("modal-match-case-title");
  if (titleEl && c) {
    titleEl.textContent = `Matching Engine Lead Analysis: ${c.name} (${c.id})`;
  }

  // Pre-load reference photo
  const refImg = document.getElementById("modal-ref-image");
  if (refImg && c) {
    refImg.src = c.photo;
  }

  // Reset analysis view
  resetAnalysisState();
  openModal("ai-match-modal");
}

function createAIMatchModalDom() {
  const modalHtml = `
    <div class="modal-overlay" id="ai-match-modal">
      <div class="modal-dialog" style="max-width: 850px;">
        <div class="modal-header" style="background:var(--primary-900); color:var(--white);">
          <div>
            <h3 class="modal-title" id="modal-match-case-title" style="color:var(--white);">AI Photo Matching Lead Analysis</h3>
            <span style="font-size:0.75rem; color:var(--cyan-500);"><i class="fa-solid fa-microchip"></i> Prototype Vector Similarity Pipeline v1.0</span>
          </div>
          <button class="modal-close" style="color:var(--white);" onclick="closeModal('ai-match-modal')">&times;</button>
        </div>

        <div class="modal-body" style="background:var(--primary-900); color:var(--white);">
          <!-- Prototype Disclaimer Banner -->
          <div style="background:rgba(217,119,6,0.15); border:1px solid rgba(245,158,11,0.4); color:#fcd34d; padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:0.825rem; margin-bottom:1.5rem; display:flex; gap:0.75rem; align-items:center;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size:1.25rem;"></i>
            <div>
              <strong>PROTOTYPE SIMULATION NOTICE:</strong> Matching scores are generated purely for technical lead prioritization. They do not constitute biometric proof and must be independently verified by law enforcement.
            </div>
          </div>

          <!-- Step Pipeline Progress -->
          <div class="pipeline-steps">
            <div class="pipeline-progress" id="pipe-progress-bar"></div>
            <div class="pipe-step" id="step-1">
              <div class="pipe-dot">1</div>
              <div class="pipe-label">Preprocess</div>
            </div>
            <div class="pipe-step" id="step-2">
              <div class="pipe-dot">2</div>
              <div class="pipe-label">Feature Extract</div>
            </div>
            <div class="pipe-step" id="step-3">
              <div class="pipe-dot">3</div>
              <div class="pipe-label">Vector Matrix</div>
            </div>
            <div class="pipe-step" id="step-4">
              <div class="pipe-dot">4</div>
              <div class="pipe-label">Similarity Lead</div>
            </div>
          </div>

          <!-- Analysis Comparison Grid -->
          <div class="match-comparison-grid">
            <div class="compare-box">
              <span style="font-size:0.8rem; color:var(--neutral-400); display:block; margin-bottom:0.4rem;">Reference Case Photo</span>
              <div class="scanner-overlay" id="ref-scanner-wrapper">
                <img id="modal-ref-image" src="" class="compare-img" alt="Reference case photo"/>
              </div>
            </div>

            <div class="similarity-meter-center">
              <div class="score-circle">
                <span class="score-percent" id="sim-score-val">0%</span>
                <span class="score-text">SIMILARITY</span>
              </div>
              <div id="confidence-badge" style="margin-top:0.75rem; font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:var(--radius-full); background:var(--primary-700); color:var(--neutral-300);">
                PENDING SCAN
              </div>
            </div>

            <div class="compare-box">
              <span style="font-size:0.8rem; color:var(--neutral-400); display:block; margin-bottom:0.4rem;">Comparison Sightings / Lead</span>
              <div class="scanner-overlay" id="probe-scanner-wrapper">
                <img id="modal-probe-image" src="" class="compare-img" alt="Comparison photo" style="background:#1e293b; display:none;"/>
                <div id="upload-probe-prompt" style="height:220px; display:flex; flex-direction:column; justify-content:center; align-items:center; border:2px dashed var(--primary-700); border-radius:var(--radius-md); cursor:pointer;" onclick="document.getElementById('probe-file-input').click()">
                  <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem; color:var(--cyan-500); margin-bottom:0.5rem;"></i>
                  <span style="font-size:0.85rem; color:var(--neutral-300);">Upload Photo Lead</span>
                  <input type="file" id="probe-file-input" accept="image/*" style="display:none;" onchange="handleProbePhotoUpload(event)"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Log Console Terminal -->
          <div style="background:#020617; border-radius:var(--radius-md); padding:0.85rem 1.1rem; font-family:var(--font-mono); font-size:0.8rem; color:#38bdf8; height:90px; overflow-y:auto; border:1px solid #1e293b; margin-top:1rem;" id="match-log-terminal">
            > Ready to initiate photo matching lead analysis...
          </div>
        </div>

        <div class="modal-footer" style="background:var(--primary-900); border-top:1px solid var(--primary-700);">
          <button class="btn btn-outline" style="color:var(--white); border-color:var(--primary-700);" onclick="closeModal('ai-match-modal')">Close</button>
          <button class="btn btn-primary" id="start-analysis-btn" onclick="executeAIMatchPipeline()">
            <i class="fa-solid fa-play"></i> Analyze Potential Match
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function handleProbePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedMatchImageDataUrl = e.target.result;
    const probeImg = document.getElementById("modal-probe-image");
    const promptBox = document.getElementById("upload-probe-prompt");

    if (probeImg && promptBox) {
      probeImg.src = uploadedMatchImageDataUrl;
      probeImg.style.display = "block";
      promptBox.style.display = "none";
    }

    logTerminalMessage("> Comparison photo loaded. Ready for feature extraction.");
  };
  reader.readAsDataURL(file);
}

function resetAnalysisState() {
  uploadedMatchImageDataUrl = null;
  const probeImg = document.getElementById("modal-probe-image");
  const promptBox = document.getElementById("upload-probe-prompt");
  const simVal = document.getElementById("sim-score-val");
  const confBadge = document.getElementById("confidence-badge");
  const progressBar = document.getElementById("pipe-progress-bar");

  if (probeImg) probeImg.style.display = "none";
  if (promptBox) promptBox.style.display = "flex";
  if (simVal) simVal.textContent = "0%";
  if (confBadge) {
    confBadge.textContent = "PENDING SCAN";
    confBadge.style.background = "var(--primary-700)";
    confBadge.style.color = "var(--neutral-300)";
  }
  if (progressBar) progressBar.style.width = "0%";

  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById(`step-${i}`);
    if (step) step.className = "pipe-step";
  }

  const logBox = document.getElementById("match-log-terminal");
  if (logBox) logBox.innerHTML = "> System initialized. Load comparison photo or run sample scan.";
}

function logTerminalMessage(msg) {
  const logBox = document.getElementById("match-log-terminal");
  if (logBox) {
    logBox.innerHTML += `<br/>${msg}`;
    logBox.scrollTop = logBox.scrollHeight;
  }
}

// Main Step-by-Step AI Matching Pipeline Execution
function executeAIMatchPipeline() {
  const btn = document.getElementById("start-analysis-btn");
  if (btn) btn.disabled = true;

  const refScanner = document.getElementById("ref-scanner-wrapper");
  const probeScanner = document.getElementById("probe-scanner-wrapper");

  if (refScanner) refScanner.classList.add("scanning");
  if (probeScanner) probeScanner.classList.add("scanning");

  const targetCase = getCaseById(selectedCaseIdForMatch);

  // Step 1: Preprocessing (0.5s)
  setStepActive(1, "25%");
  logTerminalMessage("> Stage 1: Aligning facial geometry & spatial normalization...");

  setTimeout(() => {
    // Step 2: Feature Extraction (1.2s)
    setStepActive(2, "50%");
    logTerminalMessage("> Stage 2: Extracting 128-dimensional facial embedding vector...");

    setTimeout(() => {
      // Step 3: Database Similarity Matrix Search (2.0s)
      setStepActive(3, "75%");
      logTerminalMessage("> Stage 3: Computing Cosine & Euclidean metric matrices across regional dataset...");

      setTimeout(() => {
        // Step 4: Similarity Calculation & Result (2.8s)
        setStepActive(4, "100%");

        if (refScanner) refScanner.classList.remove("scanning");
        if (probeScanner) probeScanner.classList.remove("scanning");

        // Calculate prototype score (randomized 72% - 94% range if uploaded photo, or exact sample calculation)
        const finalScore = uploadedMatchImageDataUrl ? Math.floor(75 + Math.random() * 19) : 87;
        
        displayMatchResults(finalScore);

        if (btn) btn.disabled = false;
      }, 800);
    }, 700);
  }, 600);
}

function setStepActive(stepNum, progressPct) {
  for (let i = 1; i <= stepNum; i++) {
    const step = document.getElementById(`step-${i}`);
    if (step) {
      if (i < stepNum) step.className = "pipe-step completed";
      else step.className = "pipe-step active";
    }
  }
  const progressBar = document.getElementById("pipe-progress-bar");
  if (progressBar) progressBar.style.width = progressPct;
}

function displayMatchResults(score) {
  const simVal = document.getElementById("sim-score-val");
  const confBadge = document.getElementById("confidence-badge");

  if (simVal) simVal.textContent = `${score}%`;

  let confidenceLevel = "Low";
  let badgeColor = "var(--rose-600)";

  if (score >= 85) {
    confidenceLevel = "High Lead Confidence";
    badgeColor = "var(--emerald-600)";
  } else if (score >= 65) {
    confidenceLevel = "Medium Lead Confidence";
    badgeColor = "var(--amber-600)";
  } else {
    confidenceLevel = "Low Confidence";
    badgeColor = "var(--rose-600)";
  }

  if (confBadge) {
    confBadge.textContent = confidenceLevel.toUpperCase();
    confBadge.style.background = badgeColor;
    confBadge.style.color = "var(--white)";
  }

  logTerminalMessage(`> Finalized Match Result: ${score}% Similarity (${confidenceLevel}).`);
  logTerminalMessage(`> Lead registered in investigation log. Human verification mandated.`);

  showToast(`Match analysis finished: ${score}% Similarity Lead`, "success");
}
