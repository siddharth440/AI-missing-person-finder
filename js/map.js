/* ==========================================================================
   FindSafe AI - Interactive Mapping Engine (Leaflet.js + OSM)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("map")) {
    initFindSafeMap();
  }
});

function initFindSafeMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const cases = getCases();
  const sightings = getSightings();

  // Check if Leaflet.js is available
  if (typeof L === "undefined") {
    renderMapFallbackList(cases, sightings);
    return;
  }

  try {
    // Default center around US Geographic Center (or first case coordinate)
    const defaultLat = cases[0]?.lat || 39.8283;
    const defaultLng = cases[0]?.lng || -98.5795;

    const map = L.map("map").setView([defaultLat, defaultLng], 4);

    // OpenStreetMap Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | FindSafe AI'
    }).addTo(map);

    const bounds = [];

    // Add Case Markers (Blue Circle Markers)
    cases.forEach(c => {
      if (c.lat && c.lng) {
        bounds.push([c.lat, c.lng]);
        const marker = L.circleMarker([c.lat, c.lng], {
          radius: 9,
          fillColor: c.status === "Active" ? "#e11d48" : "#2563eb",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family:sans-serif; width:200px;">
            <strong style="color:#0f172a; font-size:1rem;">${c.name}</strong>
            <span style="display:block; font-size:0.75rem; color:#2563eb; font-weight:700;">${c.id}</span>
            <div style="font-size:0.8rem; color:#475569; margin:0.4rem 0;">
              <i class="fa-solid fa-location-dot"></i> ${c.lastSeenLocation}, ${c.city}
            </div>
            <a href="case.html?id=${c.id}" style="display:inline-block; font-size:0.8rem; color:#ffffff; background:#2563eb; padding:0.25rem 0.6rem; border-radius:4px; text-decoration:none; margin-top:0.4rem;">View Case</a>
          </div>
        `);
      }
    });

    // Add Sighting Markers (Amber Markers)
    sightings.forEach(s => {
      const parentCase = cases.find(c => c.id === s.caseId);
      if (parentCase && parentCase.lat && parentCase.lng) {
        // Slight offset for sighting visual clarity
        const sLat = parentCase.lat + (Math.random() - 0.5) * 0.04;
        const sLng = parentCase.lng + (Math.random() - 0.5) * 0.04;
        bounds.push([sLat, sLng]);

        const sMarker = L.circleMarker([sLat, sLng], {
          radius: 7,
          fillColor: "#f59e0b",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        }).addTo(map);

        sMarker.bindPopup(`
          <div style="font-family:sans-serif; width:190px;">
            <span style="font-size:0.75rem; color:#d97706; font-weight:700;">SIGHTING REPORT (${s.id})</span>
            <strong style="display:block; font-size:0.9rem; color:#0f172a;">${s.location}</strong>
            <p style="font-size:0.8rem; color:#475569; margin:0.3rem 0;">${s.description}</p>
            <span style="font-size:0.75rem; color:#94a3b8;">${s.date} at ${s.time}</span>
          </div>
        `);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

  } catch (err) {
    console.error("Map initialization error:", err);
    renderMapFallbackList(cases, sightings);
  }
}

function renderMapFallbackList(cases, sightings) {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  mapElement.style.height = "auto";
  mapElement.innerHTML = `
    <div class="map-fallback-list">
      <h3 style="font-size:1.1rem; color:var(--primary-900); margin-bottom:1rem;">
        <i class="fa-solid fa-map-pin" style="color:var(--accent-500);"></i> Regional Incident Locations Directory
      </h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:1rem;">
        ${cases.map(c => `
          <div style="background:var(--neutral-50); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--neutral-200);">
            <strong style="color:var(--primary-900);">${c.name} (${c.id})</strong>
            <div style="font-size:0.85rem; color:var(--neutral-600); margin-top:0.25rem;">
              ${c.lastSeenLocation}, ${c.city}, ${c.state}
            </div>
            <span class="case-badge ${getBadgeClass(c.status)}" style="display:inline-block; margin-top:0.5rem; font-size:0.7rem;">${c.status}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
