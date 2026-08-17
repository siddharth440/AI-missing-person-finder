# FindSafe AI – AI-Assisted Missing Person Finder

> **Tagline:** “Connecting information. Finding possibilities. Bringing people home.”

FindSafe AI is a complete, modern, responsive web application built for educational and hackathon prototype demonstration. It provides a centralized platform for organizing missing-person cases, managing community sightings, visualizing geospatial incident data, and running prototype AI photo matching simulation pipelines.

---

## Technical Features & Stack

FindSafe AI is built **100% using standard client-side Web technologies**:

- **HTML5**: Semantic markup, accessible forms, responsive structure.
- **CSS3**: Custom design system using modern CSS variables, Flexbox, CSS Grid, smooth transitions, and glassmorphism.
- **Vanilla JavaScript**: Modular ES6+ logic handling data persistence, UI state, search filtering, and AI matching pipeline animation.
- **Data Storage**: Browser `localStorage` engine with pre-seeded fictional demo cases and export/import functionality.
- **Zero Backend / Zero Build**: No Node.js, Express, React, Python, database servers, environment variables, or build tools (`npm`, Vite, Webpack) required.

---

## Project Structure

```
FindSafe-AI/
├── index.html            # Landing page (Hero, Stats, Timeline, Quick Search, Featured Cases)
├── report.html           # Report Missing Person registration form with client-side validation
├── search.html           # Search & filter directory with live search bar & status pills
├── case.html             # Individual Case Dossier details view, sightings list & AI leads
├── sighting.html         # Public Sighting Report form linked to Case ID
├── dashboard.html        # Public analytics dashboard with interactive Chart.js visualizations
├── admin.html            # Prototype Admin Dashboard (status updates, JSON export, demo reset)
├── about.html            # Mission, technical architecture, ethics & privacy guidelines
├── css/
│   └── style.css         # Master CSS design system & responsive rules
├── js/
│   ├── data.js           # Seed dataset (8 fictional missing person cases, 5 sightings, SVG avatars)
│   ├── storage.js        # LocalStorage manager (saveCase, getCases, updateCase, deleteCase, reset)
│   ├── app.js            # Core application controller (navigation, toasts, modal manager)
│   ├── cases.js          # Case directory rendering, multi-field search, filtering, and dossier view
│   ├── matching.js       # AI photo matching simulation pipeline & scoring engine
│   ├── sightings.js      # Sighting submission form handler and list display
│   ├── dashboard.js      # Analytics calculations & Chart.js / canvas chart renderers
│   └── map.js            # Leaflet.js interactive map with OpenStreetMap tiles & markers
├── assets/               # Graphics & icons
├── README.md             # Complete project documentation & deployment steps
└── LICENSE               # MIT License
```

---

## GitHub Pages Deployment Instructions

Because FindSafe AI is a purely static website, deploying to GitHub Pages takes less than 2 minutes:

### Step 1: Push Repository to GitHub
1. Create a new repository on GitHub named `FindSafe-AI`.
2. Open your terminal in the `FindSafe-AI` project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial release of FindSafe AI prototype"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/FindSafe-AI.git
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages
1. Go to your repository settings on GitHub: `https://github.com/<YOUR-USERNAME>/FindSafe-AI/settings/pages`.
2. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` / `root (/)`.
3. Click **Save**.
4. Your site will be live at: `https://<YOUR-USERNAME>.github.io/FindSafe-AI/`.

---

## AI Photo Matching Prototype Explanation

The AI photo matching pipeline in FindSafe AI is a visual and algorithmic simulation designed to demonstrate how biometric features and spatial embeddings prioritize investigative leads:

1. **Stage 1: Preprocessing & Alignment**: Rescales and normalizes incoming images.
2. **Stage 2: Feature Vector Extraction**: Simulates computing facial landmark embeddings.
3. **Stage 3: Vector Similarity Scan**: Calculates Cosine Similarity matrices against stored database embeddings.
4. **Stage 4: Lead Scoring & Confidence Badge**:
   - **High Lead Confidence**: ≥ 85% similarity
   - **Medium Lead Confidence**: 65% – 84% similarity
   - **Low Lead Confidence**: < 65% similarity

> **IMPORTANT LEGAL NOTICE**: AI-generated match percentages do NOT constitute biometric legal identification or proof of identity. All candidate matches require independent human verification by authorized law enforcement authorities.

---

## Verification & Testing Checklist

- [x] All 8 HTML files load properly with valid relative links.
- [x] Case creation generates a unique Case ID (`FS-2026-XXXX`) and persists in `localStorage`.
- [x] Search directory filters instantly by name, ID, status pills, and sort order.
- [x] Individual dossier pages render full attributes, sightings timeline, and photo viewer.
- [x] Sighting reporting links correctly to Case ID and updates investigation status.
- [x] Analytics dashboard renders Chart.js charts with standalone canvas fallback.
- [x] Prototype Admin portal allows status modifications, JSON exports, and seed resets.
- [x] Leaflet OpenStreetMap renders markers with graceful fallback.
- [x] Works directly when opened locally via browser file or deployed on GitHub Pages.

---

## License

This project is released under the [MIT License](LICENSE).
