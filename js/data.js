/* ==========================================================================
   FindSafe AI - Seed Data (Fictional Demo Records)
   All names, photos, and descriptions are 100% synthetic for prototype testing.
   ========================================================================== */

// Helper to generate clean vector avatar SVG Data URLs
function createAvatarSvg(bgGradientStart, bgGradientEnd, shirtColor, hairColor, isFemale = false) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradientStart}"/>
        <stop offset="100%" stop-color="${bgGradientEnd}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#bg)"/>
    <!-- Body/Shoulders -->
    <path d="M 60 300 Q 150 200 240 300 Z" fill="${shirtColor}"/>
    <!-- Neck -->
    <rect x="135" y="150" width="30" height="40" fill="#f5d0c5" rx="5"/>
    <!-- Head -->
    <ellipse cx="150" cy="125" rx="55" ry="65" fill="#f8d7da"/>
    <!-- Eyes -->
    <circle cx="130" cy="118" r="6" fill="#2c3e50"/>
    <circle cx="170" cy="118" r="6" fill="#2c3e50"/>
    <circle cx="132" cy="116" r="2" fill="#ffffff"/>
    <circle cx="172" cy="116" r="2" fill="#ffffff"/>
    <!-- Eyebrows -->
    <path d="M 120 106 Q 130 102 140 106" stroke="#2c3e50" stroke-width="3" fill="none"/>
    <path d="M 160 106 Q 170 102 180 106" stroke="#2c3e50" stroke-width="3" fill="none"/>
    <!-- Nose -->
    <path d="M 150 118 L 146 132 L 154 132" stroke="#e0a090" stroke-width="2" fill="none"/>
    <!-- Mouth -->
    <path d="M 138 148 Q 150 156 162 148" stroke="#d9534f" stroke-width="3" fill="none"/>
    <!-- Hair -->
    ${isFemale ? 
      `<path d="M 90 120 Q 95 40 150 40 Q 205 40 210 120 C 215 180 190 200 190 200 C 180 140 170 70 150 70 Q 130 70 110 200 C 110 200 85 180 90 120 Z" fill="${hairColor}"/>` : 
      `<path d="M 92 110 C 90 60 120 45 150 45 C 180 45 210 60 208 110 C 200 70 180 60 150 60 C 120 60 100 70 92 110 Z" fill="${hairColor}"/>`
    }
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const INITIAL_DEMO_CASES = [
  {
    id: "FS-2026-0001",
    name: "Sarah Jenkins",
    age: 24,
    gender: "Female",
    dateMissing: "2026-08-02",
    timeMissing: "18:30",
    lastSeenLocation: "Zilker Metropolitan Park",
    city: "Austin",
    state: "TX",
    country: "USA",
    lat: 30.2669,
    lng: -97.7728,
    height: "5' 6\" (168 cm)",
    clothingDescription: "Navy blue hoodie, light blue denim jeans, white running sneakers, dark green canvas backpack.",
    identifyingMarks: "Small star tattoo on left inner wrist, silver septum nose ring.",
    contactInfo: "Austin Police Department - Case #2026-88492 | Tip Hotline: (512) 555-0199",
    additionalInfo: "Last seen walking near the kayaking docks. Subject left her phone in her vehicle.",
    status: "Active",
    createdAt: "2026-08-02T19:00:00Z",
    photo: createAvatarSvg("#1e293b", "#3b82f6", "#2563eb", "#334155", true),
    isDemo: true
  },
  {
    id: "FS-2026-0002",
    name: "Marcus Vance",
    age: 32,
    gender: "Male",
    dateMissing: "2026-07-28",
    timeMissing: "09:15",
    lastSeenLocation: "Pike Place Market District",
    city: "Seattle",
    state: "WA",
    country: "USA",
    lat: 47.6097,
    lng: -122.3422,
    height: "6' 1\" (185 cm)",
    clothingDescription: "Charcoal gray raincoat, black cargo pants, brown leather hiking boots.",
    identifyingMarks: "Surgical scar on right knee, short trimmed beard.",
    contactInfo: "Seattle PD Missing Persons Unit - (206) 555-0144",
    additionalInfo: "Marcus was visiting Seattle for a technology conference. Did not check into his hotel flight.",
    status: "Under Investigation",
    createdAt: "2026-07-28T10:00:00Z",
    photo: createAvatarSvg("#0f172a", "#0ea5e9", "#1e293b", "#000000", false),
    isDemo: true
  },
  {
    id: "FS-2026-0003",
    name: "Elena Rostova",
    age: 19,
    gender: "Female",
    dateMissing: "2026-08-10",
    timeMissing: "21:45",
    lastSeenLocation: "Millennium Park / Transit Plaza",
    city: "Chicago",
    state: "IL",
    country: "USA",
    lat: 41.8826,
    lng: -87.6226,
    height: "5' 4\" (163 cm)",
    clothingDescription: "Red oversized knit sweater, black leggings, high-top black shoes.",
    identifyingMarks: "Freckles across nose bridge, silver frame eyeglasses.",
    contactInfo: "Chicago Area Special Investigations - (312) 555-0177",
    additionalInfo: "Student at University of Chicago. Failed to return home after late library session.",
    status: "Active",
    createdAt: "2026-08-10T22:00:00Z",
    photo: createAvatarSvg("#312e81", "#6366f1", "#4338ca", "#b45309", true),
    isDemo: true
  },
  {
    id: "FS-2026-0004",
    name: "David Kim",
    age: 45,
    gender: "Male",
    dateMissing: "2026-06-14",
    timeMissing: "14:00",
    lastSeenLocation: "Golden Gate Park Trail",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    lat: 37.7694,
    lng: -122.4862,
    height: "5' 9\" (175 cm)",
    clothingDescription: "Gray windbreaker jacket, black athletic shorts, gray marathon shoes.",
    identifyingMarks: "Black frame glasses, birthmark on right cheek.",
    contactInfo: "San Francisco Police Dept - (415) 555-0182",
    additionalInfo: "UPDATE: Located safely in Santa Cruz by local responders.",
    status: "Found",
    createdAt: "2026-06-14T15:00:00Z",
    photo: createAvatarSvg("#064e3b", "#10b981", "#047857", "#1e293b", false),
    isDemo: true
  },
  {
    id: "FS-2026-0005",
    name: "Maya Lin",
    age: 8,
    gender: "Female",
    dateMissing: "2026-08-14",
    timeMissing: "16:20",
    lastSeenLocation: "Boston Common Playground",
    city: "Boston",
    state: "MA",
    country: "USA",
    lat: 42.3550,
    lng: -71.0656,
    height: "4' 2\" (127 cm)",
    clothingDescription: "Yellow floral summer dress, pink sneakers, holding a purple plush bunny toy.",
    identifyingMarks: "Dimple on left cheek when smiling.",
    contactInfo: "Boston Emergency Response - Call 911 / (617) 555-0111",
    additionalInfo: "CRITICAL ALERT: Kidnapping/Silver Amber Alert active. Last seen near park fountain.",
    status: "Active",
    createdAt: "2026-08-14T16:30:00Z",
    photo: createAvatarSvg("#78350f", "#f59e0b", "#d97706", "#451a03", true),
    isDemo: true
  },
  {
    id: "FS-2026-0006",
    name: "Robert Thorne",
    age: 67,
    gender: "Male",
    dateMissing: "2026-08-05",
    timeMissing: "11:00",
    lastSeenLocation: "Cherry Creek Shopping Center",
    city: "Denver",
    state: "CO",
    country: "USA",
    lat: 39.7169,
    lng: -104.9547,
    height: "5' 10\" (178 cm)",
    clothingDescription: "Beige cardigan sweater, brown corduroy trousers, orthopedic brown shoes.",
    identifyingMarks: "Gray hair, wearing silver watch, walks with a slight limp.",
    contactInfo: "Denver Senior Safety Squad - (303) 555-0130",
    additionalInfo: "Subject suffers from early-stage memory impairment and may appear confused.",
    status: "Under Investigation",
    createdAt: "2026-08-05T12:00:00Z",
    photo: createAvatarSvg("#334155", "#64748b", "#475569", "#94a3b8", false),
    isDemo: true
  },
  {
    id: "FS-2026-0007",
    name: "Aisha Patel",
    age: 29,
    gender: "Female",
    dateMissing: "2026-08-08",
    timeMissing: "20:00",
    lastSeenLocation: "Brooklyn Bridge Pedestrian Walkway",
    city: "New York",
    state: "NY",
    country: "USA",
    lat: 40.7061,
    lng: -73.9969,
    height: "5' 5\" (165 cm)",
    clothingDescription: "Olive green trench coat, black turtleneck sweater, dark jeans.",
    identifyingMarks: "Long dark hair, small silver hoop earrings.",
    contactInfo: "NYPD Missing Persons Squad - (212) 555-0122",
    additionalInfo: "Potential AI match lead reported in Jersey City Transit Station. Verification pending.",
    status: "Potential Match",
    createdAt: "2026-08-08T20:30:00Z",
    photo: createAvatarSvg("#831843", "#ec4899", "#be185d", "#111827", true),
    isDemo: true
  },
  {
    id: "FS-2026-0008",
    name: "Carlos Mendez",
    age: 17,
    gender: "Male",
    dateMissing: "2026-05-20",
    timeMissing: "17:15",
    lastSeenLocation: "Wynwood Arts District",
    city: "Miami",
    state: "FL",
    country: "USA",
    lat: 25.8042,
    lng: -80.1989,
    height: "5' 11\" (180 cm)",
    clothingDescription: "White graphic t-shirt, gray sweatpants, red basketball shoes.",
    identifyingMarks: "Eagle tattoo on right shoulder.",
    contactInfo: "Miami-Dade Police Dept - (305) 555-0166",
    additionalInfo: "Case closed following family confirmation.",
    status: "Closed",
    createdAt: "2026-05-20T18:00:00Z",
    photo: createAvatarSvg("#7c2d12", "#ea580c", "#c2410c", "#1c1917", false),
    isDemo: true
  }
];

const INITIAL_DEMO_SIGHTINGS = [
  {
    id: "ST-8801",
    caseId: "FS-2026-0001",
    personDescription: "Young woman matching Sarah's description walking near Lady Bird Lake Trail.",
    date: "2026-08-03",
    time: "07:45",
    location: "Lady Bird Lake Trail North Access",
    city: "Austin",
    state: "TX",
    description: "Subject was wearing a navy hoodie with hood up, carrying a green backpack. Seemed slightly disoriented.",
    reporterName: "David Miller",
    reporterContact: "david.m@example.com",
    isAnonymous: false,
    verified: true,
    createdAt: "2026-08-03T08:15:00Z"
  },
  {
    id: "ST-8802",
    caseId: "FS-2026-0003",
    personDescription: "Female matching Elena buying water at 7-Eleven.",
    date: "2026-08-11",
    time: "02:10",
    location: "State St & Jackson Blvd",
    city: "Chicago",
    state: "IL",
    description: "Wearing red sweater and black leggings. Appeared to be waiting for an Uber.",
    reporterName: "Anonymous Witness",
    reporterContact: "N/A",
    isAnonymous: true,
    verified: true,
    createdAt: "2026-08-11T03:00:00Z"
  },
  {
    id: "ST-8803",
    caseId: "FS-2026-0007",
    personDescription: "Aisha Patel lookalike seen at PATH Train platform.",
    date: "2026-08-09",
    time: "17:30",
    location: "Journal Square Station",
    city: "Jersey City",
    state: "NJ",
    description: "Olive trench coat, silver earrings. Boarding train towards Newark.",
    reporterName: "Siddharth Verma",
    reporterContact: "siddharth@example.com",
    isAnonymous: false,
    verified: true,
    createdAt: "2026-08-09T18:00:00Z"
  },
  {
    id: "ST-8804",
    caseId: "FS-2026-0005",
    personDescription: "Child fitting Maya's description with an adult female.",
    date: "2026-08-14",
    time: "18:00",
    location: "South Station Bus Terminal",
    city: "Boston",
    state: "MA",
    description: "Child was holding a purple plush toy. Adult was wearing a gray sunglasses and baseball hat.",
    reporterName: "Transit Security Guard",
    reporterContact: "(617) 555-9090",
    isAnonymous: false,
    verified: false,
    createdAt: "2026-08-14T18:20:00Z"
  },
  {
    id: "ST-8805",
    caseId: "FS-2026-0002",
    personDescription: "Tall male with raincoat resting at Westlake Coffee.",
    date: "2026-07-29",
    time: "14:15",
    location: "4th Ave & Pine St",
    city: "Seattle",
    state: "WA",
    description: "Matches Marcus's height and surgical scar. Ordered black coffee.",
    reporterName: "Barista Staff",
    reporterContact: "staff@coffeewestlake.com",
    isAnonymous: false,
    verified: false,
    createdAt: "2026-07-29T15:00:00Z"
  }
];
