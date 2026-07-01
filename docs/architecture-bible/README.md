# HN Platform Architecture Bible

Version 1.0 — The Digital Operating System of HN Ecosystem

This directory is the on-disk mirror of the in-app Architecture Bible
(surfaced at `/foundation/bible`). Every human and every AI agent working
on the HN Platform must read this before making changes.

## Structure

- `00-preamble.md` — official preamble + execution rules
- `01-philosophy.md` … `15-future.md` — the 15 canonical chapters
- The in-app version lives in `src/lib/hn/bible.ts` and
  `src/routes/_app.foundation.bible.tsx`. Keep both in sync.

Chapters are intentionally scaffolded with their scope and headings; they
will be filled in one after another, chapter by chapter, exactly as HN
Foundation was written.
