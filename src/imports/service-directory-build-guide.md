# 🏥 Silhouette Diagnostics — Service & Diagnostics Directory
## Complete Production Build Guide Prompt

---

> **How to use this guide:** Copy and paste the relevant sections below as prompts into your AI code builder (Figma Make, Cursor, v0, etc.) to rebuild the exact Service & Diagnostics Directory. Each section is a self-contained build instruction.

---

## PART 1 — DATA LAYER (Copy this first)

```
Build a TypeScript data file at `/src/app/data/servicesData.ts` for a Nigerian medical diagnostics platform called "Silhouette Diagnostics Consultants".

Create the following TypeScript interfaces:

interface Test { id: string; name: string; popular?: boolean; tags?: string[] }
interface AccordionItem { title: string; content: string }
interface ServiceCategory {
  id: string; shortTitle: string; title: string; emoji: string;
  gradient: string; gradientFrom: string; gradientTo: string;
  accentColor: string; borderColor: string; image: string;
  tagline: string; description: string; testCount: number;
  tests: Test[]; about: AccordionItem[];
}

Create an array called SERVICE_CATEGORIES with exactly 10 categories in this order:
1. id:"laboratory", shortTitle:"LAB", emoji:"🧪", gradient:"from-[#0052FF] to-[#00C6FF]"
   - 124 tests covering: haematology (FBC, blood group, ESR, CRP, D-dimer, clotting), 
     metabolic (blood sugar, HbA1c, cholesterol/lipids, uric acid), 
     organ function (liver LFTs, kidney urea/creatinine/eGFR, electrolytes), 
     thyroid (TSH/T3/T4/FT3/FT4), infection markers (malaria RDT+film, HIV, HBsAg, HCV, VDRL, Widal, brucella, blood culture, dengue, COVID PCR), 
     cancer markers (PSA, CA-125, CA-19-9, CEA, AFP, CA-15-3, LDH),
     hormonal/fertility (FSH, LH, E2, progesterone, testosterone, prolactin, cortisol, AMH, beta-HCG),
     vitamins (D, B12, folate, homocysteine), cardiac enzymes (troponin, BNP, CK-MB),
     urine (urinalysis, culture, microalbumin, protein), stool (analysis, culture, H.pylori),
     reproductive (semen analysis, pap smear, HPV PCR, chlamydia/gonorrhoea PCR, TORCH panel).
     Mark popular tests with popular:true. Add relevant tags like ['blood','thyroid','cancer-markers','fertility','infection','urine','stool','cardiac'].

2. id:"scan-ultrasound", shortTitle:"SCAN", emoji:"🔬", gradient:"from-[#7C3AED] to-[#C084FC]"
   - 48 tests: obstetric (1st/2nd/3rd trimester, 4D, anomaly, NT, follicle tracking, Doppler fetal),
     abdominal (liver, gallbladder, pancreas, spleen, appendix), pelvic (uterus, ovaries, fibroid mapping, endometrial),
     breast, thyroid, scrotal/testicular, prostate (transabdominal + TRUS), renal/bladder,
     cardiac echo (TTE, TEE, stress echo), Doppler (carotid, renal, lower/upper limb, CIMT),
     musculoskeletal (shoulder, knee, ankle, wrist, hip, elbow), soft tissue/lymph node, 
     nerve ultrasound (carpal tunnel), pleural/lung, penile Doppler, infant hip dysplasia, orbital.

3. id:"xray", shortTitle:"X-RAY", emoji:"🫁", gradient:"from-[#0F172A] to-[#334155]"
   - 32 views: chest (PA, AP, lateral), skull, sinuses, OPG dental panoramic, mandible,
     spine (cervical, thoracic, lumbar, sacrum), pelvis, hip, femur, knee, tibia/fibula, ankle, foot, toe,
     shoulder, clavicle, humerus, elbow, forearm, wrist, hand, finger,
     abdomen (erect + supine), ribs, sternum, bone age (left hand).

4. id:"mri", shortTitle:"MRI", emoji:"🧠", gradient:"from-[#0052FF] to-[#6366F1]"
   - 28 types: brain (plain, contrast, orbits, pituitary, MRA), neck soft tissue,
     spine (cervical, thoracic, lumbar, whole spine), extremities (shoulder, elbow, wrist, hand, hip, knee, ankle, foot),
     abdomen (MRCP, liver with contrast, full abdomen), pelvis (general, prostate mpMRI, female pelvis, fetal),
     cardiac MRI, breast MRI, whole body MRI.

5. id:"ct-scan", shortTitle:"CT SCAN", emoji:"💠", gradient:"from-[#0891B2] to-[#06B6D4]"
   - 24 types: brain (plain, contrast, CTA brain), head/neck (sinuses, neck soft tissue, temporal bone, orbit),
     chest (HRCT, with contrast, CTPA), abdomen (plain, contrast, abdomen+pelvis, triphasic liver, CT colonoscopy),
     pelvis, KUB, CT urogram, spine (cervical + lumbar CT), coronary CTA, aortic CTA, whole body CT, CT-guided biopsy.

6. id:"endoscopy", shortTitle:"ENDOSCOPY", emoji:"🔭", gradient:"from-[#059669] to-[#34D399]"
   - 12 procedures: OGD (gastroscopy), colonoscopy, flexible sigmoidoscopy, capsule endoscopy (pill camera),
     bronchoscopy, cystoscopy, colposcopy, ERCP, push enteroscopy, endoscopic ultrasound (EUS),
     chromoendoscopy, narrow band imaging (NBI).

7. id:"cardiology-ecg", shortTitle:"ECG / CARDIO", emoji:"❤️", gradient:"from-[#E11D48] to-[#FB7185]"
   - 16 tests: 12-lead ECG, 24hr/48hr/7-day Holter, 24hr ABPM blood pressure monitoring,
     transthoracic echocardiogram, exercise stress ECG (treadmill), dobutamine stress echo,
     ankle-brachial index (ABI), tilt table test, cardiac event monitor,
     CT calcium scoring, coronary CT angiography, cardiac MRI, pacemaker check, ILR check.

8. id:"dna-testing", shortTitle:"DNA", emoji:"🧬", gradient:"from-[#7C3AED] to-[#EC4899]"
   - 8 tests: paternity DNA (legal/court-admissible), paternity DNA (personal/non-legal),
     maternity DNA, sibling DNA (full/half), immigration DNA (embassy-approved),
     ancestry & ethnicity DNA, genetic carrier screening (inherited disorders), pharmacogenomics (drug response).

9. id:"cancer-screening", shortTitle:"CANCER SCREEN", emoji:"🎗️", gradient:"from-[#EA580C] to-[#FBBF24]"
   - 20 tests: PSA, mammography, pap smear, HPV DNA, CA-125, CEA, AFP, CA-19-9, CA-15-3,
     beta-2 microglobulin, LDH, FOBT, FIT test, colonoscopy (screening), LDCT lung,
     breast ultrasound, thyroid ultrasound, dermoscopy (melanoma), prostate biopsy, bone marrow biopsy.

10. id:"neurological", shortTitle:"NEURO", emoji:"⚡", gradient:"from-[#D97706] to-[#F59E0B]"
    - 14 tests: EEG, long-term video EEG, EMG, nerve conduction study (NCS), combined EMG+NCS,
      visual evoked potential (VEP), auditory evoked potential (AEP), SSEP, BERA,
      autonomic function tests, MMSE cognitive assessment, neuropsychological testing,
      sleep study (polysomnography), MSLT.

For EACH category, add an `about` array with 4 AccordionItem objects covering:
  1. "What is [Category Name]?" — explain the technology/methodology for patients
  2. "Why are these tests important?" — health impact and use cases
  3. "How do I prepare?" — patient preparation instructions
  4. "How long for results?" — turnaround times and delivery methods

Export: `SERVICE_CATEGORIES`, `TOTAL_TESTS` (sum of all testCount), `TOTAL_CATEGORIES` (10).
```

---

## PART 2 — TEST CTA MODAL COMPONENT

```
Create a React component at `/src/app/components/TestCTAModal.tsx` for a medical diagnostics website.

Props: { testName: string | null; categoryTitle: string; onClose: () => void }

Behavior:
- When testName is null, render nothing (controlled by AnimatePresence from motion/react)
- Detect screen width < 768px = "mobile mode", ≥ 768px = "desktop mode"
- Close on Escape key, prevent body scroll when open

MOBILE — Bottom Sheet:
- Fixed to bottom of screen, z-index 50
- Animate: slide up from y:"100%" to y:0 using motion spring (stiffness:380, damping:36)
- Has drag handle (small pill at top)
- Rounded top corners (rounded-t-3xl)
- Max height 90vh

DESKTOP — Centered Modal:
- Centered with fixed positioning, backdrop blur overlay
- Animate: scale from 0.93 to 1 + y from 16 to 0, spring (stiffness:400, damping:30)
- Max width 448px, rounded-3xl
- Has a 1.5px gradient accent stripe at the very top (brand blue to cyan)

BOTH layouts must show:
1. Category name as a small chip/badge (brand blue background, white text)
2. Test name as a bold heading (large, 700 weight)
3. Short paragraph: "How would you like to proceed with this diagnostic test? Our team is available 7 days a week."
4. Four action buttons in this order:

   BUTTON 1 — "Book Appointment" (PRIMARY, FULL WIDTH)
   - Background: linear-gradient(135deg, #0052FF 0%, #00C6FF 100%)
   - White text, font-semibold
   - Left: icon box (Calendar icon) in white/20 background rounded-xl
   - Right: ChevronRight icon
   - Sub-label in smaller text: "Schedule at your convenience"
   - Links to /booking?test=[encoded test name]&category=[encoded category]

   BUTTON 2 — "WhatsApp Chat" (GREEN, FULL WIDTH)
   - Background: linear-gradient(135deg, #25D366 0%, #128C7E 100%)
   - White text, font-semibold
   - Left: icon box (MessageCircle icon) in white/20
   - Opens wa.me/[phone]?text=[pre-filled message about the test]
   - target="_blank"

   BUTTON 3+4 — Side by side (50% width each):
   - "Make Enquiry": border-2 border-[#0052FF] text-[#0052FF], MessageSquare icon on top, "Make Enquiry" label below
   - "Call Now": bg-gray-50 border-gray-200, Phone icon on top, "Call Now" label below, href="tel:[phone]"

5. Trust row at the very bottom: three small dots with labels "Available 7 Days/Week", "Fast Results", "Confidential"

Close button: Circular (w-9 h-9), bg-gray-100, X icon

The backdrop (AnimatePresence): full screen fixed overlay, bg-black/50 backdrop-blur-sm, clicking it calls onClose.
```

---

## PART 3 — SERVICES HUB PAGE (Entry Point)

```
Redesign `/src/app/pages/Services.tsx` as a high-fidelity Diagnostic Directory hub page.

Import: SERVICE_CATEGORIES, TOTAL_TESTS, TOTAL_CATEGORIES from '../data/servicesData'
Import: motion, useInView from 'motion/react', Link from 'react-router', lucide-react icons

COLOR SYSTEM:
- Brand Blue: #0052FF
- Gradient: from #001A6E → #0052FF → #00C6FF (hero), or per-category gradients
- Background: #F7F9FF (page), #FFFFFF (cards)
- Text: #111827 (headings), #64748B (body), #94A3B8 (meta)

SECTION 1 — HERO (full-width):
- Background: linear-gradient(135deg, #001A6E 0%, #0052FF 55%, #00C6FF 100%)
- Dot grid overlay (radial-gradient dots, 28px spacing, white, 10% opacity)
- Two soft glow blobs (top-right cyan, bottom-left purple) using blur-3xl
- Content: centered, pt-32 pb-20
  - Badge chip: "Diagnostic Services Directory" in cyan text on white/15 bg
  - H1: "Your Complete Diagnostics Directory" — very large (clamp 2rem → 3.5rem), font-weight 800
    The word "Diagnostics" has a blue-to-cyan gradient text effect
  - Subtext: "{TOTAL_CATEGORIES} specialist categories · {TOTAL_TESTS}+ tests · State-of-the-art equipment · Certified specialists"
  - GLOBAL SEARCH BAR (max-w-2xl, centered):
    - White bg, rounded-2xl, shadow-2xl, pl-13 for Search icon
    - Placeholder: 'Search any test or category (e.g., "Malaria", "MRI", "HbA1c")...'
    - When 2+ chars typed: show an absolute-positioned dropdown with up to 12 matching tests
      Each row shows: test name, category name, "View" chip in category color
      Clicking a row navigates to /services/category/[catId] and clears search
  - STATS ROW (flex-wrap, centered, below search):
    5 stat chips with icons and values: "{TOTAL_TESTS}+ Total Tests", "10 Specialties", "24–48hr Results", "ISO Cert.", "4.9★ Rating"
    Each chip: bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl, icon in white/20 box

SECTION 2 — CATEGORIES GRID:
- Background: #F7F9FF
- Section heading: centered, "Browse All Diagnostic Categories"
- Grid: `grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`
- Each card (CategoryCard component):
  - Link to /services/category/[cat.id]
  - Motion: whileHover={{ y: -6, scale: 1.015 }}, whileTap={{ scale: 0.98 }}, transition ease-out 0.25s
  - Card style: bg-white/80 backdrop-blur-md border border-white/60 shadow-lg shadow-slate-200/60 rounded-3xl
  - At the very top: h-1.5 gradient stripe using category.gradientFrom → category.gradientTo
  - Inside padding p-6, flex-col:
    - Row: Category icon box (w-14 h-14 rounded-2xl, emoji text-2xl, gradient background matching category, glow shadow) + Test count badge (pill, category color bg at 15% opacity, category color text)
    - Category SHORT label (tiny, uppercase, tracked, category accent color)
    - Category TITLE (bold, 1.1rem)
    - Description text (text-sm text-slate-500, flex-1)
    - "View All Tests" with ArrowRight in small rounded circle, color matches category
  - On hover: radial glow overlay (category color at 8% opacity, top-left origin)
  - FadeIn animation with staggered delay (index * 0.06)

SECTION 3 — FEATURES STRIP:
- bg: gradient from category blue at 8% opacity
- 4 items in grid sm:grid-cols-2 lg:grid-cols-4: emoji + bold title + small desc
  "⚡ Same-Day Results", "🔬 State-of-the-Art Equipment", "👨‍⚕️ Expert Specialists", "📱 Digital Reports"

SECTION 4 — CTA BANNER:
- bg: linear-gradient(135deg, #001A6E, #0052FF) with dot overlay
- H2: "Can't Find What You're Looking For?"
- Two buttons: filled white "Book Appointment" + outline white "Contact Us"

SECTION 5 — SEO TEXT (bg-white):
- H2: "Comprehensive Diagnostic Services at Silhouette Diagnostics Consultants"
- 4 paragraphs (~200 words total) covering: full test range, lab capabilities, cancer screening, patient experience and report delivery
- FadeIn on scroll

When globalSearch.trim().length < 2: show all categories
When 2+ chars: filter categories where title, shortTitle, or any test.name includes the search term
Show "No results" state with Reset button if filteredCategories.length === 0
```

---

## PART 4 — SERVICE CATEGORY PAGE (The "App" Interface)

```
Create `/src/app/pages/ServiceCategory.tsx` — the interactive test browser for a single diagnostic category.

Route: /services/category/:categoryId
Import ServiceCategory data, TestCTAModal component.

STATE:
- search: string (search query)
- openAccordion: number | null (which accordion is open, default 0)
- selectedTest: string | null (triggers CTA modal)
- loading: boolean (skeleton loader, true for 600ms on mount/category change)
- showFilterMenu: boolean (filter tags panel)
- activeTag: string (default 'all')

DERIVED DATA (useMemo):
- allTags: unique tags from category.tests, sorted A-Z
- filteredTests: category.tests filtered by search + activeTag
- popularTests: filteredTests where t.popular === true

SKELETON LOADER component (shown when loading=true):
- 20 skeleton pills: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-pulse`
- Each pill: `h-11 rounded-xl bg-gray-200`, decreasing opacity (1 - index * 0.03)

ACCORDION component (AccordionItem):
- Props: title, content, isOpen, onToggle, accentColor
- Outer: border border-gray-100 rounded-2xl bg-white shadow-sm
- Button: full-width, flex space-between, text-sm font-semibold
- ChevronDown icon rotates 180° when open (motion.div animate rotate)
- AnimatePresence: height: 0 ↔ 'auto', opacity 0 ↔ 1, duration 0.3s, ease [0.22,1,0.36,1]
- Content: text-sm text-slate-600 leading-relaxed, top border in accentColor at 20% opacity

TEST PILL BUTTON component:
- Props: name, popular, accentColor, gradientFrom, gradientTo, delay, onClick
- Animate in: initial {opacity:0, scale:0.9} → {opacity:1, scale:1}, delay from prop
- whileHover: { scale: 1.03, y: -2 }, whileTap: { scale: 0.96 }
- Base style: bg-white border border-[accentColor at 30%] text-gray-700 rounded-xl px-4 py-2.5 text-sm
- On mouseEnter: border + text become full accentColor, bg becomes accentColor at 8%
- On mouseLeave: revert to base
- If popular: tiny dot (w-1.5 h-1.5 rounded-full, gradient) in top-right corner

LAYOUT SECTIONS:

HERO:
- pt-28 pb-16, background: linear-gradient(140deg, #001A6E 0%, category.gradientFrom 55%, category.gradientTo 100%)
- Dot grid + glow blob
- Breadcrumb link "← All Services" (white/70, goes to /services)
- Left: emoji icon box (w-16 h-16 rounded-2xl, bg white/18, backdrop-blur, border white/30) + short/title
- Right: stat chips: "[testCount] Tests", "4.9★ Rated", "Results in 24–48hr" (all white/15 backdrop chips)
- Below: description text (text-blue-100, text-sm)

STICKY SEARCH BAR (sticky top-16 z-30):
- bg: rgba(247,249,255,0.92) + backdrop-blur(16px) + border-bottom
- Row: Search input (max-w-2xl, flex-1) + Filter button + results count
- Search input: pl-11 for icon, pr-10 for clear button, border changes to accentColor + ring when active
- Filter button: shows a dot if activeTag !== 'all'
- Filter panel (AnimatePresence height animation below the row):
  - Chip buttons: "All Tests", "⭐ Popular", then each unique tag
  - Active chip: bg=accentColor, text-white; Inactive: bg-gray-100 text-gray-500

POPULAR TESTS SECTION (shown only when !search && activeTag === 'all'):
- Heading with ⭐ icon: "Popular Tests in {shortTitle}"
- First 10 popular tests as small pill-chips: accentColor bg at 10%, accentColor border at 40%, accentColor text
- Each has ⭐ icon left of name, on click: setSelectedTest(test.name)

TESTS GRID:
- Section heading with test count
- Small hint: "Click any test to enquire or book" (hidden sm:block, right-aligned)
- If loading: show SkeletonGrid
- If filteredTests.length === 0: centered empty state with 🔍 emoji + "Reset Filters" button
- Else: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3` with AnimatePresence
  Each TestPill onClick → setSelectedTest(test.name)
  When activeTag === 'popular': only show tests with popular:true

CTA STRIP (between grid and accordion):
- Rounded-2xl, bg: category gradient at 12-20% opacity, border category gradient at 20%
- Left: "Not Sure Which Test You Need?" heading + help text
- Right: "WhatsApp Us" (green) + "Book Now" (gradient) buttons

ACCORDION SECTION:
- Label chip: "Patient Education" in category accent color
- H2: "About {category.title}"
- category.about.map to AccordionItem components with staggered whileInView animations

RELATED CATEGORIES:
- Heading: "Explore Other Categories"
- 5-column grid (grid-cols-2 sm:grid-cols-3 lg:grid-cols-5): show 5 other categories as small cards
- Each card: emoji (text-2xl) + shortTitle (xs bold, accentColor) + "[testCount] tests" (gray)
- Hover: shadow-md + -translate-y-1

At the very bottom: <TestCTAModal testName={selectedTest} categoryTitle={category.title} onClose={() => setSelectedTest(null)} />
```

---

## PART 5 — ROUTING UPDATE

```
Update /src/app/routes.ts to add the ServiceCategory route.

IMPORTANT: The category route MUST be declared BEFORE the generic :serviceId route to avoid conflicts.

import { ServiceCategory } from './pages/ServiceCategory';

Add to children array (before 'services/:serviceId'):
{ path: 'services/category/:categoryId', Component: ServiceCategory }

Final children order:
1. index → Home
2. 'services' → Services
3. 'services/category/:categoryId' → ServiceCategory  ← NEW (must be before next)
4. 'services/:serviceId' → ServiceDetail
5. ... rest of routes
```

---

## PART 6 — VISUAL DESIGN SYSTEM REFERENCE

### Color Palette
| Token | Value | Usage |
|---|---|---|
| Brand Blue | `#0052FF` | Primary CTA, active states, borders |
| Deep Navy | `#001A6E` | Hero gradients, dark backgrounds |
| Cyan Accent | `#00C6FF` | Gradient ends, highlights |
| WhatsApp Green | `#25D366` | WhatsApp button only |
| Page BG | `#F7F9FF` | All page backgrounds |
| Card BG | `#FFFFFF` | All cards |
| Slate Text | `#64748B` | Body/description text |
| Border | `rgba(0,82,255,0.08)` | Subtle borders on light bg |

### Category Color Map
| Category | gradientFrom | gradientTo |
|---|---|---|
| Laboratory | `#0052FF` | `#00C6FF` |
| Scan/Ultrasound | `#7C3AED` | `#C084FC` |
| X-Ray | `#0F172A` | `#334155` |
| MRI | `#0052FF` | `#6366F1` |
| CT Scan | `#0891B2` | `#06B6D4` |
| Endoscopy | `#059669` | `#34D399` |
| Cardiology/ECG | `#E11D48` | `#FB7185` |
| DNA Testing | `#7C3AED` | `#EC4899` |
| Cancer Screening | `#EA580C` | `#FBBF24` |
| Neurological | `#D97706` | `#F59E0B` |

### Motion Specifications
| Element | Animation | Values |
|---|---|---|
| Category Cards (hover) | translate + scale | y:-6, scale:1.015, ease-out 250ms |
| Test Pills (hover) | translate + scale | y:-2, scale:1.03, ease-out 180ms |
| CTA Modal (desktop) | scale + translate | scale:0.93→1, y:16→0, spring stiff:400 damp:30 |
| Bottom Sheet (mobile) | translate | y:100%→0, spring stiff:380 damp:36 |
| Accordion | height + opacity | 0→auto, ease [0.22,1,0.36,1], 300ms |
| Test Pills (mount) | opacity + scale | 0+0.9 → 1+1, staggered delay index×0.025 |
| Page FadeIn | opacity + y | 0+28 → 1+0, ease [0.22,1,0.36,1], delay×0.06 |

### Typography Rules
| Element | Size | Weight | Notes |
|---|---|---|---|
| Hero H1 | clamp(2rem, 5vw, 3.5rem) | 800 | Gradient text on key word |
| Category H1 | clamp(1.6rem, 4vw, 2.5rem) | 800 | On dark bg |
| Section H2 | clamp(1.5rem, 3vw, 2.2rem) | 800 | |
| Card Title | 1.1rem | 700 | |
| Category Shortcode | 10px | 700 | UPPERCASE tracked |
| Body/Desc | 0.875rem | 400 | text-slate-500, leading-relaxed |
| Pill Buttons | 0.875rem | 500 | truncate overflow |

---

## PART 7 — PACKAGES REQUIRED

Ensure the following npm packages are installed:
```
motion (for motion/react animations)
react-router (for routing — NOT react-router-dom)
lucide-react (for icons)
```

---

## PART 8 — MOBILE RESPONSIVENESS CHECKLIST

Grid breakpoints for Tests Grid:
- Mobile (< 640px): `grid-cols-2` — 2 columns
- Tablet (640–1023px): `sm:grid-cols-3` — 3 columns
- Desktop (1024px+): `lg:grid-cols-4` — 4 columns

Category Cards Grid:
- Mobile: 1 column (`grid-cols-1`)
- Small tablet: `sm:grid-cols-2`
- Desktop: `lg:grid-cols-3`
- Large desktop: `xl:grid-cols-4`

CTA Modal:
- Mobile (< 768px): Bottom Sheet (fixed bottom-0, full width, rounded-t-3xl, slide up)
- Desktop (≥ 768px): Centered modal (max-w-md, fixed centered, scale animation)

Search Bar (sticky):
- Mobile: Full width search + icon-only filter button (no text label)
- Desktop: Search + "Filter" text + results count

Pill Buttons:
- Must have `truncate` class to prevent overflow on long test names
- Minimum tap target: 44px height (py-2.5 on text-sm = ~44px)
- Test: "Electroencephalography", "Pharmacogenomics" must not overflow

Hero Stats Row:
- Mobile: flex-wrap to wrap chips to 2-3 per row
- Desktop: single row

---

## PART 9 — SEO REQUIREMENTS

Services Hub Page (`/services`) must include a text section with:
- H2: "Comprehensive Diagnostic Services at [Clinic Name]"
- 4 paragraphs (~50 words each) covering:
  1. Overview of test count and categories
  2. Laboratory and imaging capabilities
  3. Cancer screening programmes
  4. Patient experience, result turnaround, and access

Each Category Page (`/services/category/[id]`) should have:
- Structured "About" accordion with 4 educational sections for patients
- Category title in H1 tag
- Test names visible to crawlers (not hidden behind JS barriers)
- Description text mentioning specific test names and health conditions

---

## PART 10 — INTEGRATION POINTS (For Production)

### WhatsApp Integration
Replace `wa.me/2348012345678` with your actual WhatsApp Business number.
Message template in TestCTAModal:
```
Hello [Clinic Name], I'd like to enquire about the *${testName}* test (${categoryTitle}). Please provide more information.
```

### Booking Integration
Link `/booking?test=[testName]&category=[categoryTitle]` — your Booking page should read these URL params to pre-fill the form:
```typescript
const [searchParams] = useSearchParams();
const preselectedTest = searchParams.get('test');
const preselectedCategory = searchParams.get('category');
```

### Phone Number
Replace `+2348012345678` with the clinic's actual phone number in:
- TestCTAModal "Call Now" button (href="tel:[number]")
- TestCTAModal WhatsApp URL

### Contact Form Integration
"Make Enquiry" button links to `/contact?test=[testName]`
The Contact page should read this param to pre-fill "Subject" or "Message" field.

---

*Guide generated for Silhouette Diagnostics Consultants — Service & Diagnostics Directory v2.0*
*Build system: React + TypeScript + Tailwind CSS v4 + motion/react + react-router*
```
