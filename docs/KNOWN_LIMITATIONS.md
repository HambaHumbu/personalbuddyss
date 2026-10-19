# KNOWN LIMITATIONS

Things this build does not do, stated plainly. Nothing here is hidden.

## Launch blockers (must be resolved before taking real orders)
1. **No payment processing.** The configurator ends in an order-request email. Real checkout needs Stripe Checkout (CAD) plus Stripe Tax, and the brief's rule that prices are re-verified server-side at checkout.
2. **No backend.** Orders, custom requests, uploads, Buddy Club signups, and admin are mailto flows and documented stubs. The database tables in the brief (orders, buddy_configs, build_stages, device_test_logs, etc.) do not exist yet.
3. **Legal drafts are drafts.** Privacy, terms, shipping/returns, and warranty pages are marked DRAFT FOR OWNER APPROVAL and need lawyer review.
4. **Business facts are placeholders.** See docs/OPEN_DECISIONS.md. Support email, social handles, lead time, shipping rates, and return policy need the owner's confirmation.
5. **Feature status honesty.** Pre-order features (Weather, Pomodoro, Touch, Custom Messages) need finished, factory-tested firmware before they ship. Coming-soon features (Motion, Bluetooth, Voice) are not sold.

## Deliberate scope decisions
- **Static site, not Next.js.** The owner asked for a multipage website as a zip he can open now. The dynamic stack (Next.js, PostgreSQL, Docker) stays on the roadmap in docs/STEP0.md.
- **Describe Your Buddy is a rules prototype.** The production design calls for an LLM with a strict JSON schema and Zod validation; this build maps keywords deterministically in the browser and is labelled a concept.
- **Video length.** Generated clips are about ten seconds; the brief asked for 6-8 s loops. The tool does not allow length control.
- **Images are AI concept renders.** Every one is labelled "Concept render" in the UI. Real workshop photos and footage replace them at launch.
- **Prices assume the research date.** Component prices were verified 2026-10-18. The Pi 5 market is volatile; re-check monthly. See docs/pricing-model.xlsx.

## Not yet built (roadmap phases P5-P7)
- Parametric CAD body, enclosure, wiring diagram, assembly guide.
- V1 firmware (ESP32-S3), provisioning tool, factory test mode.
- Voice tier prototype and on-hardware LLM benchmarks.
- Full security review, threat model sign-off, load and end-to-end tests.
- Licence checklist for the final body design (original or commercially licensed).
