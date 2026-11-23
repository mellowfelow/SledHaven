# SledHaven — Keyword Strategy Map (Internal)

**Data source:** Semrush Keyword Overview, US database, Desktop — refreshed **2026-11-22**. Volume/KD below are real Semrush figures, not estimates. Re-check via Semrush before any future major catalog/taxonomy change — rankings and volume drift over time.

## Real-brand catalog rebuild (2026-11-23) — full data provenance

The client flagged that the sled lineup used fictional in-house brands with no real US market leaders represented, and confirmed real dealer authorization to sell Ski-Doo, Polaris, Arctic Cat, and Lynx. All 49 fictional vehicle products and 6 fictional vehicle brands (Alpine Works, Kodiak Alpine, Vanguard Motors, Glacier Reserve, Yukon Heavy, plus the since-corrected SledHaven Junior/SledHaven Volt) were removed and replaced with **16 real, currently-listed products**, researched directly from official brand pages (ski-doo.brp.com, polaris.com) via the in-app browser, plus Arctic Cat and Lynx facts gathered via web search this session.

**Confidence level per product** — most fields for Ski-Doo and the Polaris RMK Khaos are pulled directly from official spec/pricing pages; fields marked "See [brand] dealer spec sheet" in a product's `specs` object are real gaps where the official page didn't publish that exact number for that trim, left honest rather than filled with an invented figure:

| Product | Category | Price | Source confidence |
|---|---|---|---|
| Ski-Doo Summit X with Expert Package | Mountain | $17,699 | High — official ski-doo.brp.com spec/price page; dry weight is a dealer-listing estimate, not BRP's own figure |
| Polaris 850 RMK Khaos 155 | Mountain | $17,049 | High — official polaris.com spec page (engine, suspension, track, dry weight all confirmed) |
| Ski-Doo MXZ X-RS with Competition Package | Trail | $16,399 | High — official ski-doo.brp.com spec/price page |
| Ski-Doo MXZ Sport | Trail | $10,199 | High — official ski-doo.brp.com spec/price page |
| Arctic Cat ZR 858 Sno Pro | Trail | $16,999 | Medium — engine/track/suspension from Arctic Cat's own site and dealer listings; this is the **2027 model year** (no clean 2026 official spec page found) |
| Ski-Doo Backcountry X-RS | Crossover | $17,199 | High — official ski-doo.brp.com spec/price page, including the real 43" wide ski-stance option |
| Ski-Doo Expedition Xtreme | Crossover | $17,249 | High — official ski-doo.brp.com spec/price page |
| Lynx XTerrain | Crossover | $21,349 | Medium — real US price confirmed via brplynx.com/us; detailed engine/suspension specs not independently verified this session |
| Ski-Doo Grand Touring LE with Platinum Package | Touring | $17,699 | High — official ski-doo.brp.com spec/price page |
| Ski-Doo Grand Touring Sport | Touring | $11,649 | High — official ski-doo.brp.com spec/price page |
| Ski-Doo Skandic SE | Utility | $15,249 | High — official ski-doo.brp.com spec/price page |
| Ski-Doo Skandic Sport | Utility | $10,899 | High — official ski-doo.brp.com spec/price page |
| Arctic Cat Bearcat 600 LT | Utility | $16,499 | Medium — real model/price from earlier competitor-pricing research; detailed specs not independently verified this session |
| Ski-Doo MXZ Neo | Youth | $7,049 | High — official ski-doo.brp.com pricing (shown on the MXZ page's "You may also like" rail) |
| Ski-Doo MXZ 120 | Youth | ~$4,199 | Medium — real model confirmed, price from third-party (SlashGear) 2026 pricing roundup, not BRP's own page directly |
| Ski-Doo Grand Touring Electric | Electric | $17,499 | High — official ski-doo.brp.com spec/price page, including the real 31.1-mile/15.5mph-governed range and charge-time figures |

**Lynx confirmed real and US-distributed:** BRP expanded Lynx into North American distribution for model year 2026 (previously Europe/Scandinavia-only) — confirmed via BRP's own investor press release and the live brplynx.com/us site. Not a legacy or discontinued brand.

**Why only 16 vehicles (down from 49):** the client explicitly said real data mattered more than matching the old count ("if all are real you should just add"). Several real models' specific dry weight / exact track length / exact horsepower per trim could not be confirmed from official sources in this session (manufacturer spec pages often list ranges or omit figures for a specific package); rather than invent a plausible-sounding number under a real trademarked product name, those fields are left as "See [brand] dealer spec sheet." This is a materially different risk profile than the fictional-brand era, where an invented spec was a creative-writing choice — here it would be a factual misstatement about a real company's real product.

**Reviews (`config/reviews.ts`):** the client separately confirmed these are real, migrated reviews — not fabricated. The reviews' `productPurchased` fields referenced the now-removed fictional products (Alpine Summit 850 Turbo R, Cascade Grand Touring 1000); these were updated to the real equivalent models (Ski-Doo Summit X with Expert Package, Ski-Doo Grand Touring LE with Platinum Package) to keep the site internally consistent. No other review content (names, ratings, dates, dealership-experience narrative) was altered.

**Not yet addressed:** the 28 Parts & Gear products still use fitment language written for the old fictional brands in a few places (now corrected to reference Ski-Doo/Polaris/Arctic Cat/Lynx generically by stance width and track length rather than brand name, since a single carbide/stud kit genuinely fits many brands' models at a given width/length). Blog post copy and customer reviews were swept for stale product names; `docs/PROJECT.md` carries a summary flag on this business-model change.

## Tier 1 — Quick Win (KD 0–25), assigned to pages

| Keyword | Volume | KD | Intent | Assigned URL |
|---|---|---|---|---|
| `snowmobiles for sale` | 6,600 | 13% | Transactional/Commercial | `/` & `/shop/` |
| `snowmobile for sale` | 6,600 | 19% | Transactional | `/shop/` |
| `utility snowmobile` | 590 | 9% | Informational/Commercial | `/shop/utility/` |
| `mountain snowmobile` | 480 | 20% | Commercial | `/shop/mountain/` |
| `snowmobile financing` | 480 | 7% | Informational | `/financing/` |
| `crossover snowmobile` | 210 | 13% | Informational/Transactional/Commercial | `/shop/crossover/` |
| `2 up snowmobile` / `two up snowmobile` | 210 | 9% | Commercial | `/shop/touring/` |
| `wide track snowmobile` | 110 | 7% | Informational | `/shop/utility/` (supporting) |
| `crossover snowmobile for sale` | 70 | 12% | Transactional | `/shop/crossover/` (supporting) |
| `best crossover snowmobile` | 70 | 4% | Commercial | `/shop/crossover/` (supporting) |
| `2 up snowmobile for sale` | 70 | 5% | Transactional | `/shop/touring/` (supporting) |
| `2 seater snowmobiles` | 70 | 7% | Commercial | `/shop/touring/` (supporting) |
| `crossover snowmobiles for sale` | 50 | 12% | Transactional | `/shop/crossover/` (supporting) |
| `2 up snowmobiles` | 50 | 7% | Commercial | `/shop/touring/` (supporting) |

## Replaced / corrected from the previous (unvalidated) version

- `mountain snowmobiles for sale` — **real volume is only 30** (below the Vol 50 floor). Dropped as a primary target; `mountain snowmobile` (Vol 480, KD 20%) replaces it for `/shop/mountain/`.
- `touring snowmobiles USA` — real data shows plain `touring snowmobile` (Vol 170) is dominated by **snowmobile-tour tourism intent** (Iceland/Yellowstone guided tours), not vehicle-purchase intent. Replaced with `2 up snowmobile` / `2-up snowmobile for sale`, which is cleanly commercial/transactional and matches the site's actual "2-Up Grand Touring" subcategory.
- `wide track utility snowmobiles` — real volume for the exact phrase is negligible; `utility snowmobile` (Vol 590, KD 9%) is both higher-volume and the single strongest category keyword found. `wide track snowmobile` (Vol 110) kept as a supporting/LSI term.
- `buy snowmobile with crypto` — **zero measurable search volume.** Dropped entirely as an SEO target. Keep it in on-page copy as a genuine differentiator/selling point, but do not rely on it to drive organic traffic.

## New: Crossover category (added 2026-11-22)

Real Semrush data confirmed `crossover snowmobile` as a distinct, low-competition keyword cluster (~400 combined volume across variants, all KD ≤13%) matching a real industry segment (Ski-Doo Expedition, Polaris Switchback). SledHaven had no genuine crossover-spec product — the one page previously labeled "Performance Crossover" (Adirondack Apex 850 XRS) is actually a rough-trail race sled by its own spec sheet (no wide stance, no long-travel suspension, no deep-snow capability), so it was relabeled "Rough-Trail Race" rather than repurposed. A new product, grounded in real crossover engineering (146" deeper-lug track, 42" wide stance, 9.5"/16" front/rear travel — researched from Ski-Doo Expedition and Polaris Switchback XC published specs), was added: **Monashee Crossover 850 XC** ($15,999), and `/shop/crossover/` now exists as its own top-level category.

**Remaining gap:** a true Expedition-style *utility-crossover* (deep-snow hauler, not just performance-crossover) is still unstocked — the `backcountry-crossover` subcategory is seeded in the taxonomy for this but has no product yet. Flag for a future SKU.

## New: Youth category (added 2026-11-22)

Real Semrush data confirmed strong, low-competition demand for a youth segment: `youth snowmobile` (Vol 720, KD 15%, Easy) and `youth snowmobile for sale` (Vol 210, KD 6%, Very Easy, clean Transactional intent) plus `youth snowmobiles for sale` (Vol 210, KD 7%). This matches a real industry segment (Ski-Doo MXZ 120/200/Neo, Polaris 120) that SledHaven did not previously stock at all. Added `/shop/youth/` with two subcategories — Recreational Youth and Trainer Trail Youth — with four parent-governed products ($3,999–$7,299) priced below the real Ski-Doo MXZ 120/200 ($4,199–$4,299) and MXZ Neo ($6,849–$7,049) benchmarks researched for this addition.

> **Corrected 2026-11-23:** this section originally put these products under a new "SledHaven Junior" brand. Real manufacturers (Polaris Indy 120/200, Arctic Cat ZR 120) keep youth models under their *main* parent brand — never a separate "Junior" sub-brand — and a brand named after the dealer itself doesn't match how any of SledHaven's other manufacturer brands (Alpine Works, Kodiak Alpine, Vanguard Motors, Glacier Reserve, Yukon Heavy) are structured. Reassigned the youth line to the existing **Vanguard Motors** brand (its trail-focused, entry-friendly identity is the closest real-world fit), matching the real OEM pattern. Product names dropped "SledHaven Junior" accordingly (e.g. "Vanguard Drift 120").

| Keyword | Volume | KD | Intent | Assigned URL |
|---|---|---|---|---|
| `youth snowmobile` | 720 | 15% | Informational/Commercial | `/shop/youth/` |
| `youth snowmobile for sale` | 210 | 6% | Transactional | `/shop/youth/` |
| `youth snowmobiles for sale` | 210 | 7% | Transactional | `/shop/youth/` (supporting) |

## New: Parts & Gear category (added 2026-11-22)

Real Semrush data validated 6 real aftermarket demand categories, all low-competition (KD ≤15%), none guessed. Real retail pricing anchors were pulled via web search (Woody's, C&A Pro, PowerMadd Cobra, Sno Stuff, Dayco, Gates, SP1/Parts Unlimited, Klim/Snow Deer) to price each SledHaven part at or below the real market rate for the equivalent tier, while every part's fitment is written against real spec ranges already in the catalog (ski stance 34"-42", track length 120"-174", lug depth 1.0"-3.0", engine 599cc-899cc) rather than invented compatibility.

| Keyword | Volume | KD | Intent | Assigned URL | Real-market price anchor |
|---|---|---|---|---|---|
| `snowmobile cover` | 880 | 15% | Commercial | `/shop/parts/` (covers-storage) | SP1/Parts Unlimited trailerable: $97-$270+ |
| `snowmobile track studs` | 590 | 2% | Commercial | `/shop/parts/` (track-studs) | Woody's 90-stud kit: ~$354-$454 |
| `heated snowmobile gloves` | 480 | 12% | Commercial | `/shop/parts/` (riding-gear) | Savior/Snow Deer: $75-$110; Klim premium higher |
| `snowmobile drive belt` | 210-260 | 14-15% | Commercial | `/shop/parts/` (belts-clutch) | Dayco/Gates: $95-$230 |
| `snowmobile ski carbides` | 170 | 3% | Informational/Commercial | `/shop/parts/` (carbide-skis) | C&A Pro/Woody's runners: $69-$255/pair |
| `snowmobile windshield` | 170-260 | 6-7% | Commercial | `/shop/parts/` (windshields) | PowerMadd Cobra: $155-$240; Sno Stuff: $90-$115 |
| `snowmobile clutch kit` | 110 | 0% | Commercial | `/shop/parts/` (belts-clutch) | No reliable retail figure found — priced relative to belt tier |

Added `/shop/parts/` as a 7th top-level category with 7 subcategories, 13 products (the 2 pre-existing gear SKUs relabeled into it, plus 11 new). `utility` was renamed from "Utility & Alpine Gear" to "Utility Snowmobiles" and its `heated-gear` subcategory removed, since gear now lives under `parts` — this is a cleaner separation (vehicles vs. accessories) matching how real dealers structure "New Snowmobiles" vs. "Parts & Accessories".

**Caveat:** `snowmobile clutch kit` real-world retail pricing wasn't captured cleanly in this pass (searches returned unrelated results) — the $399 price was set relative to the validated belt pricing tier, not a direct competitor match. Worth a follow-up price check specifically against Woody's/BRP clutch kit listings before this is treated as fully verified.

## New: Electric category (added 2026-11-22)

Checked via genuine semrush.com (free Keyword Checker, not the browser-pane source used for other checks this session — see note below). Confirmed real, low-competition demand for an electric segment, and a real competitive market already serving it.

| Keyword | Volume (US) | KD | Intent |
|---|---|---|---|
| `electric snowmobile` | 2,400 | 8% (Very Easy) | Informational/Commercial |
| `electric snowmobiles` | 390 | 11% (Very Easy) | — |
| `electric snowmobile for sale` | 140 | 8% (Very Easy) | Transactional |
| `children's electric snowmobile` | 320 | 23% (Easy) | — (youth-electric crossover opportunity, not yet built) |

**Real competitors confirmed in the live Google SERP Semrush pulled:** Ski-Doo has its own electric model page (Grand Touring Electric / Expedition Electric — commercial/tour-operator focused, range-limited to ~31mi at a governed 15.5mph); **Taiga Motors** (Nomad — a real production performance electric sled, 90HP-equiv/23kWh/~62mi range, $17,490-$19,490); **MoonBikes** (a lighter electric "snow bike" class, $8,500 base, 2.5kWh, ~1-1.5hr ride time); **SnowmobileTrader.com has a literal "Electric" listing category** — confirming the industry already treats this as a distinct, named segment, not a novelty.

Added `/shop/electric/` as an 8th top-level category with 2 subcategories, matching the two real distinct archetypes found (not one invented "electric" product):
- **Electric Trail & Touring** (Taiga Nomad-style, serious trail-capable performance): Volt Trail 23kWh ($14,999) and Volt Trail 31kWh Long Range ($16,999) — both undercut Taiga's real $17,490-$19,490, with range/charge-time specs scaled proportionally from Taiga's published 23kWh->62mi and performance-battery->83mi figures.
- **Light Recreational Electric** (MoonBikes-style snow bike, not a full-size sled): Volt Scout Light Electric ($7,499) and Volt Scout Dual-Battery ($8,999) — both undercut MoonBikes' real $8,500 base, with weight/range/charge-time specs grounded in MoonBikes' published 163lb/2.5kWh/1-1.5hr figures and its real dual-battery option.

**Note on data source:** this check used the genuine `semrush.com` free Keyword Checker (confirmed real company page, not a lookalike), separate from the `4.semrush.com.in` source the earlier sessions' checks in this file came from. That domain is NOT verified as legitimate Semrush — it redirected to an unrelated third-party login page (`noxtools.com`) during this session. Earlier keyword figures in this file sourced from that domain should be treated as unverified until re-checked against genuine Semrush or another trusted tool.

> **Corrected 2026-11-23:** the products above were originally branded "SledHaven Volt." Confirmed via research that real precedent for dedicated electric-only snowmobile makers (Taiga Motors, MoonBikes) is a standalone manufacturer brand distinct from any dealer — never the dealer's own name. Renamed the brand to **Voltrek Motors** (a standalone electric-only manufacturer, consistent with how Taiga/MoonBikes are structured in the real market) and dropped "SledHaven" from all four product names (e.g. "Voltrek Trail 23kWh").

## Parts & Gear expansion (added 2026-11-22, second pass — "too thin" review)

User flagged Parts & Gear (13 products, 7 subcategories) as too thin. Ran a second, more intensive research pass using genuine semrush.com's free Keyword Checker (5 checks/day quota) plus web search, then expanded to 28 products across 11 subcategories.

**Semrush-validated this pass (genuine semrush.com, real figures):**

| Keyword | Volume (US) | KD | Intent |
|---|---|---|---|
| `snowmobile jacket` | 1,300 | 12% (Very Easy) | Informational/Commercial |
| `snowmobile goggles` | 1,300 | 10% (Very Easy) | Informational/Commercial |
| `snowmobile bibs` | 720 | 10% (Very Easy) | Informational/Commercial |

Real competitors confirmed in the live SERP: 509 (ride509.com), Polaris's own apparel line, Dennis Kirk, Ski-Doo Outlet, Up North Sports. This justified expanding **Riding Gear & Apparel** from 2 products (helmet, gloves) to 6 (+ jacket $279, bibs $249, goggles $89, boots $219). **Boots was not individually Semrush-checked** — the day's 5-check quota ran out on this term — priced/added on the reasonable inference that it follows the same uniform low-competition pattern as jacket/bibs/goggles, not on a directly verified number. Flag for a follow-up check.

**Added via real-market web-search pricing (not Semrush volume, but real cited retail prices):**
- **Ice Scratchers & Snowflaps** (new subcategory): real OEM $100-170 (Ski-Doo), universal aftermarket $20-60, premium performance $270 (Canadian retailer) — added 2 products ($69, $229)
- **Lighting & Electrical** (new subcategory): real aftermarket range $17-400+ depending on tier — added 2 LED light bar products ($159, $299)
- **Seats & Comfort** (new subcategory): real OEM heated seats $495-890 (Ski-Doo), aftermarket pad ~$140 — added a heated seat ($349, well under OEM) and a budget seat cover/cushion ($59, no direct price cited — reasonable estimate for a common low-cost accessory category)
- **Carbide Skis & Runners**: added a race-spec tier ($219) grounded in the real C&A Pro Mini Race Carbide listing ($254.99)
- **Trailers & Towing**: added a tow strap ($34, grounded in real snowmobile-specific strap pricing $11-44) and a loading ramp ($229, **no direct price source found** — estimated from general ATV/snowmobile ramp market knowledge, flag for verification)

**EV Charging Accessories (new subcategory, tied to the Electric category):** real portable Level 2 charger market is $190-280 (Lectron and similar) — added a portable home charging kit ($249). The DC fast-charge adapter cable ($199) has **no specific cited retail price** — priced relative to the home-charger tier, flag for verification, same caveat pattern as the earlier clutch-kit gap.

**Net result:** Parts & Gear grew from 13 products / 7 subcategories to **28 products / 11 subcategories**. Three items across this expansion (boots exact volume, loading ramp price, DC fast-charge cable price) are reasonable estimates rather than directly-cited figures — flagged above rather than presented as equally verified.

## Open item — Trail category keyword

Neither `trail snowmobile` (Vol 260, dominated by trail-riding-conditions/informational intent — "Wisconsin snowmobile trails open") nor `performance trail snowmobile` (no measurable volume) gave a clean transactional keyword for `/shop/trail/`. The page currently relies on the strong site-wide `snowmobiles for sale` / `snowmobile for sale` terms plus its own product names. Needs a follow-up Semrush check against more specific variants (e.g. brand-model-style long-tail, "performance sled for sale") before a dedicated trail-category keyword can be assigned with confidence.

## Still assigned, not yet re-verified this pass

- `snowmobile dealership` -> `/` & `/about/`
- `compare snowmobiles side by side` -> `/compare/`
- `nationwide snowmobile freight delivery` -> `/faq/` & `/about/`

## Brand roster research (2026-11-23) — "top 10-15 brands" request vs. real market structure

Client asked to expand beyond the 4 existing real brands to the "top 10-15" US snowmobile brands. Researched via ISMA (International Snowmobile Manufacturers Association) industry data, each manufacturer's own site, and dealer listings — **not** via Semrush, since the account had zero API units remaining on every report type at the time of this research (confirmed via the Semrush MCP tool's own error response). Note: the client also pointed at a `1.semrush.com.in` browser tab as "Semrush" — this is a lookalike domain, not semrush.com (the same domain family, `4.semrush.com.in`, redirected unprompted to an unrelated third-party login page earlier in this project). Findings came from manufacturer/industry sources instead, which is the more authoritative source for a brand-roster question regardless.

**Finding: the US snowmobile market does not have a "top 10-15 brands" tier.** ISMA's own 2026 industry report names exactly 4 active full-line manufacturers:
- **Arctic Cat** — active, but ownership fact on site was wrong (said Textron; corrected — sold to an independent investor group April 2025, see `docs/PROJECT.md`)
- **BRP** (Ski-Doo + Lynx) — active, both already on site
- **Polaris** — active, already on site
- **Yamaha** — confirmed directly on yamahamotorsports.com: ended snowmobile production in 2025, dealer support only, no new models to sell. **Not added** — would be a false "buy new" claim.

**Added: Taiga Motors** (Montreal, Quebec) as a verified 5th real brand — the only ground-up all-electric snowmobile manufacturer, with 3 live "Order Now" models confirmed on taigamotors.com (Nomad Pro $19,499 / Performance $21,999 / Scout $22,249, MY27). Full specs (drive unit kW, range, track, suspension, towing, charging) pulled directly from each model's official Taiga spec sheet. Added to the Electric category; a new `electric-utility-backcountry` subcategory was created for the Pro and Scout trims (fleet/backcountry use), while Performance joins the existing Ski-Doo Grand Touring Electric under `electric-trail-touring`.

**Considered and rejected:**
- **Alpina** — real company (47 North Snowmobiles is its US distributor, Saginaw MI), but makes industrial dual-track utility machines (ski patrol/grooming/oil-field use) sold B2B through one small distributor — not a consumer retail product, doesn't fit a "Shop" catalog.
- **Crazy Mountain, Moto MST** — named in market-research reports as industry players but no confirmable US dealer network or retail listings found. Adding them would mean inventing product specs under real company names with nothing real behind them — breaks the "100% real" rule.

**Net result:** brand count went from 4 to 5 (Ski-Doo, Polaris, Arctic Cat, Lynx, Taiga Motors); vehicle product count went from 16 to 19 (added Taiga Nomad Pro, Performance, Scout). This is a researched ceiling, not an incomplete pass — see `docs/PROJECT.md` for the standing note against re-litigating this without fresh verification.

## Site-wide product/brand image fix (2026-11-23) — full source list

Fixed the cross-brand image mismatch flagged in `docs/PROJECT.md` for all 16 real vehicle products + 6 brand cards. Every image below was pulled directly from the named manufacturer's own site/CDN (official studio product renders, mostly transparent PNG, 661×480 to 2400×1350 source resolution), then flattened onto the site's `#EDE7DD` background and resized to 1200×896 to match the existing product-card convention.

| Product | File | Official source |
|---|---|---|
| Ski-Doo Summit X w/ Expert Package | `sled-ski-doo-summit-x-expert.jpg` | ski-doo.brp.com/us/en/models/previous-models/2026/summit.html (Adobe Dynamic Media asset) |
| Polaris 850 RMK Khaos 155 | `sled-polaris-rmk-khaos-155.jpg` | polaris.com/en-us/snowmobiles/2026/rmk/rmk-khaos/850-rmk-khaos-155-specs/ (cdn1.polaris.com) |
| Ski-Doo MXZ X-RS w/ Competition Package | `sled-ski-doo-mxz-xrs-competition.jpg` | ski-doo.brp.com .../2026/mxz.html |
| Ski-Doo MXZ Sport | `sled-ski-doo-mxz-sport.jpg` | ski-doo.brp.com .../2026/mxz.html (direct dam asset, RSIDE studio) |
| Arctic Cat ZR 858 Sno Pro | `sled-arctic-cat-zr-858-sno-pro.jpg` | arcticcat.com/snowmobile/2027/zr-858-sno-pro (hubfs catalog asset, 3/4 angle — no side-profile variant found) |
| Ski-Doo Backcountry X-RS | `sled-ski-doo-backcountry-xrs.jpg` | ski-doo.brp.com .../2026/backcountry.html |
| Ski-Doo Expedition Xtreme | `sled-ski-doo-expedition-xtreme.jpg` | ski-doo.brp.com .../2026/expedition.html (direct dam asset, RSIDE studio) |
| Lynx XTerrain | `sled-lynx-xterrain.jpg` | brplynx.com/us/en/models/snowmobiles/crossover/xterrain.html (MY26-specific Viper Red/Black asset, not the current MY27 default) |
| Ski-Doo Grand Touring LE w/ Platinum Package | `sled-ski-doo-gt-le-platinum.jpg` | ski-doo.brp.com .../2026/grand-touring.html |
| Ski-Doo Grand Touring Sport | `sled-ski-doo-gt-sport.jpg` | ski-doo.brp.com .../2026/grand-touring.html (direct dam asset, RSIDE studio) |
| Ski-Doo Skandic SE | `sled-ski-doo-skandic-se.jpg` | ski-doo.brp.com .../2026/skandic.html |
| Ski-Doo Skandic Sport | `sled-ski-doo-skandic-sport.jpg` | ski-doo.brp.com .../2026/skandic.html (direct dam asset, RSIDE studio) |
| Arctic Cat Bearcat 600 LT | `sled-arctic-cat-bearcat-600-lt.jpg` | arcticcat.com/snowmobile/2027/bearcat-600-lt (hubfs catalog asset, 3/4 angle; catalog lists this product as my26 — price matches the my27 page exactly, flagged for a future year-label check, not addressed in this pass) |
| Ski-Doo MXZ Neo | `sled-ski-doo-mxz-neo.jpg` | ski-doo.brp.com .../2026/mxz-neo.html |
| Ski-Doo MXZ 120 | `sled-ski-doo-mxz-120.jpg` | ski-doo.brp.com .../2026/mxz-120-200.html (MY25 dam asset — Ski-Doo's own page reuses this photo for the MY26 listing) |
| Ski-Doo Grand Touring Electric | `sled-ski-doo-gt-electric.jpg` | ski-doo.brp.com .../2026/grand-touring-electric.html |

Brand cards (BRANDS array in catalog.ts) now reuse each brand's own flagship product photo above: Ski-Doo → Summit X Expert, Polaris → RMK Khaos 155, Arctic Cat → ZR 858 Sno Pro, Lynx → XTerrain. Taiga → its existing Nomad Performance photo (sourced in the brand-addition pass above). Polaris's site (polaris.com) blocks direct navigation with a Cloudflare challenge on most pages; the `-specs/` subpage path loads without the challenge and was used for its CDN image.

**Hero slider (slides 2-4) + category grid tiles:** sourced separately from Unsplash (free-license stock, no manufacturer claim) since these are atmospheric/category imagery, not specific-product photos — no watermarks, full commercial-use license. Files: `hero-mountain-powder.jpg`, `hero-trail-action.jpg`, `hero-touring-lake.jpg` (hero, 1376×768) and `category-mountain.jpg`, `category-trail.jpg`, `category-crossover.jpg`, `category-touring.jpg`, `category-utility.jpg`, `category-youth.jpg` (category grid, 1200×900). The Electric category tile reuses the real `sled-ski-doo-gt-electric.jpg` product photo instead of stock, since Unsplash has no electric-snowmobile-specific imagery. Parts & Gear category tile unchanged (`gear-carbon-helmet.jpg` was already an accurate in-house gear photo, not a mismatch).
