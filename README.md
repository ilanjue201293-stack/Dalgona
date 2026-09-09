# Dalgona — Ink Game inspired web recreation

A zero-dependency static web recreation of the Dalgona mini-game from **Ink Game (Roblox)**, ready to deploy on Vercel.

## What is reproduced

- 2-minute Dalgona round
- 18-cookie random pool based on the January 2026 Dalgona rework
- 5 crack levels in normal mode and 3 in Hardcore
- needle tracing with a dark groove and bright-green validated path
- bottom pink/navy completion bar based on gameplay screenshots
- reworked Fear Bar, nearby eliminations, screen shake and heartbeat pressure
- breathing QTEs using Q / E / R / F / T on desktop, with touch support
- reveal, success and elimination states
- procedural audio (scrape, crack, heartbeat, gunshot) with Web Audio
- desktop and mobile controls

## Deploy on Vercel

No build step is required. Import this repository into Vercel and deploy it as a static project. `index.html` is the entry point.

## Research references

Mechanics and visual behavior were reconstructed from public references including:

- Ink Game Wiki (Fandom): **Dalgona**
- Ink Game Wiki (Fandom): **QTE**
- Ink Game Wiki (Fandom): **Update Logs — Dalgona Rework (January 18, 2026)**
- Roblox Ink Games Wiki (Fandom): **Dalgona / Honeycomb**
- BrosClanYt: **Ink Game: Dalgona Rework [Full Gameplay] | Roblox** (YouTube, Jan. 18, 2026)
- Sportskeeda gameplay screenshots showing the needle, green trace and pink/navy completion bar

The documented current rules used here include the 2:00 timer, 18 variants, the Fear mechanic, breathing QTEs, 5 normal crack levels, 3 Hardcore crack levels and QTE keys Q/E/R/F/T.

Some newer meme-cookie silhouettes do not have clean public vector references, so those shapes are stylized approximations instead of extracted Roblox assets. The project contains original HTML/CSS/canvas code and does not redistribute Roblox or Ink Game asset files.

## Disclaimer

Fan-made practice recreation. Not affiliated with, endorsed by, or sponsored by Roblox, Netflix, or the creators of Ink Game.
