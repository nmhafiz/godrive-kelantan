You are an expert front-end engineer and UX designer.

GOAL:
Build a **single-page static landing page** for "Go Drive Car Rental" based entirely on the detailed markdown SPEC I will paste AFTER this prompt.

This landing page will be:
- Deployed to **Netlify** as a static site (NO backend).
- NO forms. Only **CTA buttons** to **WhatsApp** and **Call**.
- Using **real car images** (or realistic stock photos e.g. Unsplash / Pexels links) – no illustrations or fake models.

------------------------------------------------
HIGH-LEVEL REQUIREMENTS
------------------------------------------------

1. TECH STACK (STATIC, NETLIFY-FRIENDLY)
- Use a **pure static structure**:
  - `index.html`
  - `assets/styles.css`
  - `assets/main.js`
- NO build tools required (no Node build, no Vite, no Next.js).
- Netlify should be able to deploy by just serving `index.html`.

2. LANGUAGE & CONTENT
- All UI copy (headings, text, buttons) in **Bahasa Melayu (Malaysia)**, nada mesra, profesional ringan, bukan skema buku teks.
- Follow the CONTENT, SECTIONS, PRICING, and STRUCTURE from the SPEC markdown I’ll paste after this prompt.
- Treat the SPEC as **single source of truth**. If something is not mentioned, make a reasonable default but do NOT contradict the spec.

3. LAYOUT & DESIGN
- Mobile-first, fully responsive.
- Color theme:
  - Primary: **blue** (feel similar to Zus Coffee blue).
  - Secondary: **white** (clean background).
  - Accent: **light gold** for logo accent and some small UI elements.
- Overall style:
  - Minimalist, clean, modern.
  - Good spacing, readable typography.
  - Cards with subtle shadow & rounded corners for sections like fleet/pricing.
- Sections MUST follow the structure described in the SPEC, including:
  - Hero section (owner in front of car, strong headline, subheadline, bullet points, primary + secondary CTA).
  - Trust & company introduction.
  - Why choose Go Drive (USP).
  - Fleet & pricing (compact, sedan, MPV, van).
  - How to book (step-by-step).
  - Testimonials and job highlights (MB, LKIM, Cradle Fund, Ferro Alloys, DTC Auto, etc.).
  - Extra services (tour guide, boat tickets to Pulau Perhentian).
  - Location & coverage (Dataran Rehal, Kota Bharu, airport focus).
  - About Encik Nik Irmie.
  - Contact & final CTA.

4. IMAGES & VISUALS
- Use proper `<img>` tags with `alt` text.
- For now, you can use **placeholder URLs** or comments where the real client images will go:
  - Owner in front of car (hero background).
  - Dataran Rehal (location section).
- For car models, use **realistic car stock photos** (Unsplash / Pexels URL suggestions in comments or `src`).
- Do NOT use cartoonish or unrealistic images.

5. CTA & INTERACTIONS
- There MUST NOT be any HTML `<form>` or form submission.
- Main actions are:
  - WhatsApp CTA buttons (`https://wa.me/60179096100` and `https://wa.me/60179380937`).
  - Call CTA buttons (`tel:60179096100`).
- Required:
  - Primary CTA in hero section: "Tempah / WhatsApp Sekarang".
  - Secondary CTA in hero section: "Call Terus".
  - CTA buttons at relevant sections (fleet, how to book, final contact).
- Add a **floating WhatsApp button** on the bottom-right that is visible on scroll:
  - On click, open main WhatsApp number (Nik Irmie).

6. BACKGROUND MUSIC (INSTRUMENTAL)
- Implement a small **music toggle**:
  - Use an `<audio>` element with a placeholder instrumental file URL (comment where to change).
  - Auto-load but DO NOT autoplay with sound:
    - Page load: audio is muted/paused by default.
    - User clicks a small icon/button (e.g. music note) to play/pause.
  - Place the icon in a non-intrusive corner (e.g. bottom-left or top-right).
- The toggle should clearly indicate **on/off** state (e.g. simple text or icon change).

------------------------------------------------
PIXEL & TRACKING REQUIREMENTS
------------------------------------------------

7. META / FACEBOOK PIXEL & TIKTOK PIXEL (CAPI-FRIENDLY FRONTEND)

The landing page must be **ready to integrate** with:
- Meta/Facebook Pixel (for CAPI via server later).
- TikTok Pixel (for TikTok Events + CAPI later).

DO NOT hardcode any specific pixel IDs, but prepare the structure and hooks.

Implementation details:
- In `index.html`:
  - Create clear comment blocks for:
    - `<!-- Meta Pixel Code Placeholder -->`
    - `<!-- TikTok Pixel Code Placeholder -->`
  - These will be used later to paste the actual pixel scripts.
- In `assets/main.js`:
  - Implement generic tracking helper functions:
    - `trackViewContent(source)` – called on page load and when relevant sections are viewed (e.g., fleet/pricing).
    - `trackContact(source, action)` – called when user clicks WhatsApp or Call.
  - Inside these helpers:
    - Call stubs for pixel events, for example:

      ```js
      function trackViewContent(source = 'page') {
        // TODO: integrate with Meta Pixel and TikTok Pixel
        // Example:
        // if (window.fbq) fbq('track', 'ViewContent', { source });
        // if (window.ttq) ttq.track('ViewContent', { source });
      }

      function trackContact(source = 'cta', action = 'whatsapp') {
        // TODO: integrate with Meta Pixel and TikTok Pixel
        // Example:
        // if (window.fbq) fbq('track', 'Contact', { source, action });
        // if (window.ttq) ttq.track('Contact', { source, action });
      }
      ```

  - Use these functions as follows:
    - On initial page load: call `trackViewContent('page_load');`
    - When user scrolls to the fleet/pricing section: use an `IntersectionObserver` to call `trackViewContent('fleet_section');`
    - When user clicks:
      - Any WhatsApp CTA: call `trackContact('button', 'whatsapp');`
      - Any Call CTA: call `trackContact('button', 'call');`

8. GOOGLE TAG MANAGER COMPATIBILITY (OPTIONAL)
- Prepare a simple `dataLayer` push inside the tracking functions as comments, e.g.:

  ```js
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'contact_click',
    action,
    source,
  });
  ```

- Keep it commented or neutral so it can be quickly enabled later.

------------------------------------------------
SEO REQUIREMENTS (GOOGLE + AI SEARCH)
------------------------------------------------

9. ON-PAGE SEO (GOOGLE)

- In `<head>` of `index.html`:
  - Use the **Page Title** and **Meta Description** from the SPEC (Section 8).
  - Add canonical `<link>` (placeholder URL, e.g. `https://example.com/` with comment to change).
  - Add Open Graph tags:
    - `og:title`
    - `og:description`
    - `og:image` (placeholder image URL, comment to update).
    - `og:url`
    - `og:type` = `website`
  - Add Twitter card meta tags (summary_large_image).
- Heading structure:
  - Exactly **one `<h1>`** (main hero title).
  - Use `<h2>` and `<h3>` hierarchically for sections (Services, Fleet, Pricing, Why Choose Us, Extra Services, Location, About, Contact).
- All important images must have meaningful `alt` text, e.g.:
  - `"Kereta sewa Perodua Bezza di Kota Bharu"`
  - `"Pemandu bersama kereta sewa VIP di Kelantan"`
- Ensure:
  - Fast loading (no huge inline images, allow future optimization).
  - Fully responsive and readable on mobile (very important for ranking).

10. STRUCTURED DATA (SCHEMA.ORG JSON-LD)

At the bottom of `<head>`, include a `<script type="application/ld+json">` block containing JSON-LD that covers:

- `@type: "LocalBusiness"` or `"CarRental"` with fields like:
  - name: "Go Drive Car Rental"
  - url: placeholder main URL
  - telephone: main phone number
  - address: at least city & state (Kota Bharu, Kelantan)
  - openingHoursSpecification: simple example (can be generic)
  - areaServed: Kelantan, Malaysia
  - sameAs: empty array or comment for future links (Facebook, WhatsApp, etc.)
- Optionally, a second `Service` entry describing car rental, chauffeur, VIP cars, tour guide, and boat tickets to Pulau Perhentian.

11. AI SEARCH-FRIENDLY CONTENT (AI OVERVIEWS / CHATBOTS / SGE)

The content should be written in a way that **AI search systems can easily extract**:

- Very clearly explain, in natural language:
  - What is Go Drive Car Rental.
  - Where they operate (Kelantan, Kota Bharu, Lapangan Terbang Sultan Ismail Petra).
  - What services they provide:
    - Kereta sewa pandu sendiri
    - Kereta mewah untuk VIP
    - Servis chauffeur
    - MPV / van untuk rombongan
    - Pemandu pelancong
    - Tiket bot ke Pulau Perhentian
  - What kind of customers they target (airport arrivals, tourists, business travellers, families).
- Use some **question-style headings** as specified:
  - Example:
    - "Kenapa Pilih Go Drive Car Rental di Kelantan?"
    - "Jenis Kereta Sewa Apa Yang Tersedia?"
    - "Bagaimana Cara Tempah Kereta di Go Drive Car Rental?"
- Ensure all pricing and model details from the SPEC’s fleet/pricing section are present in text (not just images), so AI can read them.

------------------------------------------------
ACCESSIBILITY & CODE QUALITY
------------------------------------------------

12. ACCESSIBILITY
- Use semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` where appropriate.
- Ensure contrast between text and background is sufficient (especially blue on white).
- Buttons must be `<button>` or `<a>` with `role="button"` and clearly clickable.
- The music toggle must be keyboard accessible and have `aria-label` indicating "Toggle background music".

13. FILE STRUCTURE & COMMENTS
- Final file structure:

  - `/index.html`
  - `/assets/styles.css`
  - `/assets/main.js`
  - `/assets/` can also include placeholder images (if you want to include some default paths).

- Add clear comments in code:
  - Where to replace phone numbers and WhatsApp links.
  - Where to inject Meta Pixel and TikTok Pixel.
  - Where to replace placeholder images with real client images.
  - Where to change canonical URL & OG image.

------------------------------------------------
TASK
------------------------------------------------

Using ALL the above instructions AND the detailed SPEC markdown that I will paste AFTER this prompt:

1. Read and understand the SPEC completely.
2. Implement the full static landing page as described.
3. Output the complete project:
   - `index.html`
   - `assets/styles.css`
   - `assets/main.js`
4. Ensure all sections from the SPEC are present, with correct content, structure, and pricing.
5. Ensure tracking hooks, SEO tags, JSON-LD, floating WhatsApp button, music toggle, and responsive design are all implemented.

Now wait for me to paste the SPEC markdown. Do NOT start until the SPEC is provided.

