---
name: multi-project-cms
description: Multi-project data architecture, zero-fake-data policy, pricing rules, and CRM lifecycle standards for Muyassar Real Estate.
---

# Multi-Project CMS & Data Standards

## 1. Entity Hierarchy & Data Relations
- Project is the top-level entity across the application.
- PropertyModel, Unit, and Lead entities must always maintain relational references:
  - projectId: foreign reference to Project._id (required).
  - projectName: stored snapshot for reporting and display continuity.
- Backward compatibility: when querying or presenting legacy records lacking projectId, fallback safely to the default project without breaking rendering or database migrations.

## 2. Zero Fake Data Policy
- Strictly prohibit placeholder, synthetic, or imaginary projects (such as "ريفان", "سديم", or generic mock seeds).
- All live projects and showcases must be fetched dynamically from the `/api/projects` endpoint.
- Only one initial real project is seeded in database initialization:
  - تاون هاوس الشامخة (slug: 'shamkha').
  - Exactly 6 official architectural models (A through F).
  - Exactly 15 physical units as verified by the official project catalog.
- If an endpoint returns empty collections, render genuine empty states or loader states; never fall back to mock data.

## 3. Zero-Price Rule
- Any unit with price <= 0, null, undefined, or missing MUST display:
  "تواصل لمعرفة السعر"
- This rule applies unconditionally across:
  - Public marketing cards and unit grid selectors.
  - Floor plan, specification, and unit detail modals.
  - Admin management tables, CRM panels, and reservation forms.
- Never show 0 ر.س, 0 SAR, NaN, or blank price fields to users or sales representatives.

## 4. Lead Lifecycle & State Transitions
- Lead statuses adhere strictly to the progression:
  new -> contacted -> reserved -> sold
  or cancelled (terminal or recoverable drop).
- Automatic Unit Release:
  - Transitioning a lead to cancelled must immediately and automatically release any associated unit back to available status.
  - Transitioning to reserved or sold locks the associated unit status accordingly.
- External Integrations (Non-Blocking & Asynchronous):
  - Google Sheets Webhook: invoke asynchronously in the background. Failures must be logged but never block client responses.
  - Sales Team WhatsApp Notification: fire automated webhook or message queue payload asynchronously without delaying lead submission responses.
  - Always persist lead record in MongoDB first before triggering external side effects.
