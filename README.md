# ROLL// — Title Collection

Vercel-ready web game built around three independent loot rolls:

- **TITLE CASE** — 198 titles across seven rarities, with individual item odds.
- **COLOR CASE** — 65 colors, from simple solids to animated premium effects.
- **FONT CASE** — 56 fonts/styles, each previewed using its actual typeface.

The equipped display combines exactly one Title + one Color + one Font.

## Economy
- Every roll costs **250 coins**.
- The player starts with **1,000 coins** on a fresh save.
- Passive income: **+300 coins every minute**, including elapsed time while the site was closed.
- Duplicate drops convert into coins:
  - Common: +50
  - Uncommon: +80
  - Rare: +125
  - Epic: +225
  - Legendary: +400
  - Mythic: +750
  - Secret: +1,500

## Admin
The Admin panel verifies its code through `/api/admin` so the secret is not embedded in client JavaScript.

Create this Vercel environment variable for Production, Preview and Development if desired:

`ADMIN_CODE=your-secret-code`

The Admin panel can grant coins, any individual title/color/font, or the full item collection.

> The current inventory and coin balance are stored in browser `localStorage`, so this is suitable for a personal/local game prototype rather than a cheat-proof multiplayer economy.

## Features
- Single roll + Auto ×10
- Exact per-item odds
- Prominent inventory tabs for All / Titles / Colors / Fonts
- Duplicate counts
- Equip system
- Full catalog
- Recent drop history
- Local browser save via `localStorage`

Import the repository into Vercel. `index.html` is the main page and `api/admin.js` is the serverless admin verifier.
