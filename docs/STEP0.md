# STEP 0: Understanding, Disagreements, Decisions, Phase Plan

Date: 2026-10-18. Owner: Taki Sadik. Project: Personal Buddy, Halifax NS.

## (a) Understanding, one page

Personal Buddy is a made-to-order hardware product: a posable, articulated,
3D-printed dummy figure with real electronics inside. It shows the time, runs
alarms, reads temperature and humidity, glows with RGB light, wears an animated
pixel face, and reacts to touch and motion. Higher tiers add Wi-Fi, weather,
custom messages and scheduled reminders. The top tier is a voice companion: a
Raspberry Pi running a small on-device LLM so the Buddy talks, answers
questions, sets timers and plays music over Bluetooth, AirPlay or local files.

Positioning is "More than a 3D print." The tagline is "A little buddy. Made
just for you." The hero headline is "Meet Your Personal Buddy." Everything is
designed, printed, assembled and programmed in Halifax, Nova Scotia, with local
pickup and Canada-wide shipping in CAD.

The launch stays honest: V1 ships a simple, reliable feature set (clock, alarm,
temperature, OLED, RGB, buzzer, animations, Wi-Fi). The site may show the
bigger vision, but every feature carries a status tag (AVAILABLE, PRE-ORDER,
COMING SOON). Nothing is sold as shipping today unless it does. No fake
reviews, no fake press, no fake scarcity. The first 10 owners are invited to
become early customers; verified reviews appear later with permission. Every
AI-generated image or video is labelled "Concept render" until real
photos and footage exist.

The brand system is "Sharp Edge": near-black backgrounds (#0B0D0E), mint
(#4DFFBC) as the primary accent, red (#FF4D4D) for alerts and Love Buddy
highlights, sharp 0-2px corners with 45-degree chamfers, hairline borders,
IBM Plex Sans headings, JetBrains Mono spec labels. Copy is short, specific,
a little playful, honest like a spec sheet. No em dashes, no emoji, none of
the banned words.

This build delivers the multipage marketing website as a static zip the owner
can preview immediately, with a working configurator and pricing engine,
honest legal drafts, and a pricing model grounded in verified CAD supplier
prices. See (d) for the phase plan and what is deliberately deferred.

## (b) Disagreements between the brief and the PDF (brief wins)

1. Pricing numbers. The PDF lists Starter $69+, Smart $99+, Premium $139+,
   Custom $179+. The brief says these floors are starting points, not gospel,
   and asks for final prices derived from a real BOM with at least 50 percent
   gross margin. Final site prices come from the pricing model and may sit
   above the PDF floors. Disagreement resolved in favour of the brief.

2. Voice tier. The PDF lists AI and voice under "advanced features later"
   with no tier definition. The brief defines a full voice tier (Raspberry Pi
   platform, on-device LLM, benchmarked model choice, BOM-derived price).
   The site shows the voice tier with a COMING SOON tag and a price from the
   BOM. Brief wins.

3. Feature status tags. The PDF has no status tags. The brief requires every
   feature to carry AVAILABLE, PRE-ORDER or COMING SOON. Brief wins.

4. V1 feature set. The PDF's recommended V1 is Clock, Alarm, Temperature,
   OLED, RGB, Buzzer, Animations, Wi-Fi, with Weather, Pomodoro, custom
   messages, phone configuration, AI, voice and moving parts deferred. The
   brief's configurator offers Humidity, Touch, Motion, Bluetooth, Weather,
   Pomodoro and Custom Messages. Resolution: the configurator offers them,
   but each carries its honest tag. Humidity ships in Smart (AVAILABLE).
   Weather, Pomodoro, Custom Messages, Touch, Motion and Bluetooth are
   PRE-ORDER or COMING SOON until the hardware and commercial data contracts
   are real. Voice is COMING SOON.

5. Music. The PDF mentions music only inside the voice tier. The brief
   defines music support as Bluetooth A2DP sink, AirPlay receiver
   (shairport-sync), local library (MPD or Navidrome) and internet radio,
   with Spotify Connect only on the customer's own Premium account after a
   terms review. No ad-blocking or circumvention anywhere. Brief wins.

6. Voice tier naming. The PDF names nothing. The brief bans third-party
   trademarks (Jarvis, Alexa, Siri) and asks for 3 original name proposals.
   See OPEN_DECISIONS.md. Brief wins.

7. Social media. The PDF lists Instagram, TikTok, Facebook and YouTube with
   real short-form video. The brief says handle links now, embeds only once
   real videos exist. The site links the handles as [CONFIRM] placeholders
   and ships clearly marked slots for real media. Brief wins.

8. "Describe Your Buddy". The PDF describes it as a signature future
   feature. The brief specifies a strict JSON schema, Zod validation, one
   retry, deterministic pricing, rate limiting and human review before any
   money is taken. The site ships a working client-side prototype marked as
   a concept, with human review before payment. Brief wins.

9. Stack. The brief specifies Next.js, PostgreSQL, Stripe Checkout and
   Docker. The owner's direct instruction for this delivery is a multipage
   website as a zip file he can open now. Resolution: this delivery is a
   static HTML/CSS/JS site (no backend to host, no accounts needed). The
   configurator and pricing engine run client-side; the brief's rule that
   prices are re-verified server-side at checkout is recorded as a launch
   blocker in KNOWN_LIMITATIONS.md. Owner instruction wins for this
   delivery; the dynamic stack stays on the roadmap.

10. Checkout. The brief wants Stripe Checkout with CAD and Stripe Tax. A
    static zip cannot take real payments. The site ends standard configs at
    an order-request step (quote/invoice flow) and custom configs at a
    deposit quote request, both clearly labelled. Real Stripe integration is
    a launch blocker in KNOWN_LIMITATIONS.md.

11. Video length. The brief asks for 6-8 s hero loops. The generation tool
    produces clips of about ten seconds with no length control. The hero
    loop is about ten seconds. Tool reality wins; noted, not hidden.

## (c) Open decisions

See docs/OPEN_DECISIONS.md. Every unknown business fact is a [CONFIRM] token
on the site and an entry in that file with the default this build uses.

## (d) Phase plan

P1 Brand system and assets. DONE in this build: tokens, type, shape language,
style bible, hero video, key concept renders, favicon and OG image.

P2 Website. DONE in this build: all pages and sections, honest copy, FAQ with
answers, legal drafts, SEO surfaces (sitemap, robots, llms.txt, JSON-LD).

P3 Configurator, pricing engine, checkout, custom form, Buddy Club, admin.
DONE as a static prototype in this build: 5-step configurator with URL state,
server-side pricing noted as a launch requirement, order-request and quote
flows, Buddy Club signup with CASL consent text, admin pages stubbed as
documented future work.

P4 Describe Your Buddy. DONE as a client-side prototype in this build:
natural-language input mapped to the strict schema with deterministic
pricing, marked as a concept, human review before payment.

P5 Body CAD, enclosure, wiring, V1 firmware, provisioning, factory test
mode. NOT in this delivery. The licence checklist and print-settings notes
ship in docs; CAD and firmware are real engineering work for the owner.

P6 Voice tier prototype with benchmark report and pricing spreadsheet. NOT
in this delivery. The architecture and benchmark plan ship in docs; the Pi
benchmarks must run on real hardware.

P7 Security review, QA, load and e2e tests, launch checklist, runbook.
PARTIAL in this build: automated QA gates (contrast, links, copy rules),
threat-model outline and launch blockers in KNOWN_LIMITATIONS.md. Full
review waits on the real backend.

## Checkpoint for this delivery

File tree: see repo root. To preview: open web/index.html in a browser, or
serve the folder with any static server, for example:
`python3 -m http.server 8080` inside `web/`, then visit
http://localhost:8080.

What is real: all copy, the design system, the configurator logic, the
pricing engine math, the FAQ answers, the legal drafts (marked DRAFT).
What is mocked: AI-generated images and video (labelled "Concept render"),
the Describe-Your-Buddy LLM mapping (deterministic keyword prototype),
checkout (order-request flow, no payment taken), social handles
([CONFIRM] placeholders), business facts the owner has not confirmed.

What the owner must supply: decisions in OPEN_DECISIONS.md, real workshop
photos and videos, social handles, support contact, Stripe account for
launch, lawyer review of legal drafts.
