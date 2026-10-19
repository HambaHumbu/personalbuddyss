# PERSONAL BUDDY - website build

Multipage marketing site for Personal Buddy, a made-to-order 3D-printed
electronic companion workshop in Halifax, NS. Design system: "Halifax
Standard" - an editorial dark/cream system (near-black + cream bands, deep
green accent, Archivo grotesque type, uppercase mono labels, numbered
sections, full-height footer wordmark).

## Preview
Serve the repo root (the site lives at the root; GitHub Pages deploys from
here via .github/workflows/jekyll-gh-pages.yml):
```
python3 -m http.server 8080
```
then visit http://localhost:8080

## Contents
- root HTML - the site: 13 pages (12 plus 404.html), css/style.css, js/
- `docs/STEP0.md` - understanding, brief-vs-PDF disagreements, phase plan
- `docs/OPEN_DECISIONS.md` - 25 business decisions awaiting the owner
- `docs/bom.csv` - verified CAD bill of materials (checked 2026-10-18)
- `docs/pricing-model.xlsx` - live-formula pricing with 50%+ margin per tier
- `docs/KNOWN_LIMITATIONS.md` - launch blockers and honest scope notes
- `docs/LICENSES.md` - licence checklist

## Key numbers (CAD, verified 2026-10-18)
Starter from $259, Smart from $289, Premium from $335, Custom from $399 (quote),
Voice from $1,049 (coming soon). Every tier prices to at least 50% gross margin.

## Copy rules enforced by QA
No em/en dashes, no emoji, none of the banned words, every feature tagged
AVAILABLE / PRE-ORDER / COMING SOON, all AI media labelled "Concept render".
