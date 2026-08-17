/* ==========================================================================
   FindSafe AI - Analytics & Chart Visualizations Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("dashboard-root") || document.getElementById("canvas-status-chart")) {
    initDashboard();
  }
});

function initDashboard() {
  const cases = getCases();
  const sightings = getSightings();

  renderSummaryCards(cases, sightings);

  // Attempt Chart.js rendering, or fallback to pure HTML5 Canvas drawing
  if (typeof Chart !== "undefined") {
    renderChartJsCharts(cases);
  } else {
    renderCanvasFallbackCharts(cases);
  }
}

function renderSummaryCards(cases, sightings) {
  const total = cases.length;
  const active = cases.filter(c => c.status === "Active").length;
  const found = cases.filter(c => c.status === "Found").length;
  const matches = cases.filter(c => c.status === "Potential Match").length;
  const sightingsCount = sightings.length;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setVal("dash-total-cases", total);
  setVal("dash-active-cases", active);
  setVal("dash-found-cases", found);
  setVal("dash-sightings-count", sightingsCount);
  setVal("dash-matches-count", matches);
}

// Chart.js rendering implementation
function renderChartJsCharts(cases) {
  // Status Breakdown (Doughnut)
  const ctxStatus = document.getElementById("canvas-status-chart");
  if (ctxStatus) {
    const statusCounts = {
      Active: cases.filter(c => c.status === "Active").length,
      "Under Investigation": cases.filter(c => c.status === "Under Investigation").length,
      "Potential Match": cases.filter(c => c.status === "Potential Match").length,
      Found: cases.filter(c => c.status === "Found").length,
      Closed: cases.filter(c => c.status === "Closed").length
    };

    new Chart(ctxStatus, {
      type: "doughnut",
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: ["#e11d48", "#f59e0b", "#0ea5e9", "#10b981", "#64748b"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  // Age Distribution (Bar)
  const ctxAge = document.getElementById("canvas-age-chart");
  if (ctxAge) {
    const ageBrackets = {
      "Minor (0-17)": cases.filter(c => c.age < 18).length,
      "Young Adult (18-30)": cases.filter(c => c.age >= 18 && c.age <= 30).length,
      "Adult (31-59)": cases.filter(c => c.age >= 31 && c.age <= 59).length,
      "Senior (60+)": cases.filter(c => c.age >= 60).length
    };

    new Chart(ctxAge, {
      type: "bar",
      data: {
        labels: Object.keys(ageBrackets),
        datasets: [{
          label: "Cases",
          data: Object.values(ageBrackets),
          backgroundColor: "#2563eb",
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  // Regional Breakdown (Horizontal Bar)
  const ctxRegion = document.getElementById("canvas-region-chart");
  if (ctxRegion) {
    const cities = {};
    cases.forEach(c => {
      cities[c.city] = (cities[c.city] || 0) + 1;
    });

    new Chart(ctxRegion, {
      type: "bar",
      data: {
        labels: Object.keys(cities),
        datasets: [{
          label: "Cases",
          data: Object.values(cities),
          backgroundColor: "#0ea5e9",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }
}

// Pure HTML5 Canvas rendering fallback if CDN Chart.js unavailable
function renderCanvasFallbackCharts(cases) {
  const canvas = document.getElementById("canvas-status-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText("Chart.js CDN loading fallback mode...", 20, 50);

  const statusCounts = {
    Active: cases.filter(c => c.status === "Active").length,
    Investigation: cases.filter(c => c.status === "Under Investigation").length,
    Found: cases.filter(c => c.status === "Found").length
  };

  let y = 90;
  for (const [key, val] of Object.entries(statusCounts)) {
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(20, y, val * 40, 24);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`${key}: ${val}`, val * 40 + 30, y + 17);
    y += 40;
  }
}
