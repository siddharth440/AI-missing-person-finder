/* ==========================================================================
   FindSafe AI - Storage Manager (Browser LocalStorage Engine)
   ========================================================================== */

const STORAGE_KEYS = {
  CASES: "findsafe_cases_v1",
  SIGHTINGS: "findsafe_sightings_v1",
  SETTINGS: "findsafe_settings_v1"
};

// Initialize LocalStorage with seed dataset if empty
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CASES)) {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(INITIAL_DEMO_CASES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SIGHTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(INITIAL_DEMO_SIGHTINGS));
  }
}

// Case Operations
function getCases() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES)) || [];
  } catch (e) {
    console.error("Error reading cases from storage:", e);
    return INITIAL_DEMO_CASES;
  }
}

function getCaseById(id) {
  const cases = getCases();
  return cases.find(c => c.id === id) || null;
}

function saveCase(newCase) {
  const cases = getCases();
  cases.unshift(newCase);
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  return newCase;
}

function updateCase(id, updatedFields) {
  const cases = getCases();
  const index = cases.findIndex(c => c.id === id);
  if (index !== -1) {
    cases[index] = { ...cases[index], ...updatedFields, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    return cases[index];
  }
  return null;
}

function deleteCase(id) {
  let cases = getCases();
  cases = cases.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  
  // Also clean up sightings linked to this case
  let sightings = getSightings();
  sightings = sightings.filter(s => s.caseId !== id);
  localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(sightings));
}

// Sighting Operations
function getSightings() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SIGHTINGS)) || [];
  } catch (e) {
    console.error("Error reading sightings from storage:", e);
    return INITIAL_DEMO_SIGHTINGS;
  }
}

function getSightingsByCaseId(caseId) {
  const sightings = getSightings();
  return sightings.filter(s => s.caseId === caseId);
}

function saveSighting(sighting) {
  const sightings = getSightings();
  sightings.unshift(sighting);
  localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(sightings));
  return sighting;
}

// Utility ID Generators
function generateCaseId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FS-2026-${randomNum}`;
}

function generateSightingId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ST-${randomNum}`;
}

// Master Reset & Export
function resetDemoData() {
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(INITIAL_DEMO_CASES));
  localStorage.setItem(STORAGE_KEYS.SIGHTINGS, JSON.stringify(INITIAL_DEMO_SIGHTINGS));
}

function exportJSON() {
  const data = {
    cases: getCases(),
    sightings: getSightings(),
    exportedAt: new Date().toISOString(),
    system: "FindSafe AI Prototype v1.0"
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `findsafe_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on script execution
initStorage();
