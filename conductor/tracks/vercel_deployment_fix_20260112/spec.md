# Specification: Vercel Deployment Support

## Overview
This track addresses a MIME type error encountered during Vercel deployment. The issue stems from the hardcoded `base` path in `vite.config.ts`, which is currently set for GitHub Pages (`/marble-explorer/`). Vercel deployments typically require the base path to be `/`. This track will introduce dynamic base path configuration using environment variables to support both deployment targets.

## Functional Requirements
- **Dynamic Base Path:** Update `vite.config.ts` to set the `base` property dynamically.
    - If `VITE_BASE_PATH` environment variable is present, use it.
    - Default to `/` if no variable is provided (Standard for Vercel/Netlify/Local).
    - Allow overriding for GitHub Pages (e.g., setting `VITE_BASE_PATH=/marble-explorer/` in CI/CD).

## Non-Functional Requirements
- **Backward Compatibility:** Ensure that local development (`npm run dev`) continues to work without manual configuration.

## Acceptance Criteria
- [ ] `vite.config.ts` reads `base` from `process.env.VITE_BASE_PATH` (or similar).
- [ ] Local development works (defaults to `/`).
- [ ] Build command works.

## Out of Scope
- Updating the GitHub Actions workflow file (unless specifically requested, user handles env vars in their CI).
