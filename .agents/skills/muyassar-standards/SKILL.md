---
name: muyassar-standards
description: Architectural, security, and Saudi real estate UI/UX standards for Muyassar Real Estate (مُيسر للتطوير العقاري). Load this skill whenever working on any part of the Muyassar codebase — frontend, backend, CRM, or admin panel.
---

# Muyassar Real Estate Development Standards

> These standards apply to every file, component, endpoint, and copy string
> produced for the **مُيسر للتطوير العقاري** project. Treat violations as
> hard blockers — do not ship code that breaks any rule below.

---

## 1. Architecture & Modularity

### Stack (locked — do not substitute)
| Layer | Technology |
|---|---|
| Frontend | **React (Vite)** |
| Styling | **Tailwind CSS — compiled build only** (`tailwindcss` CLI or Vite plugin). Never use the CDN script tag. |
| Backend | **Node.js + Express** |
| Database | **MongoDB + Mongoose** |
| Auth | HTTP-only JWT cookies or Bearer tokens with strict middleware |

### File Size & Structure Rules
- **Strictly under 250 lines per file.** If a file exceeds this, split it.
- API calls → `src/services/`
- Auth state, React context → `src/context/`
- Reusable UI atoms → `src/components/`
- Page-level views → `src/pages/`
- Express route handlers → `src/routes/`
- Mongoose models → `src/models/`
- Middleware (auth, rate-limit, validation) → `src/middleware/`

### No Monolithic Files
Never recreate the prototype's pattern of a single 1,600-line `app.js`. Every
logical concern gets its own module.

---

## 2. Anti-AI Design & Brand Identity

### Copy & Language
- **Prohibited phrases** (cliché AI marketing — never use):
  - "اكتشف الفخامة المطلقة"
  - "بوابتك نحو المستقبل"
  - "تجربة استثنائية / تجربة لا مثيل لها"
  - "عالم من الرفاهية"
  - Any equivalent synthetic-sounding superlative
- **Required terminology** — use authentic Saudi real estate language:
  - "صك إلكتروني مستقل" (not "ملكية حصرية")
  - "إفراغ فوري" (not "جاهز للتسليم الفوري")
  - "مسطحات البناء" for built area
  - "الواجهة" for facade
  - "كراج" (not "موقف سيارة" when referring to a private garage)
  - "دورة مياه" (not "حمام")

### Icons — SVG Only, Zero Emojis
- **Strictly prohibit** emojis in all UI surfaces: buttons, headings, badges,
  nav labels, toast messages, modal titles, table cells.
- Use **Lucide React** or **Heroicons** SVG icons exclusively.
- No Unicode symbol substitutes (✓ ✕ → use SVG check/x icons).

### Typography
Load all fonts **locally** via `@font-face` from `/public/fonts/`. Zero
external font CDN dependencies in production.

| Font | Use | File location |
|---|---|---|
| `bbcnassim-bold` | Arabic body text | `/public/fonts/bbcnassim-bold.woff2` |
| `Dthuluth` | Arabic display / section headings | `/public/fonts/Dthuluth.woff2` |
| `Lulo Clean` | English labels, numbers, ticket IDs | `/public/fonts/LuloClean.woff2` |

```css
/* Required @font-face declarations — place in src/index.css */
@font-face {
  font-family: 'bbcnassim-bold';
  src: url('/fonts/bbcnassim-bold.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'Dthuluth';
  src: url('/fonts/Dthuluth.woff2') format('woff2');
  font-display: swap;
}
@font-face {
  font-family: 'Lulo Clean';
  src: url('/fonts/LuloClean.woff2') format('woff2');
  font-display: swap;
}
```

### Logo & Brand Assets
- Serve the official logo from `/public/brand/logo.png` (or `.svg`).
- **Zero external domain dependencies** for brand assets.
- Never hotlink to `muyassar-ra.com` or any CDN path for the logo.

### Regulatory Compliance (Footer & Project Cards)
- Always display **REGA license number** and **Fal license number** in:
  - The site footer
  - Individual project/unit cards where legally required
- Format: `رقم الترخيص الفال: XXXX` / `رقم ترخيص الهيئة: XXXX`

### Never Re-Add
- ❌ The 10-year structural guarantee badge/claim (غير مؤكد قانونياً)
- ❌ A mortgage / financing calculator (requires SAMA-licensed advisory)

---

## 3. Security & Production Hardening

### Zero XSS
- **Never** use `dangerouslySetInnerHTML` in React components.
- **Never** use raw `innerHTML` in any JS utility.
- All dynamic content must pass through React JSX rendering.
- If rich text is needed, use a sanitization library (DOMPurify) gated behind
  a strict allowlist — not an open passthrough.

### Authentication & RBAC
- All `/admin/*` routes (frontend) must be wrapped in a `<ProtectedRoute>`
  component that checks auth context before rendering.
- All `/api/admin/*` endpoints must run an `authMiddleware` that verifies the
  JWT and checks the user's role before executing any handler.
- Tokens stored in **HTTP-only, Secure, SameSite=Strict cookies** — never
  `localStorage`.
- Roles: `sales_agent` (read leads, update unit status) | `manager` (all).

### Input Validation & Sanitization
- Saudi mobile number regex (backend + frontend): `^05[0-9]{8}$`
- All text inputs must be trimmed and have a max-length enforced both on the
  `<input>` element and the Express validator middleware.
- Use `express-validator` for all POST body validation.
- Sanitize with `validator.js` `escape()` before storing to MongoDB.

### Rate Limiting
- Apply `express-rate-limit` to all lead submission endpoints:
  - **5 requests per phone number per hour** maximum.
  - **20 requests per IP per hour** global limit.
- Return `429 Too Many Requests` with an Arabic error message.

### CORS & CSP
- CORS: Whitelist only the production domain and `localhost:5173` for dev.
- CSP headers (via `helmet`):
  - `default-src 'self'`
  - `script-src 'self'` (no `'unsafe-inline'`)
  - `style-src 'self' 'unsafe-inline'` (Tailwind inline styles only)
  - `img-src 'self' data: https://images.unsplash.com` (extend as real assets are added)
  - `font-src 'self'`

### Environment Variables
- Never commit secrets. All keys go in `.env` (gitignored).
- Required env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `WHATSAPP_NUMBER` (do not hardcode in source)
  - `ALLOWED_ORIGIN`

---

## 4. Data Handling

### Unit Status — Server-Authoritative
- Unit statuses (`available` / `reserved` / `sold`) must be stored in MongoDB
  and served via a REST endpoint (`GET /api/units`).
- Never hardcode unit statuses in a frontend JS file.
- Sales agents update status via `PATCH /api/units/:id/status` (auth required).

### Lead Persistence
- Leads must be saved to MongoDB via `POST /api/leads` before the WhatsApp
  deep link is opened — do not rely on the user completing the WhatsApp step.
- Each lead document must include: `name`, `phone`, `unitId` (nullable),
  `propertyId` (nullable), `payment`, `notes`, `ticket`, `stage`
  (`prospective`), `createdAt`, `agentId` (nullable).
- Ticket IDs must be server-generated (UUID v4 or DB ObjectId-derived short
  code), never `Math.random()`.

### CRM Pipeline Stages
The three-stage pipeline must be enforced at the data model level:

```
prospective  →  reserved  →  closed
```

- Stage transitions require a `PATCH /api/leads/:id/stage` call.
- Stage regression is logged but allowed (e.g., reserved → prospective if
  deal falls through).

---

## 5. What This Project Is NOT

To prevent scope creep in AI-generated code, never add:
- Multi-language (i18n) support — Arabic RTL only.
- Social login (Google/Apple) — not applicable to this sales context.
- Real-time chat widgets (Intercom, Crisp, etc.) — WhatsApp is the channel.
- Payment gateway integration — this is not an e-commerce app.
- Map embed with API keys in frontend source — use a plain Google Maps link.
