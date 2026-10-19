# OPEN DECISIONS

Anything the site does not know for a fact appears on the page as a visible
[CONFIRM: ...] token and here with the default this build uses. Nothing on
the site invents these facts.

| # | Decision | Default used in this build | Status |
|---|----------|----------------------------|--------|
| 1 | Legal business name | "Personal Buddy" shown as brand only; registration unknown | [CONFIRM: legal business name and registration] |
| 2 | Support email | support@personalbuddy.ca | RESOLVED 2026-10-18 (owner-confirmed) |
| 3 | Support phone | 437-247-4844, published sitewide + JSON-LD | RESOLVED 2026-10-18 (owner-confirmed) |
| 4 | Social handles | Shown as logo + "Coming soon" cards (no fake links) until accounts exist | [CONFIRM: Instagram, TikTok, Facebook, YouTube handles] |
| 5 | Warranty length | 12 months limited warranty, DRAFT FOR OWNER APPROVAL | [CONFIRM: warranty length and terms] |
| 6 | Lead time | 2-3 weeks made-to-order | [CONFIRM: lead time] |
| 7 | Shipping rates | Canada Post Expedited estimate shown; exact rate calculated at checkout | [CONFIRM: shipping rates and free-shipping threshold] |
| 8 | Halifax pickup | Pickup by appointment, Halifax NS; no address published | [CONFIRM: pickup arrangement] |
| 9 | Returns | Made-to-order custom items: defects and DOA only, 14 days | [CONFIRM: return policy] |
| 10 | Final prices | From pricing model in docs/pricing-model.xlsx (BOM-verified) | [CONFIRM: approve final prices] |
| 11 | Voice tier name | 3 proposals: BuddyTalk, Chatterbox, Parley | [CONFIRM: pick one] |
| 12 | Voice tier price | From BOM in pricing model | [CONFIRM: approve voice tier price] |
| 13 | Weather data provider | Environment and Climate Change Canada open data (api.weather.gc.ca) pending licence verification; marked PRE-ORDER until confirmed | [CONFIRM: weather data contract] |
| 14 | Spotify Connect | NOT shipped until current Premium terms are reviewed; COMING SOON | [CONFIRM: include or drop] |
| 15 | Body design licence | Original parametric design in progress; licence checklist in docs | [CONFIRM: original design or licensed model + proof of licence] |
| 16 | Buddy Club incentive | First access to new designs and limited editions; no discount promised | [CONFIRM: club offer] |
| 17 | Launch date | Not stated anywhere on the site | [CONFIRM: launch date] |
| 18 | Payment provider | Stripe (Checkout + Tax) planned; not integrated in this static build | [CONFIRM: Stripe account and tax settings] |
| 19 | Privacy officer contact | privacy@personalbuddy.ca placeholder | [CONFIRM: privacy contact] |
| 20 | Quebec shipping | Privacy policy notes Quebec Law 25 applies if shipping there | [CONFIRM: ship to Quebec at launch] |
| 21 | Launch pricing strategy | Cost-plus list prices (Starter $259, Smart $289, Premium $335, Custom $399+, Voice $1,049) at 50%+ margin, verified in docs/pricing-model.xlsx | [CONFIRM: keep cost-plus, or run interim founder pricing at $149/$179/$219 with 20-35% margin while engineering labour out] |
| 22 | Domain | personalbuddy.ca (singular). All URLs, canonicals, emails, and JSON-LD use it | [CONFIRM: domain is registered and DNS is pointed] |
| 23 | Google Business Profile | Not claimed yet. Schema, NAP, and geo tags are on-site; the GBP listing itself is the main local-ranking driver | [CONFIRM: claim and verify the GBP listing with matching name, Halifax address, and hours] |
| 24 | Brand lockup wordmark | Supplied logo files read "Personal Buddies" (plural); the site uses the icon plus singular "Personal Buddy" text to match the domain | [CONFIRM: supply refreshed lockup files with the singular wordmark] |
| 25 | Support hours in schema | Mon-Fri 09:00-17:00 shown as default in LocalBusiness schema | [CONFIRM: actual support hours] |

## Voice tier name proposals (Rule 4)

The working title "Voice Buddy" is descriptive, not a brand. Three original
options for the owner to pick:

1. **BuddyTalk** - plain, says what it does, easy to say to the device.
2. **Chatterbox** - playful, matches the "little buddy" tone.
3. **Parley** - short, distinctive, implies conversation.

None of these collide with the banned third-party marks. The site uses the
descriptive "Voice Buddy" until the owner picks one.
