# BlackPeak — Shopify Theme Rebuild PRD

**Version:** 1.0 · **Date:** 2026-09-06 · **Owner:** Moazzam Sameer
**Store:** blackpeak.quest · **Delivery:** Shopify Online Store 2.0 theme, deployed from GitHub

---

## Executive Summary

**blackpeak.quest cannot complete a checkout today.** The header "Box" control is decorative markup with no `href` to `/cart` and no drawer trigger, and no template in the live theme exposes a path to `/checkout` — so a shopper can browse and add to cart, then dead-ends. Revenue capture is not degraded; it is zero, and every rupee of paid and organic traffic converts to nothing.

Three problems compound it: the catalogue advertises a Rs 499 six-can Gift Box (plus singles and a 24-can case) that BlackPeak cannot fulfil; copy quotes stale prices against a catalogue that is now **Rs 600** for a single-flavour 12-can box and **Rs 660** for Build Your Own; and the Build Your Own counter is a front-end toy that produces no line item.

This PRD specifies a full theme rebuild — not a rebrand. The approved copy, palette and type system are retained verbatim; the structural failure is what gets fixed. The release gate is a checkout that works with JavaScript disabled, four purchasable SKUs and nothing else, and a Build Your Own path that adds a real Rs 660 line item carrying the customer's flavour mix.

---

## 1. Overview, Goals & Scope

### 1.1 Problem statement

In the outgoing theme the header "Box" icon is rendered as a decorative element with no `href` to `/cart` and no drawer trigger, and no template exposes a path to `/checkout`. The cart is unreachable, so the checkout is unreachable.

Three secondary problems compound it:

1. **The catalogue lies.** The site sells a Rs 499 six-can Gift Box that no longer exists, alongside singles at Rs 59 and a 24-can case at Rs 999 that were never real SKUs. Even with a working cart, a shopper following the hero's "Shop the Rs 499 Gift Box →" CTA lands on a product BlackPeak cannot fulfil.
2. **Pricing is stale.** Copy quotes Rs 599 and "Rs 55 a can" against a catalogue that is now Rs 600 (fixed-flavour 12-pack) and Rs 660 (Build Your Own).
3. **Build Your Own has no commerce behind it.** The mix-and-match counter counts to 12 and has a "Build my box" button that does not produce a line item.

The brand itself is not broken. The copy, the voice ("Excitement + a note of Ruggedness"), the palette and the type system are working assets. This is a **rebuild of the theme, not a rebrand** — the copy in `docs/CONTENT-SOURCE.md` is the specification, reproduced verbatim, and the failure to fix is structural.

### 1.2 Objectives

| # | Objective | Why it matters |
|---|---|---|
| O1 | Make checkout bulletproof and reachable from every page, in every state | Removes the single defect that zeroes revenue |
| O2 | Reduce the catalogue to exactly four purchasable SKUs and purge dead ones | A shopper can never reach a product BlackPeak cannot ship |
| O3 | Make "Build Your Own" a real transaction, not a widget | It is the Rs 660 hero SKU and the highest-margin path |
| O4 | Preserve every line of approved copy verbatim | The brand voice is already signed off; the rebuild must not re-litigate it |
| O5 | Ship as an Online Store 2.0 theme deployed from this GitHub repo | Client can review, roll back, and re-deploy without a dev in the loop |
| O6 | Render prices, availability and cart state from live Shopify data | No hardcoded rupee figures anywhere in Liquid or JS |

**O1 is the release gate.** No other objective can be traded against it, and no build ships without the §1.6 release gates green.

### 1.3 In scope

- **Cart and checkout system** — header cart icon wired to a cart drawer with a `/cart` page fallback, live item-count bubble, `/cart/add.js` and `/cart/change.js` handling, subtotal in INR, and a `POST /cart` → `/checkout` submit path that works with JavaScript disabled or broken (§4).
- **Four products, four purchase paths** — `green-apple`, `mojito`, `watermelon` (Rs 600 each, existing handles preserved) and a new `build-your-own` (Rs 660) (§2).
- **Build Your Own section** — 12-can counter across three flavours, "All 3, evenly" and "Surprise me" quick-fill, live summary, and a "Build my box" action that adds the Rs 660 product with the flavour mix captured as line-item properties.
- **Templates and sections** — the full route map in §3.2 and the section inventory in §3.3, all copy verbatim per `docs/CONTENT-SOURCE.md` with the sanctioned overrides in §6.3 applied.
- **Design system** — the brand tokens from the live `base.css` reproduced identically (§5.5).
- **Responsive and accessible delivery** — mobile-first, keyboard-operable cart and builder controls, focus management on drawer open/close.
- **Theme settings** — schema for announcement messages, social links and section toggles so copy edits do not require a code deploy.

### 1.4 Explicitly out of scope

| Out of scope | Note |
|---|---|
| The Rs 499 6-can Gift Box, Rs 59 singles, Rs 999 24-can case | Removed everywhere per §2.5: sections, CTAs, links, FAQ answers, cross-sells, alt text, theme settings defaults |
| Subscriptions, bundles-as-discounts, quantity-break pricing | Flat prices only: Rs 600 / Rs 660 |
| Customer accounts beyond Shopify defaults | Footer "Orders / Profile" links point at Shopify's stock account routes; no custom account UI |
| Payment gateway configuration, shipping zones, tax setup | Shopify admin work, not theme work — see §1.7 |
| Multi-currency, multi-language, markets | Store is INR-only, English-only |
| Product photography, packaging or logo redesign | Existing assets reused |
| Blog, search, wishlist, product reviews app | Blog and search are templated but unlaunched (§3.10, §3.12); social proof is static copy, no review app |
| Analytics/pixel implementation beyond Shopify's native hooks | Tracked separately |
| Migrating orders, customers, or historical data | Same store, same admin |

### 1.5 Target users

**Primary — the Kashmiri local (Srinagar, Jammu, valley towns).** Buys for a picnic, a shop counter, a family gathering. Knows the brand from the shelf or Instagram. Mobile, often on a patchy connection. Wants a fast add-to-cart and a familiar UPI/COD checkout. *Implication:* the storefront must work on a mid-range Android over 3G, and the cart must never require a heavy JS bundle to be reachable.

**Secondary — the diaspora buyer (Delhi, Bangalore, Mumbai, Gulf-adjacent family in India).** Ordering "a taste of home", frequently as a gift shipped to a third address. Higher intent, higher AOV, more likely to choose Build Your Own to send all three flavours. *Implication:* shipping-across-India reassurance must be visible pre-cart, and BYO must be the easiest thing on the page.

**Tertiary — the tourist.** Discovered BlackPeak in a café or houseboat, wants to take the valley home. Often shopping days after tasting, from a hotel or an airport. *Implication:* `/products/green-apple` and friends must stand alone as landing pages with a working buy button — no reliance on having seen the homepage.

All three share one trait relevant to this rebuild: **they arrive intent-loaded and are lost entirely at the cart step.** The design target is fewest possible taps from flavour to checkout.

### 1.6 Success metrics and release gates

| Metric | Baseline (current theme) | Target | How measured |
|---|---|---|---|
| Cart dead-ends | 100% — no route to checkout exists | **0** | From every template, cart icon reaches cart, cart reaches Shopify checkout |
| Checkout reachability | 0% | **100% of sessions with a non-empty cart** | Every page renders a cart control with a working destination |
| Checkout completion rate (session with add-to-cart → order) | 0% | **≥ 25%** within 30 days of launch | Shopify Analytics conversion funnel |
| Add-to-cart rate (sessions → cart adds) | Unmeasurable | **≥ 8%** | Shopify Analytics |
| Broken/dead product links (gift box, singles, case) | Present sitewide | **0** | Forbidden-string gate, §2.5 Step 4 |
| BYO completion (BYO section engaged → line item added) | 0% — no line item possible | **≥ 40%** | Cart adds with BYO line-item properties ÷ BYO interactions |
| Checkout works with JS disabled | No | **Yes** | §6.5 Part A |
| Mobile Lighthouse, `/` and `/products/green-apple` | — | **Performance ≥ 80, Accessibility ≥ 95** | Lighthouse mobile, Slow 4G + 4× CPU |
| Copy fidelity | — | **100% of content-source strings match verbatim** | `scripts/copy-check.mjs` (§6.3) |

**Release gates (launch blockers — none may be waived):**

| # | Gate | Verified by |
|---|---|---|
| G1 | The header "Box" control has a real destination (`/cart` href) on **every** template including `404` and policy pages | §4.1 I1, §6.4 AC-CART-1 |
| G2 | The cart drawer and `/cart` page each contain a checkout submit that reaches Shopify's hosted checkout | §4.1 I2/I3, §6.4 AC-CART-3/4 |
| G3 | With JavaScript disabled, a shopper can add to cart from a product page and reach checkout via `/cart` | §6.4 AC-CART-2, §6.5 Part A |
| G4 | No removed-catalogue string survives anywhere in the repo | §2.5 Step 4 gate |
| G5 | Every price on every surface is rendered from Shopify product data via Liquid `money` filters — never a literal | §6.2 AC-CAT-4 |

### 1.7 Assumptions and dependencies

**Assumptions**

- **A1** — Three products exist in Shopify admin at handles `green-apple`, `mojito`, `watermelon`, each active, in stock, priced Rs 600, on the Online Store sales channel. The theme renders them; it does not create them.
- **A2** — Store currency is INR and Shopify's `money_format` is configured to output `Rs. 600.00` style, matching site copy.
- **A3** — Product imagery, can renders and the logo already exist in the store's Files or the previous theme's assets and are available for reuse.
- **A4** — Copy in `docs/CONTENT-SOURCE.md` is client-approved and final. Any string not in that file is either Shopify-generated (checkout, policy pages) or must be raised before it ships.
- **A5** — Shopify's hosted checkout is functional at the account level; the defect is theme-side only.
- **A6** — Traffic is majority mobile, majority India.

**Dependencies (blocking, owned outside this build)**

| # | Dependency | Owner | Blocks |
|---|---|---|---|
| D1 | Create product `build-your-own` — "Build Your Own 12-Can Box", Rs 660, active, published to Online Store, inventory tracking off (§2.3) | Client (Shopify admin) | BYO purchase path, O3 |
| D2 | Archive or unpublish the Rs 499 Gift Box product and any singles/24-can SKUs so their URLs 404 or redirect | Client (Shopify admin) | G4, O2 |
| D3 | Confirm at least one payment method live (UPI / cards / COD) and shipping rates for India | Client (Shopify admin) | Checkout completion metric |
| D4 | GitHub repo connected to the Shopify store via the GitHub theme integration, with theme files at repository root | Client / dev | O5, all deploys |
| D5 | Redirects for retired URLs (gift box, singles, case) to `/products/build-your-own` or `/collections/all` | Client (Shopify admin URL redirects) | SEO continuity, G4 |
| D6 | Sign-off on the BYO fulfilment model — one Rs 660 SKU carrying the mix as line-item properties (specified in §2.2) rather than three tracked variants | Client | BYO data model; changing it is a scope change |

**Risks worth naming now** (full register in §6.11)

- If D1 slips, the Rs 660 SKU has no product to add and the BYO section must degrade to a merchant-visible "coming soon" state rather than a broken button — a silently failing add-to-cart is a repeat of the original defect.
- Line-item properties (D6) do not decrement per-flavour inventory. If the client needs flavour-level stock accuracy, the BYO model changes to a variant or bundle structure, which must be flagged before build starts.

---

## 2. Product Catalogue & Commerce Model

### 2.1 The catalogue, in full

Four purchasable SKUs. Nothing else may exist as a buyable product on the storefront.

| # | Product title (admin + storefront) | Handle | Price (INR) | Variants | Per-can | What ships |
|---|---|---|---|---|---|---|
| 1 | Green Apple 12 PACK | `green-apple` | 600.00 | 1 (Default Title) | Rs 50 | 12 × 300 ml Green Apple |
| 2 | Mojito 12 Pack | `mojito` | 600.00 | 1 (Default Title) | Rs 50 | 12 × 300 ml Mojito |
| 3 | Watermelon 12 PACK | `watermelon` | 600.00 | 1 (Default Title) | Rs 50 | 12 × 300 ml Watermelon |
| 4 | Build Your Own 12-Can Box | `build-your-own` | 660.00 | 1 (Default Title) | Rs 55 | 12 × 300 ml, mix per line-item properties |

Note the exact product titles: they are the scraped storefront strings and include the inconsistent casing ("12 PACK" vs "12 Pack"). Preserve them verbatim — do not normalise. Prices are set on the variant; the theme never hardcodes `600` or `660` in Liquid or JS and always renders through the `money` filter so `Rs. 600.00` comes from `settings.money_format`.

**Explicitly not products, and not to be re-introduced:** the Rs 499 six-can Gift Box, Rs 59 singles, and the Rs 999 24-can case. Singles in particular are a trap — the Build-Your-Own UI counts cans, but there is no can-level SKU anywhere in the store, and none may be created (see §2.4).

### 2.2 Build Your Own: one product, one line item, fixed Rs 660

#### The model

`build-your-own` is a **single-variant product at a fixed Rs 660**. The customer's mix is metadata attached to that one line item via Shopify **line-item properties** — never 12 line items, never a 12-can quantity, never per-flavour child products.

- `quantity` on the line item means **number of boxes**, not number of cans. Quantity 1 = one 12-can box = Rs 660.
- Total cans in the mix must equal exactly 12 for every box.
- Price is independent of the mix: 12/0/0 and 4/4/4 both cost Rs 660.

#### Property schema

Properties are ordered; Shopify renders them in submission order in the cart, checkout, order confirmation email, and packing slip. Keys beginning with `_` are hidden from all customer-facing surfaces but remain readable in Liquid, the Admin order view, and the Orders API — use them for machine payloads.

| Key | Visible? | Example value | Purpose |
|---|---|---|---|
| `Green Apple` | yes | `5 cans` | Human-readable pick line in cart/checkout/packing slip |
| `Mojito` | yes | `4 cans` | as above |
| `Watermelon` | yes | `3 cans` | as above |
| `Mix` | yes | `5 Green Apple / 4 Mojito / 3 Watermelon` | Single-line redundant summary; survives to the order even if per-flavour keys are truncated |
| `_mix` | no | `{"green-apple":5,"mojito":4,"watermelon":3}` | Machine-parseable mix for fulfilment tooling / exports |
| `_total_cans` | no | `12` | Integrity check; asserted at pick time |
| `_byo_version` | no | `1` | Schema version, so a future change is distinguishable in old orders |

Rules:

- **Omit any flavour with a count of 0 from the visible keys** (a `Watermelon: 0 cans` line on a packing slip causes mis-picks). `_mix` always carries all three keys, including zeros.
- Values are strings. A property with an empty-string value is hidden by Shopify, so never emit `""` for a real count.
- Keep the total payload small (a few hundred bytes). No images, no base64, no long prose.
- Property key spelling is contractual: `Green Apple`, `Mojito`, `Watermelon` — exact case and spacing, because ops reads them off the packing slip.
- At least one **customer-visible** property carrying the mix must survive to the order. The mix is never stored only in `localStorage` or cart attributes.

#### Line-item merging behaviour (load-bearing)

Shopify merges cart lines only when **variant ID and the full property set match exactly**. Consequences the theme must handle:

- Adding 5/4/3 twice produces **one** line with quantity 2 (two identical boxes). Correct.
- Adding 5/4/3 then 6/3/3 produces **two separate lines**, each quantity 1. Correct and intended — do not attempt to combine them.
- The cart drawer's `+`/`−` on a BYO line changes the number of identical boxes. It must never mutate the mix. Editing a mix = remove the line and rebuild.

#### Exact `/cart/add.js` submission

The builder submits JSON to the AJAX Cart API. Use the `items` array form and request cart sections back in the same round trip so the drawer re-renders without a second fetch:

```js
const res = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({
    items: [{
      id: BYO_VARIANT_ID,            // Number, from product.selected_or_first_available_variant.id
      quantity: 1,                   // ONE box, never 12
      properties: {
        'Green Apple': '5 cans',     // omitted entirely when count is 0
        'Mojito': '4 cans',
        'Watermelon': '3 cans',
        'Mix': '5 Green Apple / 4 Mojito / 3 Watermelon',
        '_mix': '{"green-apple":5,"mojito":4,"watermelon":3}',
        '_total_cans': '12',
        '_byo_version': '1'
      }
    }],
    sections: 'cart-drawer,header',
    sections_url: window.location.pathname
  })
});
if (!res.ok) { /* 422 → parse body.description, show inline error, do NOT clear the builder state */ }
```

- `BYO_VARIANT_ID` is injected from Liquid (`{{ product.selected_or_first_available_variant.id }}` on the BYO section, or a `settings`-selected product on the homepage section). It is **never** hardcoded in a JS file — variant IDs differ between dev and live stores.
- A form-encoded `<form action="/cart/add">` fallback is kept for the no-JS path (`properties[Green Apple]=5 cans`); see §4.7.
- The three flavour 12-packs post the same endpoint with `quantity: 1` and **no properties**.
- Never post the *product* ID. `/cart/add.js` takes a variant ID; posting a product ID yields a 404/422 and is the classic cause of a silently dead "Add to box" button.

#### Builder → payload rules

| UI control | Resulting mix |
|---|---|
| Manual `+`/`−` per flavour | Any non-negative integers summing to exactly 12; individual flavours may be 0 |
| "All 3, evenly" | Green Apple 4 / Mojito 4 / Watermelon 4 |
| "Surprise me" | Random split summing to 12 with **each flavour ≥ 2**, so a "mix" is always actually a mix |
| Counter `0 / 12` | Live total; "Build my box" is `disabled` until the total is exactly 12 |

Validation is client-side (the counter gate) plus a re-check in the cart-page/drawer render. A hostile client can still POST a mix that doesn't sum to 12; a Shopify cart-validation Function would close that, but Functions require an app, which is out of scope for a theme-only build. **Mitigation for v1:** the hidden `_total_cans` property plus an ops check on the order — any BYO line whose `_mix` does not sum to 12 is flagged before packing. This is documented accepted risk, not a defect. Because the price is fixed at Rs 660 server-side regardless of mix, a bad mix can never cause a pricing exploit.

#### Rendering properties in the cart

Cart drawer and cart page loop `item.properties`, skipping keys that start with `_` and any blank value:

- Line title: product title (`Build Your Own 12-Can Box`).
- Beneath it, one line per visible property: `Green Apple · 5 cans`.
- Line price: `Rs. 660.00` × quantity. No mix-derived price arithmetic anywhere — the price comes from `item.final_line_price`.

### 2.3 Merchant admin setup checklist

The three flavour products already exist at their handles; the task is to normalise them and create one new product. All work in Shopify Admin → Products.

**For all four products**

- Status **Active**; published to the **Online Store** sales channel.
- Price set as in §2.1; **no compare-at price** (there is no discount story).
- **Charge tax** on ✓ · **This is a physical product** ✓ · shipping weight set (a 12-can box ≈ 4.2 kg gross — weigh one and use the real number; INR shipping rates depend on it).
- Vendor `BlackPeak` · Product type `Soda`.
- SKUs: `BP-GA-12`, `BP-MJ-12`, `BP-WM-12`, `BP-BYO-12`.
- One product image minimum; alt text set (accessibility + the theme uses it in cards).
- Single variant only. Do not add a size or flavour option — extra options break the "Add to box" button's assumption of one variant.

**Existing flavour products — verify/fix**

- Price is exactly `600.00` (the old site copy said `599.00` — confirm on the variant, not just in theme copy).
- Handle unchanged: `green-apple`, `mojito`, `watermelon`. Changing a handle breaks live inbound links and the theme's `all_products[]` lookups.
- Each is in the **All Flavours** collection (`all-flavours`), which is what the footer "Shop: All Flavours" link and the Shop nav point at.

**New product — Build Your Own 12-Can Box**

- Title `Build Your Own 12-Can Box`, handle **`build-your-own`** (type it; do not let Shopify derive `build-your-own-12-can-box`, which the theme's lookups will miss).
- Price `660.00`.
- **Not** in `all-flavours` — it is reached from the Build Your Own section and its own product page, and putting it in the flavour grid duplicates the mix UI. It does still appear in `/collections/all`, which is where the Shop grid's fourth card comes from (§3.6).

**Metafields (namespace `custom`), on the three flavour products** — these drive the lineup cards and product-page accents so the theme carries no per-flavour hardcoding:

| Metafield | Type | Green Apple | Mojito | Watermelon |
|---|---|---|---|---|
| `custom.tagline` | single line text | `Crisp & loud` | `Cool & cheeky` | `Big & bold` |
| `custom.badge` | single line text | *(empty)* | `Non-alcoholic` | *(empty)* |
| `custom.accent` | single line text | `#8FC93B` | `#27C6B6` | `#FF5C84` |
| `custom.accent_deep` | single line text | `#3C6B16` | `#0C6F64` | `#C72F58` |
| `custom.flavour_key` | single line text | `green-apple` | `mojito` | `watermelon` |

`custom.flavour_key` is the join between the product and the builder's `_mix` keys. The builder reads the three flavour products via a section setting (three product pickers) rather than by hardcoded handle, so a handle change degrades to an empty row instead of a broken page.

### 2.4 Inventory implications

Shopify tracks inventory **per variant**. The BYO box and the flavour 12-packs draw down the same physical cans, but Shopify has no concept of a bill of materials on a theme-only store — a BYO sale cannot decrement Green Apple stock. This must be handled deliberately, not discovered in production.

**v1 decision: turn inventory tracking OFF for `build-your-own`.**

- Product → Inventory → **Track quantity: unchecked**. The box is always purchasable; nothing to oversell against.
- The three flavour 12-packs **do** track quantity, with **"Continue selling when out of stock" OFF**, so a sold-out flavour disables its own "Add to box".
- Consequence: BYO can be sold when a component flavour is at zero. This is an ops reconciliation problem, not a checkout problem. It is the correct trade for a bootstrapped store where fulfilment is manual and the alternative (an inventory app or Shopify Functions) adds cost and a dependency.

**Rejected alternatives, and why**

- *12 single-can SKUs, added as 12 line items with a cart discount to reach Rs 660* — creates buyable singles (a hard "no"), makes checkout show 12 lines, breaks the packing slip, and requires a Script/Function for the pricing.
- *BYO variants for every mix* — the number of 3-flavour compositions of 12 is 91, times any future flavour; unmanageable in admin and pointless since price is flat.
- *BYO stock number maintained by hand* — extra manual work that still doesn't tie to flavour stock; adopt only if overselling becomes a real complaint.

**Ops reconciliation (documented, not built)**

1. Fulfilment reads the visible properties off the packing slip to pick a BYO box.
2. Weekly, someone subtracts the week's BYO can draw (`_mix` totals per flavour, from an order export) from the flavour on-hand counts in Admin.
3. If BYO volume grows past roughly a few boxes a day, revisit with a proper inventory app — in the post-launch backlog, not pre-built.

**Acceptance criteria — catalogue & inventory**

| # | Criterion |
|---|---|
| C1 | `/collections/all` and every storefront surface expose exactly four purchasable products; a store-wide product query returns no active product other than the four in §2.1 |
| C2 | Each of the four has exactly one variant; the theme renders no variant selector |
| C3 | Adding a BYO box creates **one** cart line, quantity 1, `line_price` = 66000 (paise) regardless of the mix |
| C4 | The BYO line's `properties` contain only the non-zero flavour keys plus `Mix`, `_mix`, `_total_cans`, `_byo_version` |
| C5 | Cart, checkout, order confirmation email, and packing slip all display the flavour breakdown; none display `_`-prefixed keys |
| C6 | Two different mixes added in one session produce two separate cart lines; the same mix added twice produces one line at quantity 2 |
| C7 | "Build my box" is disabled at any total ≠ 12 and no `/cart/add.js` request fires while disabled |
| C8 | A sold-out flavour 12-pack disables its own add button; BYO remains purchasable |
| C9 | No Liquid, JS, JSON, or locale file contains a literal `600`, `660`, or `Rs.` used as a price — all prices flow from variant data through `money` |

### 2.5 Removal plan: the Rs 499 six-can Gift Box (and Rs 59 / Rs 999)

The gift box is not just a product — it is threaded through copy, CTAs, and settings. Treat removal as a checklist with a grep gate, not as a copy edit.

**Step 1 — Product and store data (Shopify Admin)**

1. Locate the gift-box product (expected handle `gift-box` or similar — confirm in Admin; do not guess in code).
2. **Set status to Archived, not Deleted.** Archiving preserves past order line items and reporting; deletion degrades historical orders. Ensure it is unpublished from the Online Store channel.
3. Remove it from every collection, and from every navigation menu (Online Store → Navigation: main menu, footer menus).
4. Create a **301 URL redirect**: `/products/gift-box` → `/products/build-your-own`. Add redirects for any gift-box collection or landing-page URL that exists. Verify in Admin → Online Store → Navigation → URL Redirects, and against Search Console's indexed URLs if available.
5. Delete any gift-box-specific metafield definitions, discount codes, or automatic discounts referencing it.

**Step 2 — Copy surfaces (each a specific edit, all sourced from `docs/CONTENT-SOURCE.md`)**

| Surface | Old | New |
|---|---|---|
| Announcement bar, item 3 | `Gift-ready: the Rs 599 12-can box ships nationwide.` | `Gift-ready: the Rs 600 12-can box ships nationwide.` |
| Hero CTAs | third CTA `Shop the Rs 499 Gift Box →` | **CTA deleted.** Two CTAs remain: `Build your pack` · `Meet the flavours` |
| Lineup prices | `Rs. 599.00` | `Rs. 600.00` (rendered via `money`, from variant price) |
| Why BlackPeak, card 4 | `The Rs 499 6-can box ships across India as a taste of Kashmir.` | `The 12-can box ships across India as a taste of Kashmir.` |
| Newsletter, bullet 2 | `…we'll nudge you in time to send a Rs 499 box.` | `…we'll nudge you in time to send a box.` |
| FAQ Q6 "How do the multipacks work?" | gift-box answer | `Two ways to buy: a 12-can box of a single flavour at Rs 600, or Build-Your-Own at Rs 660 — mix Green Apple, Mojito and Watermelon across 12 cans, or tap 'All 3, evenly' or 'Surprise me'. Ships across India.` |
| Product page cross-sell | `Make it a gift — Rs 499 box` block | **Block deleted.** Only `Missing a flavour? Build a box — Mix all three into a 12-can box.` remains |
| Build Your Own note | — | `12 cans, mix & match — best value at Rs 55 a can. Ships across India.` (Rs 660 ÷ 12 = Rs 55; the claim is arithmetically true and must stay true if price changes) |

**Step 3 — Theme code and settings**

- Delete any `gift-box` section, snippet, block schema, or section preset. A `settings_data.json` block referencing a deleted section type is a silent render failure — remove the block, not just the file.
- Purge gift-box entries from `locales/*.json`, from JSON-LD / structured data, and from any Open Graph or meta description strings.
- Remove gift-box images from `assets/` and any CDN references.

**Step 4 — The forbidden-string gate (canonical)**

This is the single authoritative gate. It runs pre-commit, in CI (§5.7), and in QA (§6.2). Run from the repository root; **every command must return zero matching lines.**

```bash
grep -rniE '(rs\.?[[:space:]]*)?499' --include='*.liquid' --include='*.json' \
  --include='*.js' --include='*.css' . | grep -v '^./docs/'
grep -rniE 'gift[ _-]?box|giftbox|6[ -]?can|six[ -]?can' --include='*.liquid' \
  --include='*.json' --include='*.js' --include='*.css' .
grep -rniE 'rs\.?[[:space:]]*(59|599|999)([^0-9]|$)' --include='*.liquid' \
  --include='*.json' --include='*.js' --include='*.css' .
grep -rniE '24[ -]?(can|pack|case)' --include='*.liquid' --include='*.json' \
  --include='*.js' --include='*.css' .
```

Known-safe strings that must **not** be caught and must **not** be edited away: `Rs 50 off`, `KASHMIR50`, `Rs 55 a can`, `Rs 600`, `Rs 660`, `300 ml`, `12 cans`. If a grep hits one of these, tighten the pattern — do not change the copy. Any other match must be individually justified in the PR description; silent allowances are not permitted.

The only places a removed-catalogue string may legitimately appear are `docs/` (this PRD and the content source), where it is explicitly described as removed.

**Acceptance criteria — removal**

| # | Criterion |
|---|---|
| R1 | The Step 4 gate returns no unjustified matches |
| R2 | `/products/gift-box` (and any other former gift-box URL) 301-redirects to `/products/build-your-own`, verified with `curl -I` against the live domain |
| R3 | The gift-box product is Archived and unpublished, and past orders containing it still render correctly in Admin |
| R4 | Site search for "gift" (`/search?q=gift`) surfaces no purchasable product |
| R5 | `sitemap.xml` contains no gift-box URL and exactly four product URLs |
| R6 | The hero renders exactly two CTAs; the product page renders exactly one cross-sell block |
| R7 | Every price shown anywhere on the site is `Rs. 600.00` or `Rs. 660.00`, and each traces to a real variant price |

---

## 3. Information Architecture & Page Specs

**Currency in copy.** All prices in prose and copy blocks are written `Rs 600` / `Rs 660` / `Rs 55` / `Rs 50`, matching the store's money format; all machine-rendered prices use `{{ ... | money }}` and output `Rs. 600.00`. No `₹` glyph appears anywhere in the theme.

### 3.1 Navigation model

The global nav is exactly four affordances, in this order, on every page:

| Label | Target | Type | Notes |
|---|---|---|---|
| `BLACKPEAK` | `/` | Wordmark link | Anton display type; not a nav item, sits at the left of the header |
| `Home` | `/` | Menu link | Active state on `index` template |
| `Shop` | `/collections/all` | Menu link | Active on `collection`, `product`, `search` templates |
| `Contact` | `/pages/contact` | Menu link | |
| `Box` | `/cart` | **Cart affordance** | Icon + item-count bubble + the word "Box" |

**"Box" is the cart.** There is no separate "Cart" label anywhere in the UI — the brand word for cart is *Box*, matching the drawer heading "Your box" and the product CTA "Add to box". This naming was the root of the original bug (an icon that read as decoration and was never wired to a route), so the IA contract is explicit: `Box` is always a real anchor to `/cart`, JS only enhances it into a drawer, and the `/cart` template is a first-class page rather than a fallback stub. The full implementation contract is §4.3.

Menu source: Shopify navigation handle `main-menu` for the three text links, with `Box` hard-rendered in the header section so it can never be deleted from the merchant admin. Footer menus are separate (§3.3.10).

The nav also appears in a mobile drawer (hamburger) below 768 px; `Box` stays in the header bar at all breakpoints — it is never collapsed into the hamburger.

### 3.2 Route and template map

Theme files live at the **repository root** (§5.2) so the GitHub → Shopify integration can sync directly.

| Route | Template file | Type | Spec |
|---|---|---|---|
| `/` | `templates/index.json` | OS 2.0 JSON | §3.3 |
| `/products/green-apple`, `/mojito`, `/watermelon` | `templates/product.json` | OS 2.0 JSON | §3.4 |
| `/products/build-your-own` | `templates/product.build-your-own.json` | Alternate product template | §3.5 |
| `/collections/all` | `templates/collection.json` | OS 2.0 JSON | §3.6 |
| `/collections` | `templates/list-collections.json` | OS 2.0 JSON | Single "All Flavours" card |
| `/cart` | `templates/cart.json` | OS 2.0 JSON | §3.7, §4.4 |
| `/pages/about-us` | `templates/page.about-us.json` | Alternate page template | §3.8 |
| `/pages/contact` | `templates/page.contact.json` | Alternate page template | §3.9 |
| any other page | `templates/page.json` | OS 2.0 JSON | Generic rich-text page |
| `/search` | `templates/search.json` | OS 2.0 JSON | §3.10 |
| 404 | `templates/404.json` | OS 2.0 JSON | §3.11 |
| `/blogs/*` | `templates/blog.json` | OS 2.0 JSON | §3.12 |
| `/blogs/*/*` | `templates/article.json` | OS 2.0 JSON | §3.12 |
| password page | `templates/password.liquid` | Liquid | §3.13 |
| gift card | `templates/gift_card.liquid` | Liquid | §3.14 |
| `/policies/*` | Shopify-hosted | — | Linked from footer; no theme template |
| `/account*` | `templates/customers/*` | — | Minimal styled defaults; footer "Orders / Profile" links |

**Global layout** (`layout/theme.liquid`) wraps every template with, in order: `announcement-bar` → `header` → `{{ content_for_layout }}` → `footer` → `cart-drawer` (rendered once, outside `content_for_layout`, so it is available on **every** template including 404, search, password-gated previews, and cart itself).

`layout/password.liquid` is a stripped variant: no header nav, no cart drawer, no footer menus.

### 3.3 Home — `templates/index.json`

Sections in order. "Verbatim" means the string is reproduced character-for-character from `docs/CONTENT-SOURCE.md`, including punctuation, em dashes, and the "(and non-alcoholic)" parentheticals. The complete list of permitted deviations is §6.3 AC-COPY-2.

| # | Section file | Content | Verbatim? |
|---|---|---|---|
| 1 | `announcement-bar.liquid` | 4 rotating messages (§3.3.1) | Verbatim, one price edit |
| 2 | `header.liquid` (layout) | Nav per §3.1 | Verbatim labels |
| 3 | `hero.liquid` | Eyebrow, 2-line title, body, 2 CTAs, 4 trust chips | Verbatim, one CTA deleted |
| 4 | `lineup.liquid` | Eyebrow/title/sub + 3 flavour cards + footer link | Verbatim |
| 5 | `build-your-own.liquid` | Mix & match builder | Verbatim |
| 6 | `why-blackpeak.liquid` | Eyebrow/title/sub + 4 benefit blocks + CTA | Verbatim, one benefit body edited |
| 7 | `our-story.liquid` | Eyebrow/title + 2 paragraphs + 4 cards + CTA | Verbatim |
| 8 | `social-proof.liquid` | Eyebrow/title + 3 reviews | Verbatim |
| 9 | `newsletter.liquid` | Eyebrow/title/body/button/fine print + 3 bullets | Verbatim, one bullet edited |
| 10 | `faq.liquid` | Eyebrow/title/sub + 6 Q&A + CTA | Verbatim, Q6 rewritten |
| 11 | `footer.liquid` (layout) | Menus, legal, disclaimer | Verbatim |

#### 3.3.1 Announcement bar

Rotating (marquee or timed fade — schema setting `rotation_mode`), 4 messages, all **verbatim** except message 3:

1. `Made in Kashmir. Three bold flavours, one valley.`
2. `Full fizz. Green Apple, Mojito, Watermelon.`
3. `Gift-ready: the Rs 600 12-can box ships nationwide.` — **edited** from Rs 599
4. `Build your own 12-can box.`

Messages are `block` type so the merchant can reorder/edit; the four above ship as the default `index.json` preset. Rotation respects `prefers-reduced-motion` (falls back to a static rotation with a 6 s fade).

#### 3.3.2 Hero

- Eyebrow: `Kashmir's own soda` — verbatim
- Title line 1: `Cold country soda` — verbatim
- Title line 2: `Bold flavour, bold fizz.` — verbatim
- Body: `Green Apple, Mojito, Watermelon — the whole valley in a can. Pick your three, mix your pack, and take a little Kashmir wherever you go. Caffeine-free. Bold all the way.` — verbatim
- CTAs: `Build your pack` → `#build-your-own` · `Meet the flavours` → `#lineup`
- **DELETED:** the third CTA `Shop the Rs 499 Gift Box →`. The hero renders exactly two buttons; there must be no orphan third button slot, no hidden markup, and no `gift` block in the section schema.
- Trust chips (4, verbatim): `3 bold flavours` · `Made in Kashmir` · `Caffeine-free` · `Bold fizz`

#### 3.3.3 Lineup

- Eyebrow `The lineup` / Title `Three flavours. One valley.` / Sub `Kashmir's own soda, in 300 ml slim cans. Pick your favourite, or grab all three.` — all verbatim
- Three product cards, sourced from a `collection` setting (default: `all-flavours`) so price comes from Shopify, not hardcoded:

| Card | Tagline | Extra | Price (rendered) | Link |
|---|---|---|---|---|
| Green Apple | `Crisp & loud` | — | `Rs. 600.00` | `/products/green-apple` |
| Mojito | `Cool & cheeky` | `Non-alcoholic` badge | `Rs. 600.00` | `/products/mojito` |
| Watermelon | `Big & bold` | — | `Rs. 600.00` | `/products/watermelon` |

Taglines come from `custom.tagline` (§2.3). Price is `{{ product.price | money }}` — never a literal string.

- Footer link (verbatim): `Can't choose? Build your box` → `#build-your-own`
- Cards use the flavour accent tokens from §5.5.

#### 3.3.4 Build your own (`#build-your-own`)

The commercial centrepiece. All copy verbatim.

- Eyebrow `Mix & match` / Title `Build your own box. Mix all three.` / Sub `Pick 12 cans across Green Apple, Mojito and Watermelon — your valley, your way.`
- Three stepper rows, labelled verbatim: `Green Apple 12 PACK`, `Mojito 12 Pack`, `Watermelon 12 PACK` (note the inconsistent casing on Mojito — reproduce it, it matches the live product titles). Each row carries the sub-label `300 ml slim can · caffeine-free`.
- Quick buttons: `All 3, evenly` (sets 4/4/4) · `Surprise me` (random split summing to 12, each flavour ≥ 2)
- Counter: `0 / 12`, helper text `Pick 12 cans — mix all three.`
- Summary panel: label `Your box`, live price, CTA `Build my box`
- Note (verbatim): `12 cans, mix & match — best value at Rs 55 a can. Ships across India.`

The commerce contract is §2.2 (one Rs 660 line item, mix as line-item properties) and the form/no-JS contract is §4.7. The IA contract here is: the section's CTA adds the `build-your-own` product with the three counts as line-item properties and, on success, opens the cart drawer. The same section file is embedded (different heading defaults) on `templates/product.build-your-own.json`.

#### 3.3.5 Why BlackPeak

Eyebrow `Why BlackPeak` / Title `Made in Kashmir. Built to be fun.` / Sub `Bold flavour, bold fizz, and a whole valley behind every can.` — verbatim. Four blocks:

1. 🏔️ `Made in Kashmir` — body verbatim
2. `Three bold flavours` — body verbatim
3. `Caffeine-free, any-time` — body verbatim
4. `Slim, giftable, ready to travel` — **edited body:** `300 ml slim cans that slide into a cooler, a bag, or a gift box. The 12-can box ships across India as a taste of Kashmir.`

CTA `Build my box` → `#build-your-own`.

#### 3.3.6 Our story

Eyebrow `Our story` / Title `Born in the valley. Bottled with attitude.` / P1 and P2 verbatim / four cards verbatim: `Made in Kashmir`, `One local founder`, `Three flavours, one valley`, `A taste of home to take with you`. CTA `Build Your Box` (note the title-case variant here vs `Build my box` elsewhere — preserve both exactly as scraped).

#### 3.3.7 Social proof

Eyebrow `Loved across the valley` / Title `Spotted across the valley.` Three review blocks, verbatim including the original typography and typos:

1. `"Tastes like home in a can."` — `Verified buyer`
2. `I love the packaging` — `I love the packaging. I haven't seen designs like these ever before.` — `Neha`
3. `Tastes better than others` — `Im proud that talent like this is emerging in kashmir. I have tried all three flavours and they taste better than other brands selling mojitos, watermelon is my personal favourite.` — `Seerat`

Do not correct `Im` → `I'm` or capitalise `kashmir`. These are customer words.

#### 3.3.8 Newsletter

Eyebrow `Join the valley` / Title `Join the valley. Get Rs 50 off your first box.` / Body verbatim / Button `Join the valley` / Fine print `Rs 50 off your first box · use code KASHMIR50 at checkout · unsubscribe anytime.` — all verbatim. Bullets:

1. `First dibs on drops` — verbatim
2. `Never miss a gift` — **edited body:** `Eid, Diwali, birthdays — we'll nudge you in time to send a box.`
3. `Valley-only surprises` — verbatim

Form posts to Shopify's `customer` form with `contact[tags] = newsletter`; success and error states render inline (no redirect to a `?form_type=` fragment jump).

#### 3.3.9 FAQ

Eyebrow `FAQ` / Title `Questions? The valley's got answers.` / Sub verbatim. Six `<details>`-based accordion blocks. Q1–Q5 answers verbatim. **Q6 is rewritten** (the only rewritten answer):

> **How do the multipacks work?** — `Two ways to buy: a 12-can box of a single flavour at Rs 600, or Build-Your-Own at Rs 660 — mix Green Apple, Mojito and Watermelon across 12 cans, or tap 'All 3, evenly' or 'Surprise me'. Ships across India.`

CTA `Build my box`. Emit `FAQPage` JSON-LD from the same block data.

#### 3.3.10 Footer (global)

Verbatim: wordmark `BLACKPEAK`; blurb `Built in the valley by a local J&K founders, in small batches. Green Apple, Mojito, Watermelon.` (the grammatical slip "a local J&K founders" is preserved — verbatim rule); Social `Instagram`, `Facebook`; **Shop:** `All Flavours` → `/collections/all`; **Brand:** `About Us`, `Contact`; **Legal:** `Privacy Policy`, `Refund Policy`, `Shipping Policy`, `Terms of Service` (Shopify `/policies/*` routes); **Help:** `Orders` → `/account`, `Profile` → `/account`; `© 2026 BlackPeak. Kashmir. Bold. Fun.`; `Product of India`; and the full disclaimer paragraph verbatim.

The footer contains **no** gift-box link and no price strings.

### 3.4 Product page — `templates/product.json`

Applies to `green-apple`, `mojito`, `watermelon`.

| # | Section | Content |
|---|---|---|
| 1 | `main-product.liquid` | Gallery, title (`Green Apple 12 PACK` etc. from Shopify), price `Rs. 600.00`, quantity, buy buttons |
| 2 | `product-trust-ticks.liquid` | 4 ticks |
| 3 | `product-feature-strip.liquid` | 4 feature pairs |
| 4 | `product-description.liquid` | `product.description` from admin |
| 5 | `product-cross-sell.liquid` | Single BYO cross-sell |
| 6 | `faq.liquid` (reused) | Optional, merchant-toggleable |

- Buy button label: `Add to box` — verbatim, overriding the theme default "Add to cart". The same label lives in `locales/en.default.json` so every AJAX/error path agrees.
- Trust ticks, verbatim: `✓ Made in Kashmir` · `✓ Caffeine-free` · `✓ Ships across India` · `✓ Secure checkout`
- Feature strip, verbatim, 4 label/body pairs: `300 ML OF KASHMIR` / `One slim can. All valley.` · `CAFFEINE-FREE` / `Bold without the buzz.` · `3 FLAVOURS, 1 VALLEY` / `Green Apple, Mojito, Watermelon.` · `BOLD FIZZ` / `Fizz that means it.`
- Cross-sell, verbatim: `Missing a flavour? Build a box` / `Mix all three into a 12-can box.` → `/products/build-your-own`
- **DELETED:** the `Make it a gift — Rs 499 box` cross-sell block. No second cross-sell slot exists in the schema.
- Page accent colour is driven by the `custom.accent` metafield; the accent must not leak into the header or footer.
- `Product` JSON-LD with `priceCurrency: INR`, price from the variant, `availability` from the variant.

### 3.5 Build Your Own product — `templates/product.build-your-own.json`

Handle `build-your-own`, title `Build Your Own 12-Can Box`, price Rs 660. The handle-specific template means direct traffic to `/products/build-your-own` renders a full builder page rather than a stock PDP.

Sections in order: `main-product` (title, price, hero image only — **no** default add-to-cart form) → `build-your-own.liquid` (the same section as home §3.3.4, `heading_style: page`) → `product-trust-ticks` → `product-feature-strip` → `product-description` → `faq`.

The only add-to-cart control on this template is the builder's `Build my box` CTA, which is disabled until the counter reads `12 / 12`.

### 3.6 Collection / Shop — `templates/collection.json`

`Shop` in the nav resolves to `/collections/all`. Sections in order:

1. `collection-banner.liquid` — Title `Shop`, sub `Kashmir's own soda, in 300 ml slim cans. Pick your favourite, or grab all three.` (reused verbatim from the lineup sub)
2. `main-collection-product-grid.liquid` — exactly **4** cards, no filters, no sort UI (the catalogue is too small to warrant either): Green Apple 12 PACK, Mojito 12 Pack, Watermelon 12 PACK (all `Rs. 600.00`), Build Your Own 12-Can Box (`Rs. 660.00`). The BYO card carries the badge `Mix all three`.
3. `build-your-own.liquid` — full builder, so Shop can convert without a second click
4. `faq.liquid` — optional

Empty-collection state must never appear in production; if the collection returns 0 products the grid renders the four handles directly as a safety net and logs nothing user-visible.

### 3.7 Cart page — `templates/cart.json`

This template is load-bearing: it is the no-JS and hard-navigation destination for the `Box` affordance, and the last line of defence for the checkout bug. Its markup contract, invariants and failure guards are §4.4; the IA contract is:

| # | Section | Content |
|---|---|---|
| 1 | `main-cart.liquid` | Heading `Your box`; line items with flavour thumbnails; BYO lines render their per-flavour counts from line-item properties as a read-only breakdown |
| 2 | (same section, footer region) | `Subtotal`, `Checkout` (submit, `name="checkout"`), `Keep shopping` link → `/collections/all` |

- Empty state (verbatim): `Your box is empty. Kashmir's waiting.` plus a `Keep shopping` link and the builder CTA.
- The cart **drawer** (rendered globally from the layout) uses the identical copy set — `Your box`, `Close ✕`, `Your box is empty. Kashmir's waiting.`, `Subtotal`, `Checkout`, `Keep shopping` — all verbatim.

### 3.8 About Us — `templates/page.about-us.json` (`/pages/about-us`)

1. `page-hero.liquid` — Eyebrow `Our story`, Title `Kashmir. Bold. Fun.`, Lede `Most great sodas come from somewhere far away. Ours comes from here.` — verbatim
2. `rich-text.liquid` — P1, P2, P3 verbatim
3. `value-cards.liquid` — four cards verbatim: `Made in Kashmir`, `Bold by design`, `Built to be fun`, `Founder-run and local`
4. `cta-band.liquid` — `Build Your Box` → `/products/build-your-own`
5. `social-proof.liquid` — reused, optional

Page content lives in section blocks, not in the Shopify page body, so it is version-controlled with the theme.

### 3.9 Contact — `templates/page.contact.json` (`/pages/contact`)

1. `page-hero.liquid` — Eyebrow `Contact`, Title `Talk to us.` — verbatim
2. `contact-channels.liquid` — four blocks, all bodies verbatim:
   - `Stock BlackPeak` — `info@blackpeak.quest` (mailto), `+91 7006170478` (tel)
   - `Everything else` — `contact@blackpeak.quest`
   - `Press and partnerships` — `moazzam@blackpeak.quest`
   - `Registered office` — `BlackPeak Beverages Private Limited, Srinagar, Jammu & Kashmir`, `Mon–Sat, 9am–5pm`
3. `contact-form.liquid` — Shopify `{% form 'contact' %}` with Name, Email, Message; inline success/error
4. `contact-note.liquid` — `We reply within two working days. If we don't, send it again.` — verbatim
5. `faq.liquid` — reused, optional

Emit `Organization` JSON-LD with the registered-office address and `contact@blackpeak.quest`.

### 3.10 Search — `templates/search.json`

1. `main-search.liquid` — search field, results count, product results in the same card component as §3.6; article results below products
2. Zero-results state: `Nothing in the valley matches that.` (new copy — flag for client sign-off) plus a `Keep shopping` link and the four catalogue cards
3. `build-your-own.liquid`

Predictive search in the header is out of scope for v1; the header has no search icon (the nav is the four items in §3.1). `/search` remains reachable and indexable.

### 3.11 404 — `templates/404.json`

1. `error-404.liquid` — Title `Lost in the valley.`, body `That page has wandered off. The soda hasn't.` (new copy — flag for sign-off), CTAs `Keep shopping` → `/collections/all` and `Home` → `/`
2. `lineup.liquid` — reused, so a 404 still surfaces all three flavours plus the builder link

Header, footer, and the `Box` affordance are fully functional on 404 — this template must not be a bare Liquid page.

### 3.12 Blog and article — `templates/blog.json`, `templates/article.json`

Not launched with content, but templated so a future "Valley notes" blog needs no theme work.

- `blog.json`: `main-blog.liquid` (banner using `blog.title`, article card grid, pagination) → `newsletter.liquid`
- `article.json`: `main-article.liquid` (title, date, author, featured image, body, share links) → `newsletter.liquid` → `lineup.liquid`
- Comments disabled by default; the template supports `blog.comments_enabled?` if turned on later.
- `Article` JSON-LD on `article.json`.

### 3.13 Password — `templates/password.liquid` + `layout/password.liquid`

Standalone layout: wordmark `BLACKPEAK` only, no nav, no cart drawer, no footer menus. Content: hero eyebrow `Kashmir's own soda`, headline `Cold country soda` (verbatim reuse), the storefront password form, and the newsletter signup using the §3.3.8 copy. Includes the standard "Enter using password" link for the owner. Must render without any JS.

### 3.14 Gift card — `templates/gift_card.liquid`

Standalone Shopify gift-card template: BLACKPEAK wordmark, gift-card value in INR, QR code, code with a copy-to-clipboard control, expiry if set, and a `Keep shopping` link to `/collections/all`. Print stylesheet included.

> **Naming note:** this template is Shopify's gift-*card* feature and is unrelated to the removed Rs 499 gift *box* product. Do not use it as a home for gift-box copy, and do not link to it from the storefront.

---

## 4. Cart & Checkout Specification (critical)

The previous build's single fatal defect lived here: the header "Box" control was a JavaScript-only element, there was no `/cart` template, and no element on the site ever submitted to `/checkout`. Every rule below exists to make that class of failure structurally impossible, not merely unlikely.

### 4.1 Governing principle: HTML-first, JS-as-upgrade

The cart must work with JavaScript **disabled, broken, blocked by an extension, or still loading**. JavaScript may only ever make the cart *nicer* — never make it *possible*.

Three hard invariants a reviewer can check by reading the Liquid source alone, without running the theme:

| # | Invariant | How it is verified |
|---|---|---|
| **I1** | The header Box control is an `<a href="{{ routes.cart_url }}">` in the rendered HTML. Never a `<button>`, `<div>`, or `<span>`. | `curl -s https://blackpeak.quest \| grep -o '<a[^>]*href="/cart"'` returns a match |
| **I2** | `templates/cart.json` + `sections/main-cart.liquid` exist and contain a native `<form action="{{ routes.cart_url }}" method="post">` with `<button type="submit" name="checkout">`. | `curl -s https://blackpeak.quest/cart` contains `name="checkout"` |
| **I3** | Every "Checkout" control anywhere in the theme is either (a) a `type="submit"` button named `checkout` bound to a form that posts to `/cart`, or (b) an `<a href="/checkout">`. No `onclick` navigation, ever. | grep the repo for `Checkout`; each hit must be inside a `<form>` or an `<a href>` |

If any of I1–I3 cannot be demonstrated, the theme does not ship.

### 4.2 File inventory (repository root — GitHub-connected theme)

| Path | Responsibility |
|---|---|
| `layout/theme.liquid` | Renders `{% section 'cart-drawer' %}` immediately before `</body>` on **every** page |
| `sections/header.liquid` | Renders the Box link (I1) and the count bubble |
| `templates/cart.json` | OS 2.0 JSON template wiring `main-cart` |
| `sections/main-cart.liquid` | Full no-JS cart page (I2) |
| `sections/cart-drawer.liquid` | Drawer markup; re-rendered via the Section Rendering API |
| `snippets/cart-item.liquid` | Single line row, shared by page and drawer (params: `item`, `context: 'page' \| 'drawer'`) |
| `snippets/cart-icon-bubble.liquid` | Count bubble only |
| `assets/cart.js` | The *only* cart script. Plain ES2019+, no framework, no dependencies |

`assets/cart.js` is loaded as `<script src="{{ 'cart.js' | asset_url }}" defer></script>`. It must not be bundled with, or share a file with, `global.js` or any other script — a syntax error in a carousel must never be able to take the cart down (failure mode F3). This is the deliberate exception to the one-script rule in §5.4.

### 4.3 The Box control (header)

```liquid
<a href="{{ routes.cart_url }}"
   class="header__box"
   id="cart-icon-bubble"
   data-cart-drawer-toggle
   aria-label="{{ 'sections.header.cart' | t }}, {{ cart.item_count }} items">
  {%- render 'icon-box' -%}
  {%- render 'cart-icon-bubble' -%}
</a>
```

Rules:

- Label text stays **"Box"** (per header nav copy). `aria-label` carries the live count.
- `data-cart-drawer-toggle` is the *only* hook `cart.js` looks for. The `href` is authored in Liquid and is never removed, rewritten, or emptied by script.
- The click handler calls `event.preventDefault()` **only after** it has confirmed the drawer element exists in the DOM and is initialised. Order matters:

```js
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-cart-drawer-toggle]');
  if (!toggle) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // modified clicks fall through
  const drawer = document.querySelector('cart-drawer');
  if (!drawer || !drawer.isReady) return;   // fall through to href="/cart"
  e.preventDefault();
  drawer.open(toggle);
});
```

- The count bubble is hidden (not zero-rendered) when `cart.item_count == 0`, and carries `<span class="visually-hidden">{{ cart.item_count }} items in your box</span>`.
- On `/cart` itself the drawer is not opened by the Box link — the link simply navigates, since the user is already on the cart page.

### 4.4 The `/cart` page — zero-JS checkout

`sections/main-cart.liquid` is the load-bearing floor of the whole store. It must function with `<script>` stripped entirely.

```liquid
<form action="{{ routes.cart_url }}" method="post" id="cart" novalidate>
  {%- for item in cart.items -%}
    <label class="visually-hidden" for="updates_{{ item.key }}">Quantity for {{ item.product.title }}</label>
    <input id="updates_{{ item.key }}"
           name="updates[{{ item.key }}]"
           type="number" inputmode="numeric" min="0" step="1"
           value="{{ item.quantity }}">
    <a href="{{ item.url_to_remove }}" class="cart__remove">Remove</a>
  {%- endfor -%}

  <button type="submit" name="update" class="btn btn--ghost">Update box</button>
  <button type="submit" name="checkout" class="btn btn--pop">Checkout</button>
</form>
```

Non-negotiable details:

1. **`updates[{{ item.key }}]`, keyed by line-item key — never `updates[]` positional arrays.** Positional arrays silently update the wrong line when a line is removed between page render and submit (F9).
2. **Remove uses `item.url_to_remove`** (a plain `GET` link to `/cart/change?line=N&quantity=0`). It works without JS and without a nested form.
3. **No nested `<form>`.** The cart page must not render a product add-to-cart form inside `#cart`. Browsers silently drop the inner form and the outer form's submit buttons can end up orphaned (F5). Cross-sell blocks on `/cart` link to the product page; they do not embed add-to-cart forms.
4. **Both buttons are `type="submit"`**, written explicitly so a later refactor cannot break it.
5. **Empty state** renders the verbatim copy `Your box is empty. Kashmir's waiting.` with a `Keep shopping` link to `/collections/all`, and **the entire `<form>` including the Checkout button is omitted from the DOM** — not merely hidden or disabled. Submitting an empty cart with `name=checkout` bounces the user back to `/cart` with no explanation.
6. **Checkout redundancy:** in the default build the submit button is unconditional for non-empty carts, so no fallback link is required. If any future conditional ever wraps that button, an `<a href="/checkout">Checkout</a>` beneath it becomes mandatory.
7. Dynamic checkout buttons (`{{ form | payment_button }}`) are **optional and additive only**. They may never be the sole checkout path, because they render nothing when the buyer's browser has no supported wallet.

Money is rendered with `| money`, and the store's money format must be configured to `Rs. {{amount}}` so the site reads `Rs. 600.00` exactly as the source copy specifies.

### 4.5 AJAX drawer behaviour

`sections/cart-drawer.liquid` renders a `<cart-drawer>` custom element containing its **own** `<form action="{{ routes.cart_url }}" method="post" id="cart-drawer-form">`. This is a second, independent, complete no-JS cart — so even a user who somehow reaches the drawer with JS half-dead can still check out.

**Endpoints (all first-party, same-origin):**

| Action | Request |
|---|---|
| Add | `POST /cart/add.js` with `sections=cart-drawer,header` |
| Change qty / remove | `POST /cart/change.js` `{ id: <line key>, quantity: n, sections: 'cart-drawer,header' }` |
| Read / resync | `GET /cart.js` |

Always request `sections=cart-drawer,header` so the server returns freshly rendered HTML for both the drawer and the header bubble in the *same* response. Never hand-patch subtotal or count in JS — recompute from server HTML. This eliminates the entire class of "displayed subtotal disagrees with checkout total" bugs.

**Behaviour spec:**

| Trigger | Result |
|---|---|
| Click Box icon | Drawer opens; no network request (drawer HTML is already server-rendered on page load) |
| Successful add-to-cart (any product form, incl. Build Your Own) | Drawer opens with the new line visible and briefly highlighted; focus moves to the drawer heading |
| Qty stepper `+` / `−` / typed value + blur | `POST /cart/change.js`; row shows an inline spinner; drawer + bubble re-render from returned sections |
| Qty set to 0 or "Remove" clicked | Line removed; if the cart becomes empty, the drawer swaps to the empty state |
| Any mutation | Subtotal, item count, and header bubble update from server HTML within the same paint |

**Re-render must not kill event listeners.** The drawer's inner HTML is replaced wholesale on every mutation. All handlers are therefore **delegated from `document`** (or from the persistent `<cart-drawer>` host element), never bound to nodes inside the replaced subtree. This is failure mode F8 and it is the most common way an AJAX drawer becomes a dead end after the user's first interaction.

**Request discipline:** one in-flight mutation at a time. Rapid `+` clicks are debounced at 300 ms and the last value wins; a stepper is `disabled` only while its own request is in flight and is re-enabled in a `finally` block (F11).

### 4.6 The drawer's Checkout control

```liquid
<button type="submit" name="checkout" form="cart-drawer-form" class="btn btn--pop">
  Checkout
</button>
```

- It is a real submit button for a real form that posts to `/cart`. Clicking it performs a full-page navigation to Shopify checkout. **`cart.js` must not attach any listener to it, must not call `preventDefault()` on the drawer form's `submit` event, and must not disable it except while a mutation request is genuinely in flight.**
- If surrounding markup makes a wrapping form impossible, use the `form` attribute (as above) rather than moving the button — but the form element must still exist in the DOM.
- Below it: `Keep shopping` — a `<button type="button" data-cart-drawer-close>`.

### 4.7 Add-to-cart and error handling

Every product form is a native form first:

```liquid
<form action="{{ routes.cart_add_url }}" method="post" enctype="multipart/form-data" data-cart-add>
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
  <input type="hidden" name="quantity" value="1">
  <button type="submit" {% unless product.available %}disabled{% endunless %}>
    {% if product.available %}Add to box{% else %}Sold out{% endif %}
  </button>
</form>
```

With JS off, this posts and lands on `/cart`. With JS on, `cart.js` intercepts, POSTs to `/cart/add.js` (§2.2), and opens the drawer.

**Build Your Own** uses the same native pattern so it degrades gracefully: three `<input type="number" name="properties[Green Apple]">` etc. (defaults 4/4/4 = 12), plus the hidden `build-your-own` variant id and `quantity=1`. JS layers on the counter (`0 / 12`), the `All 3, evenly` / `Surprise me` buttons, the derived `Mix` / `_mix` / `_total_cans` properties, and the client-side "must total exactly 12" gate. Without JS the form still submits a valid, correctly-priced Rs 660 box.

**Error paths:**

| Condition | Behaviour |
|---|---|
| `/cart/add.js` returns **422** (sold out / insufficient inventory) | Do **not** open the drawer. Render the API's `description` string inline beneath the button in an `aria-live="assertive"` region, in ink on sand-2. Re-enable the button. |
| Network failure / non-JSON response / fetch throws | Fall back hard: `form.submit()` — let the browser perform the native POST. The user reaches `/cart` rather than nothing. |
| Any uncaught exception inside `cart.js` | Wrapped in `try/catch`; on catch, set `drawer.isReady = false` so the Box link reverts to plain navigation for the rest of the session |
| Variant unavailable at render time | Button rendered `disabled` with text `Sold out`; no JS required |
| A flavour is unavailable | The builder disables or excludes that flavour row rather than erroring |
| Cart mutation (`/cart/change.js`) fails | Revert the optimistic UI, re-fetch `GET /cart.js`, show `Couldn't update your box. Try again.` in the drawer's live region |
| `build-your-own` product missing or unavailable | The section renders a merchant-visible notice in the theme editor and hides the CTA on the storefront — never a button that silently fails |

Rule: **failure always degrades toward a working page load, never toward an inert click.**

### 4.8 Accessibility

- `<cart-drawer>` renders `role="dialog"` `aria-modal="true"` `aria-labelledby="cart-drawer-title"`, with `<h2 id="cart-drawer-title">Your box</h2>`.
- Closed state uses the `hidden` attribute (plus `inert` where supported) so its contents are removed from the tab order and the a11y tree — not merely `opacity: 0`.
- **Focus trap:** on open, focus moves to the drawer heading (`tabindex="-1"`); Tab and Shift+Tab cycle within the drawer only. On close, focus returns to the element that opened it (`toggle`), which is why `open()` receives the trigger.
- **Esc** closes the drawer. Clicking the scrim closes it. The close control is `<button type="button" aria-label="Close">✕</button>`.
- `document.body` gets `overflow: hidden` while open; restored on close, and restored in a `finally` so a mid-close exception cannot leave the page unscrollable.
- Subtotal and item count live in `aria-live="polite"`; add/update errors in `aria-live="assertive"`.
- Qty inputs have real associated `<label>`s (visually hidden). Steppers are `type="button"` with `aria-label="Increase quantity for Green Apple 12 PACK"`.
- All interactive targets ≥ 44 × 44 px; visible focus ring at ≥ 3:1 contrast against sand `#FCEFDC`.
- Respect `prefers-reduced-motion`: the drawer slide becomes an instant show/hide.

### 4.9 Failure modes and guards

These are the specific ways the previous theme dead-ended, plus the adjacent traps. Each row is a code-review checklist item.

| ID | Failure mode | Guard |
|---|---|---|
| **F1** | **Box icon has no `href`** — rendered as `<button>`/`<div>` with a JS-only click handler. *(This was the original bug.)* | I1: Liquid renders `<a href="{{ routes.cart_url }}">`. Automated grep in the QA script. |
| **F2** | **No `/cart` template** — `/cart` 404s or renders a blank section. | `templates/cart.json` committed at repo root; QA asserts HTTP 200 and presence of `name="checkout"`. |
| **F3** | **A JS error elsewhere prevents cart JS from running**, leaving the anchor's `preventDefault` already attached by a partially-executed handler. | `cart.js` is a standalone `defer` script; the handler bails out *before* `preventDefault()` unless the drawer reports `isReady`. |
| **F4** | **Checkout control is not a submit** — `<button type="button">` or `<a href="#">` with an `onclick`. | I3. Every `Checkout` string must be inside a `<form>` or an `<a href="/checkout">`. |
| **F5** | **Nested forms** — product form inside the cart form; the browser drops the inner one and buttons orphan. | No add-to-cart form inside `#cart` or `#cart-drawer-form`. Validate with the W3C HTML checker in CI. |
| **F6** | **Checkout button lives outside its form and has no `form` attribute.** | Drawer button carries `form="cart-drawer-form"`; the referenced id is asserted present in QA. |
| **F7** | **Drawer rendered but unopenable** — `display:none` with no toggle wired, or a scrim with `pointer-events` swallowing clicks. | Drawer's closed state is the `hidden` attribute only; scrim is `pointer-events: none` when closed. |
| **F8** | **Section re-render destroys event listeners**, so the drawer works once and is dead afterwards. | 100% event delegation from `document` / the persistent host element. No `addEventListener` on any node inside re-rendered HTML. |
| **F9** | **`updates[]` positional array updates the wrong line** after a removal. | `updates[{{ item.key }}]`, keyed. |
| **F10** | **Checkout disabled on empty cart with no explanation**, or submit on empty cart silently bounces. | Non-empty carts only render the form; the empty state renders the verbatim copy + `Keep shopping`. |
| **F11** | **Button `disabled` during a request and never re-enabled** on error. | Re-enable in `finally`. No code path leaves a control disabled. |
| **F12** | **Blocked/failed asset** — adblocker, CSP, or CDN hiccup kills `cart.js`. | Nothing required for checkout depends on `cart.js`. Verified with request blocking in QA. |
| **F13** | **Duplicate DOM ids** when the drawer and the cart page both render on `/cart`, so `getElementById` grabs the wrong node. | Drawer ids namespaced `cart-drawer-*`; page ids `cart-*`. The drawer still renders on `/cart` but its toggle is inert there. |
| **F14** | **Theme intercepts the checkout submit** for a terms/age gate or analytics and never re-dispatches. | No `submit` listener on either cart form. Analytics uses `beforeunload`/`pointerdown`, never `preventDefault`. |
| **F15** | **Stale cart** — buyer has two tabs open; the drawer shows lines that no longer exist. | Every mutation re-renders from server sections; a 404/422 on change triggers a full `GET /cart.js` resync. |
| **F16** | **Add succeeds but nothing visibly happens**, so the buyer assumes it failed and never proceeds. | Drawer opens on every successful add; header bubble increments; new line briefly highlighted. |
| **F17** | **Cross-domain iframe / preview link** strips the cart cookie so the cart is always empty. | Never embed the storefront in an iframe on another origin. QA runs on `blackpeak.quest` or a same-origin theme preview. |
| **F18** | **Money format mismatch** — drawer shows `600` while checkout shows `Rs. 600.00`, eroding trust. | Store money format set to `Rs. {{amount}}`; all prices rendered through `| money`. |

**Verification of this section** is §6.4 (acceptance criteria) and §6.5 (the manual checkout QA script). No build ships without both green.

---

## 5. Technical Architecture & Deployment

### 5.1 Platform and constraints

| Decision | Choice | Rationale |
|---|---|---|
| Platform | Shopify Online Store 2.0 theme (Liquid) | Native cart/checkout; no headless surface to break |
| Base theme | Built from scratch (not a Dawn fork) | Existing copy and layout are bespoke; a fork carries dead sections that reintroduce gift-box/pricing content |
| Build step | **None** | Plain `.css` / `.js` in `assets/`, referenced by `asset_url`. No npm, bundler, transpiler, or lockfile in the repo |
| JS framework | **None** | Vanilla ES2019+, custom elements only where a component needs lifecycle |
| Deployment | Shopify ↔ GitHub integration | Theme files at repo root; Shopify pulls the branch |
| Currency | INR, `Rs. {{ amount }}` money format | Matches live store; all prices rendered via Liquid money filters, never hardcoded |
| Validation gate | Shopify Theme Check (CI + pre-push) | Zero errors required to merge |

**Non-goals:** no Shopify app, no custom checkout (Plus-only), no third-party cart/upsell app, no jQuery, no CSS framework, no icon font.

### 5.2 Repository layout

Theme files sit at the **repository root** — a hard requirement of Shopify's GitHub integration, which expects `layout/theme.liquid` at the top level of the connected branch. A `src/` or `theme/` subdirectory causes "Add theme → Connect from GitHub" to reject the repo.

```
/                                  ← GitHub repo root == theme root
├── assets/
│   ├── base.css                   # entire design system + all component CSS
│   ├── cart.js                    # cart, drawer, builder — isolated on purpose (F3)
│   ├── global.js                  # announcement rotator, accordion, everything non-cart
│   └── *.svg | *.webp | *.woff2   # logo, can art, social icons, brand faces
├── config/
│   ├── settings_schema.json       # theme settings (see 5.5)
│   └── settings_data.json         # committed defaults for the published theme
├── layout/
│   ├── theme.liquid               # <head>, header/footer section groups, cart drawer, scripts
│   └── password.liquid
├── locales/
│   ├── en.default.json            # storefront strings
│   └── en.default.schema.json     # editor-facing labels for settings/sections
├── sections/
│   ├── header.liquid  footer.liquid  announcement-bar.liquid
│   ├── hero.liquid  lineup.liquid  build-your-own.liquid
│   ├── why-blackpeak.liquid  our-story.liquid  social-proof.liquid
│   ├── newsletter.liquid  faq.liquid
│   ├── main-product.liquid  main-cart.liquid  cart-drawer.liquid  main-page.liquid
│   ├── product-trust-ticks.liquid  product-feature-strip.liquid  product-cross-sell.liquid
│   └── header-group.json  footer-group.json      # section groups
├── snippets/
│   ├── cart-item.liquid  cart-icon-bubble.liquid  builder-row.liquid
│   └── product-card.liquid  price.liquid  icon.liquid  meta-tags.liquid
├── templates/                     # the full map is §3.2
├── .github/workflows/theme-check.yml
├── .theme-check.yml
├── .gitignore                     # node_modules, .DS_Store, *.zip — never ignore theme dirs
└── docs/                          # PRD + CONTENT-SOURCE.md (ignored by Shopify, harmless)
```

Shopify ignores any top-level directory it does not recognise, so `docs/` and `.github/` are safe on the same branch. `docs/` must contain no `.liquid` files.

**AC 5.2.1** `layout/theme.liquid` resolves at the repo root on the connected branch.
**AC 5.2.2** No build artefacts, `node_modules`, or minified bundles are committed; every file in `assets/` is human-readable source.
**AC 5.2.3** The §2.5 Step 4 forbidden-string gate returns zero hits outside `docs/`.

### 5.3 JSON templates, section groups and authoring rules

Every template is JSON (OS 2.0) so the merchant can reorder or hide sections from the theme editor without a code change; the full route/template map is §3.2. Liquid templates are used only where JSON is not supported (`password.liquid`, `gift_card.liquid`, `robots.txt.liquid` if needed).

**Section groups.** `sections/header-group.json` holds `announcement-bar` + `header`; `sections/footer-group.json` holds `footer`. `layout/theme.liquid` renders them with `{% sections 'header-group' %}` / `{% sections 'footer-group' %}`, so the announcement bar and nav are editable on every template rather than hardcoded in the layout. The cart drawer is rendered separately, immediately before `</body>` (§4.2).

**Rules for section authoring**

- Every section declares a `{% schema %}` with `presets` so it can be added from the editor.
- Repeating content (lineup cards, why-us tiles, story cards, reviews, FAQ Q&As, announcement messages) is modelled as **blocks**, with the verbatim source copy shipped as `default` values in the schema — the site renders correctly on a fresh install with zero manual editor setup.
- Section files stay presentation-only; all cart/builder behaviour lives in `cart.js` and talks to the Cart AJAX API.
- No section renders a price literal; prices come from `{{ product.price | money }}` or `{{ cart.total_price | money }}`.

**AC 5.3.1** Installing the theme on a clean development store and publishing it, with no editor configuration, produces the full homepage with all copy from the content source.
**AC 5.3.2** Each homepage section can be reordered and hidden from the editor without breaking the cart or the builder.

### 5.4 CSS and JS approach

**`assets/base.css` — one stylesheet, token-first.** A single request, loaded in `<head>` via `{{ 'base.css' | asset_url | stylesheet_tag }}`. Structure, in order:

1. `:root` design tokens (§5.5)
2. Reset + base element styles
3. Layout primitives (`.wrap`, `.grid`, `.stack`, `.section`)
4. Components, one block per section, each namespaced by a single class (`.hero`, `.lineup`, `.builder`, `.cart-drawer`, …)
5. Utilities and `@media` breakpoints (mobile-first: 640 / 900 / 1200)

No preprocessor, no CSS-in-JS, no Tailwind. Custom properties do the theming work: a flavour is applied by setting `--flavour` / `--flavour-deep` on a wrapper element, so one component rule serves all three flavours.

**Two scripts, both deferred.** `cart.js` (everything in the purchase path) and `global.js` (everything else). They are deliberately separate so a failure in one cannot take down the other (F3). Custom elements provide encapsulation:

| Custom element | File | Responsibility |
|---|---|---|
| `<cart-drawer>` | `cart.js` | Open/close, focus trap, ESC, re-render from the Section Rendering API |
| `<cart-item>` | `cart.js` | Quantity change and remove via `/cart/change.js` |
| `<product-form>` | `cart.js` | `POST /cart/add.js`, error surfacing, drawer open on success |
| `<box-builder>` | `cart.js` | 0/12 counter, "All 3, evenly", "Surprise me", single `/cart/add.js` with the BYO variant + line-item properties |
| `<announcement-rotator>` | `global.js` | Rotates the four announcement strings; pauses on `prefers-reduced-motion` |
| `<faq-accordion>` | `global.js` | `<details>`-based, progressive-enhancement only |

Cart state changes always go through the Cart AJAX API and always re-render both the drawer and the header cart bubble from the same response, so the header count can never drift from cart truth. Progressive enhancement for the whole purchase path is mandatory and specified in §4.1.

**AC 5.4.1** At most three theme-authored asset requests on any page: `base.css`, `global.js`, `cart.js`. No external CSS/JS CDN, no webfont beyond the two self-hosted brand faces.
**AC 5.4.2** With JS blocked in DevTools, a user can add a 12-pack and reach checkout in three clicks (§6.5 Part A).
**AC 5.4.3** Neither script throws a console error on any template; a failed `fetch` falls back to a full page navigation to `/cart`.

### 5.5 Design tokens

Declared once at the top of `base.css` as CSS custom properties. Values are lifted verbatim from the live theme so the rebuild is visually indistinguishable from the current site.

```css
:root{
  /* Ink & surfaces */
  --ink:#3A2418;        --ink-2:#4C3022;
  --sand:#FCEFDC;       --sand-2:#F7E5CB;
  --paper:#FFFBF4;

  /* Brand pop (named "saffron" in source; renders grape) */
  --pop:#7B4FBE;        --pop-deep:#5B3597;

  /* Flavours */
  --apple:#8FC93B;      --apple-deep:#3C6B16;
  --mojito:#27C6B6;     --mojito-deep:#0C6F64;
  --melon:#FF5C84;      --melon-deep:#C72F58;

  /* Per-context flavour slots, overridden on wrappers */
  --flavour:var(--pop); --flavour-deep:var(--pop-deep);

  /* Type */
  --font-display:"Anton", Impact, "Arial Narrow Bold", sans-serif;
  --font-body:"Plus Jakarta Sans", ui-sans-serif, system-ui, "Segoe UI", sans-serif;
}
```

| Token group | Tokens | Use |
|---|---|---|
| Ink | `--ink` `#3A2418`, `--ink-2` `#4C3022` | Body text, headings, footer ground |
| Surfaces | `--sand` `#FCEFDC`, `--sand-2` `#F7E5CB`, `--paper` `#FFFBF4` | Page ground, alternating section bands, cards |
| Pop | `--pop` `#7B4FBE`, `--pop-deep` `#5B3597` | Primary CTAs, announcement bar, focus ring |
| Green Apple | `--apple` `#8FC93B`, `--apple-deep` `#3C6B16` | `.flavour--apple` wrapper |
| Mojito | `--mojito` `#27C6B6`, `--mojito-deep` `#0C6F64` | `.flavour--mojito` wrapper |
| Watermelon | `--melon` `#FF5C84`, `--melon-deep` `#C72F58` | `.flavour--melon` wrapper |
| Type | Anton (display), Plus Jakarta Sans (body) | Headings vs. everything else |

Fonts are self-hosted `.woff2` in `assets/` and declared with `@font-face { font-display: swap }` — not loaded from Google Fonts, so there is no third-party render-blocking request and no consent surface. Every colour pairing used for text must meet WCAG AA (4.5:1); `--apple` and `--mojito` are decorative/background only and never carry small text on `--paper`.

**`config/settings_schema.json`** is deliberately thin — the design is fixed, not merchant-tunable:

| Group | Settings |
|---|---|
| Brand | Logo image, logo width, favicon |
| Colours | Pop, pop-deep, sand, paper (each maps to a CSS variable emitted in `theme.liquid`); flavour colours are code-level, not settings |
| Typography | Heading font picker, body font picker (defaults Anton / Plus Jakarta Sans) |
| Cart | Cart type (drawer / page) — **defaults to drawer**; "show cart count bubble" |
| Social | Instagram URL, Facebook URL |
| Compliance | Footer disclaimer richtext (pre-filled verbatim), "Product of India" line |

**`locales/en.default.json`** carries all UI strings — `cart.empty` ("Your box is empty. Kashmir's waiting."), `cart.checkout` ("Checkout"), `cart.continue` ("Keep shopping"), `products.add_to_box` ("Add to box"), builder counter and note strings. Section-body copy the merchant should be able to edit lives in schema defaults instead. `en.default.schema.json` holds editor labels only. English is the sole locale; no translation files are shipped.

**AC 5.5.1** No hex literal appears outside the `:root` block in `base.css`.
**AC 5.5.2** Changing `--pop` in one place restyles every primary CTA, the announcement bar, and focus rings.
**AC 5.5.3** No string rendered to the storefront is hardcoded in a snippet where a locale key or schema setting exists for it.

### 5.6 Deployment: Shopify ↔ GitHub

**One-time connection**

1. Push the theme to GitHub with theme files at the repository **root** (§5.2).
2. Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub**.
3. Authorise the Shopify GitHub app, pick the repo, pick branch **`main`**.
4. Shopify imports the branch as an unpublished theme named after the branch. Preview it, run §6.5 in full, then **Publish**.

Once connected, Shopify tracks the branch: every push to `main` is pulled into the connected theme automatically, usually within seconds. There is no manual upload, no ZIP, and no `theme push` in the normal flow.

**Branch strategy**

| Branch | Connected Shopify theme | Purpose |
|---|---|---|
| `main` | **Live theme** (published) | Production. Protected: no direct pushes, PR + green Theme Check required |
| `staging` | Unpublished theme "staging" | Client review / UAT. Connected as a second theme from the same repo |
| `feat/*` | none | Local development via Shopify CLI (`shopify theme dev`) |

Both `main` and `staging` are connected as separate themes from the same repo, so the client always has a shareable preview URL that is not the live site.

**Update flow**

```
feat/xyz  ──PR──►  staging  ──PR──►  main
   │                  │                │
shopify theme dev   Shopify pulls   Shopify pulls
(local hot reload)  → staging theme → LIVE theme
                    → client preview
```

1. Branch from `main`, develop against a development store with `shopify theme dev`.
2. Open a PR into `staging`. CI runs Theme Check; merge only on green.
3. Shopify pulls `staging` into the staging theme; client reviews on the preview URL.
4. Open a PR `staging` → `main`. Merge. Shopify pulls into the live theme within seconds.
5. **Rollback** = `git revert` on `main` and push; Shopify pulls the reverted state. The duplicated pre-rebuild theme (§6.8 AC-GH-5) and Shopify's own theme version history are the secondary rollback paths.

**Two-way sync warning (must be documented in the README).** Edits made in the Shopify **theme editor** or **code editor** on a GitHub-connected theme are committed back to the connected branch by Shopify. Therefore:

- Do not edit code in the Shopify admin for the `main`-connected theme; make the change in the repo.
- Merchant edits are expected only through the theme editor (settings/blocks), which write to `config/settings_data.json` and `templates/*.json`. Always `git pull` before starting local work.
- `config/settings_data.json` and `templates/*.json` are **committed**, never gitignored — they carry the published configuration.

**Environment / secrets.** None. The theme holds no API keys. The newsletter posts to Shopify's native customer form; the contact page posts to Shopify's native contact form. No third-party endpoint is called from the storefront.

**AC 5.6.1** A push to `main` is reflected on `blackpeak.quest` with no manual step in the Shopify admin.
**AC 5.6.2** `staging` is connected as a separate, unpublished theme; its preview URL is shared with the client and never auto-publishes.
**AC 5.6.3** README documents the two-way sync warning and the "pull before you work" rule.
**AC 5.6.4** A `git revert` + push restores the previous live theme within one pull cycle, verified once before launch.

### 5.7 Validation gate: Theme Check and CI

Theme Check is the merge gate. It runs locally (`shopify theme check`) and in CI on every PR to `staging` and `main`.

`.theme-check.yml`:

```yaml
extends: theme-check:recommended
require_settings_schema_valid_json: { enabled: true }
MissingTemplate: { enabled: true }
UndefinedObject: { enabled: true }
DeprecatedFilter: { enabled: true }
UnusedAssign: { enabled: true }
ParserBlockingScript: { enabled: true }
ImgLazyLoading: { enabled: true }
RemoteAsset: { enabled: true }        # blocks third-party CDN assets
ValidHTMLTranslation: { enabled: true }
```

`.github/workflows/theme-check.yml` runs `Shopify/theme-check-action` on `pull_request` and on `push` to `main`, and runs the §2.5 Step 4 forbidden-string gate in the same job.

**Merge criteria — all must hold**

| Gate | Threshold |
|---|---|
| Theme Check errors | 0 |
| Theme Check warnings | 0 new vs. `main` |
| Forbidden-string gate (§2.5 Step 4) | 0 hits outside `docs/` |
| Lighthouse (mobile, homepage + product) | Performance ≥ 80, Accessibility ≥ 95 |
| Checkout QA script (§6.5) | Passes on the branch's preview theme |

**AC 5.7.1** CI fails the PR on any Theme Check error.
**AC 5.7.2** The forbidden-string gate runs in the same workflow and fails the PR on a hit.
**AC 5.7.3** No PR reaches `main` without a recorded pass of the §6.5 checkout QA script on the staging preview URL.

---

## 6. QA, Acceptance Criteria & Risks

### 6.1 Test environments and tooling

| Environment | Purpose | How it is reached |
|---|---|---|
| Local dev | Fast iteration, Liquid errors | `shopify theme dev --store blackpeak.myshopify.com` |
| Preview theme | Full QA against live catalogue and real checkout | `shopify theme push --unpublished --json` → preview URL, or the `staging` GitHub-connected theme |
| GitHub branch `main` | Source of truth; synced to the unpublished "BlackPeak (GitHub: main)" theme | Shopify admin → Online Store → Themes → Add from GitHub |
| Production | Published theme on `blackpeak.quest` | Publish only after §6.10 sign-off |

Required tooling: Shopify CLI ≥ 3.x, `shopify theme check`, Lighthouse (Chrome DevTools, mobile preset, Slow 4G + 4× CPU throttle), axe DevTools, BrowserStack or physical devices for the responsive matrix.

All checkout testing must happen on a **preview theme of the live store** (not a development store) using Shopify's Bogus Gateway or a real Rs 1 test order, because the failure being fixed (§4) only reproduces against the real cart and checkout routes.

### 6.2 Catalogue correctness

**AC-CAT-1 — Only four purchasable products exist**

- **Given** a QA engineer browses the storefront
- **When** they visit `/`, `/collections/all`, `/products/green-apple`, `/products/mojito`, `/products/watermelon`, `/products/build-your-own`, `/pages/about-us`, `/pages/contact`, and the cart
- **Then** the only purchasable items offered are: Green Apple 12 PACK Rs 600, Mojito 12 Pack Rs 600, Watermelon 12 PACK Rs 600, Build Your Own 12-Can Box Rs 660 — and no other product, variant, or bundle is linkable or add-to-cartable.
- **And** `sitemap.xml` contains exactly four product URLs.

**AC-CAT-2 — Forbidden-string gate passes.** Run the four commands in §2.5 Step 4 from the repository root; every one must return zero matching lines, with the known-safe list respected.

**AC-CAT-3 — Zero occurrences outside theme code.** The greps do not see Shopify Admin data. Manually verify and record in the sign-off sheet:

- [ ] No product, draft or active, titled/handled as a gift box or 6-can box (Admin → Products, search `gift`, `499`, `6`)
- [ ] No collection contains a removed product
- [ ] Navigation menus (Main menu, Footer menu) contain no gift-box entry
- [ ] Pages (`/pages/about-us`, `/pages/contact`, policy pages) contain no removed-catalogue price
- [ ] `config/settings_data.json` — no section block, image, or rich-text field references the gift box
- [ ] Search results for `gift` (`/search?q=gift`) return no product
- [ ] Old URLs (`/products/gift-box`, any legacy handle) return 404 or a 301 to `/products/build-your-own`; a soft 200 on a removed product is a fail

**AC-CAT-4 — Prices are exact.** Displayed prices are `Rs. 600.00` and `Rs. 660.00`, rendered through the `money` filter with the store's INR format. No price is hardcoded in Liquid or JS anywhere; grep for `600`/`660` in `*.liquid` returns only comments, `settings_schema.json` defaults, or nothing at all. Every `money` output renders as `Rs. NNN.00` and every price string in prose reads `Rs 600` / `Rs 660`.

### 6.3 Copy fidelity vs `docs/CONTENT-SOURCE.md`

**AC-COPY-1 — Verbatim reproduction.** Every string in `docs/CONTENT-SOURCE.md` §ANNOUNCEMENT BAR through §CART DRAWER appears in the rendered storefront character-for-character, including punctuation (em dashes `—`, curly apostrophes in `Kashmir's`, `founders` in the footer line, `Im` in the Seerat review), capitalisation (`Mojito 12 Pack` vs `Green Apple 12 PACK`), and emoji (`🏔️`).

**Verification method (scripted, not eyeballed):**

1. `shopify theme dev`, then fetch each page and extract visible text to `/tmp/rendered-<page>.txt`.
2. For each string in the content source, assert it is a substring of the corresponding rendered file. `scripts/copy-check.mjs`, maintained alongside the theme, encodes these assertions and exits non-zero on any miss.
3. Record pass/fail per section in the sign-off sheet.

**AC-COPY-2 — Sanctioned deviations only.** The only permitted differences from the scraped site are these six overrides (implemented in §2.5 Step 2), plus the currency-notation rule in §3 (all prices written `Rs`):

| # | Location | Required change |
|---|---|---|
| 1 | Announcement bar item 3 | `Rs 599` → `Rs 600` |
| 2 | Hero CTAs | third CTA `Shop the Rs 499 Gift Box →` deleted; only `Build your pack` and `Meet the flavours` remain |
| 3 | Why BlackPeak, card 4 | `The Rs 499 6-can box ships…` → `The 12-can box ships across India as a taste of Kashmir.` |
| 4 | Newsletter bullet 2 | price removed; reads `Eid, Diwali, birthdays — we'll nudge you in time to send a box.` |
| 5 | FAQ Q6 | replaced with the two-ways-to-buy answer at Rs 600 / Rs 660 |
| 6 | Product page cross-sell | gift-box cross-sell deleted; only `Missing a flavour? Build a box — Mix all three into a 12-can box.` remains |

New copy introduced by this build (§3.10 zero-results, §3.11 404 body) is flagged for client sign-off and is not covered by the verbatim rule. Any **other** textual difference is a defect, including "improvements", grammar fixes, and Title Case normalisation.

**AC-COPY-3 — Copy is editable.** Every string above is exposed as a section/block setting in the theme editor with the source text as its `default`, so the merchant can edit without a code change. Deleting a section from `templates/index.json` must not delete the default text from `sections/*.liquid`.

### 6.4 Cart and checkout acceptance criteria — the critical path

This is the regression suite for the defect in §4. Every case is **blocking**; a single failure blocks publish.

**AC-CART-1 — Box icon is a real link (regression BLACKPEAK-CART-001).** On any template, the Box control is an `<a>` whose `href` is `{{ routes.cart_url }}`, it is keyboard-focusable, `document.querySelectorAll('a[href="/cart"]').length >= 1` on every page, and middle-click / cmd-click opens `/cart` in a new tab. A cart icon that is not inside an `<a href>` or a `<form>` anywhere in the built theme is a fail.

**AC-CART-2 — Checkout works with JavaScript disabled.** With JS fully disabled, opening `/products/green-apple`, submitting the product form, landing on `/cart`, and clicking **Checkout** reaches Shopify's hosted checkout with the correct line item and total. No `<div onclick>` anywhere in the purchase path.

**AC-CART-3 — Checkout works with JavaScript enabled (drawer path).** Add to box from a PDP → drawer opens with correct item, quantity and subtotal → **Checkout** → Shopify checkout, total matches.

**AC-CART-4 — Three redundant routes to checkout.** All of the following independently reach Shopify checkout: (a) cart drawer Checkout button, (b) `/cart` page Checkout button, (c) direct navigation to `/checkout` with a non-empty cart. No route may depend on another.

**AC-CART-5 — Cart count badge.** The badge reflects `cart.item_count` on server render (correct on hard reload and on back-button/bfcache restore) and updates after every AJAX add/remove without a full reload.

**AC-CART-6 — Empty state.** With an empty cart, the drawer and `/cart` show `Your box is empty. Kashmir's waiting.`, the Checkout control is **absent from the DOM** (not merely hidden or disabled), and `Keep shopping` links to `/collections/all`.

**AC-CART-7 — Quantity and removal.** Increment, decrement, set-to-0 and Remove all update line totals and subtotal correctly on `/cart` and in the drawer, and survive a page reload.

**AC-CART-8 — Build Your Own reaches checkout with its mix intact.** From the builder at 12/12 with a non-uniform mix (e.g. 5 Green Apple / 4 Mojito / 3 Watermelon), clicking **Build my box** and proceeding to checkout produces a cart line showing the mix at `Rs. 660.00`, and the same mix is visible on the Shopify checkout page and on the resulting order in Admin (Order → line-item properties). At least one customer-visible property carrying the mix survives to the order (§2.2).

**AC-CART-9 — Builder validation.** `Build my box` is disabled below 12 and cannot exceed 12; `All 3, evenly` yields 4/4/4; `Surprise me` yields a random mix summing to exactly 12 with each flavour ≥ 2; the counter reads `0 / 12` at rest with the helper `Pick 12 cans — mix all three.`

**AC-CART-10 — Cart persistence.** Add to cart, close the tab, reopen `blackpeak.quest` → cart still populated. Two builder boxes with *different* mixes stay as two distinct lines; two with the *same* mix merge to quantity 2.

**AC-CART-11 — Error handling.** With the network throttled or `/cart/add.js` returning an error, the UI shows a visible error and never leaves a button in a permanent loading state. If the AJAX layer throws, the form still submits natively.

**AC-CART-12 — Sold out / unavailable.** A product set unavailable in Admin renders a disabled `Add to box` with no JS error; the builder excludes or disables that flavour rather than erroring.

**AC-CART-13 — End-to-end order.** A complete test order for each of the four products is placed on the preview theme (Bogus Gateway or Rs 1 live-then-refunded), reaches Thank You, and appears in Admin with correct product, price, quantity, and (for BYO) mix properties. A screenshot of each order is attached to the sign-off sheet.

### 6.5 Manual checkout QA script

Run this in full against the deployed preview theme before any release. It takes about ten minutes. **A failure at any step is a release blocker.** Use a fresh incognito window per part so the cart cookie starts clean.

**Part A — the no-JS floor (do this first; it is the part that failed last time)**

1. Chrome → DevTools → ⋮ → Settings → Debugger → check **Disable JavaScript**. Keep DevTools open so it stays off.
2. Load the storefront. Confirm the page renders and the header shows **Box**.
3. Click **Box**. **Expected:** full page navigation to `/cart` (HTTP 200), showing either line items or `Your box is empty. Kashmir's waiting.` — *not* a 404, not a dead click.
4. Navigate to `/products/green-apple`. Click **Add to box**. **Expected:** page reloads at `/cart` with one line: Green Apple 12 PACK, qty 1, `Rs. 600.00`.
5. Change the qty field to `3`, click **Update box**. **Expected:** page reloads, qty 3, subtotal `Rs. 1,800.00`.
6. Click **Remove** on that line. **Expected:** empty-state copy appears and no Checkout button is present anywhere on the page (View Source → search `name="checkout"` → zero hits).
7. Add Green Apple again, then go to `/products/build-your-own`, leave the default 4/4/4, click **Add to box**. **Expected:** `/cart` shows two lines, the BYO line at `Rs. 660.00` with the flavour breakdown visible as line-item properties. Subtotal `Rs. 1,260.00`.
8. Click **Checkout**. **Expected:** Shopify's checkout with both lines and the identical subtotal. **Do not complete the order.** Note the total, then close the tab.
9. Re-enable JavaScript in DevTools.

**Part B — the JS drawer**

10. Fresh incognito window. Load the storefront. Confirm zero console errors.
11. Click **Box**. **Expected:** drawer slides in, heading reads **Your box**, empty state reads `Your box is empty. Kashmir's waiting.`
12. Press **Esc**. **Expected:** drawer closes and keyboard focus returns to the Box control.
13. From the homepage lineup, add **Mojito 12 Pack**. **Expected:** drawer opens automatically, shows the Mojito line, subtotal `Rs. 600.00`, header bubble reads `1`. No page reload.
14. Click **+** on that line. **Expected:** qty 2, subtotal `Rs. 1,200.00`, bubble `2`, no page reload. Then click **+** three times rapidly — the final qty must be exactly 5, with no dropped or duplicated updates.
15. Type `0` into the qty field and blur (or click **Remove**). **Expected:** the line disappears and the empty state returns *in place*, without a reload.
16. **The re-render regression check (F8):** add Watermelon, change its qty, close the drawer, then click **Box** again and change the qty once more. **Expected:** the second change works exactly like the first. If the steppers are dead on the second open, event delegation is broken — stop and fix.
17. Open Build Your Own. Click **Surprise me**; the counter must read `12 / 12` and **Build my box** must be enabled. Set one flavour so the total is 11 — **Build my box** must disable and the counter must show `11 / 12`. Restore to 12 and add it.
18. In the drawer, click **Checkout**. **Expected:** immediate navigation to Shopify checkout with matching lines and total. Compare against the total from step 8 for the same cart contents.
19. Middle-click (or cmd-click) the **Box** control. **Expected:** `/cart` opens in a new tab — the drawer does *not* hijack the modified click.

**Part C — adverse conditions**

20. DevTools → Network → throttling **Offline**, then click **Add to box** on a product page. **Expected:** an inline error message appears, or the browser performs the native form POST — *never* a silent no-op with an enabled-looking button.
21. Set a product variant to sold out in Shopify admin, reload its page. **Expected:** button reads **Sold out** and is `disabled`. Then re-enable it.
22. DevTools → Network → Request blocking: block `*cart.js*` and reload the homepage. **Expected:** clicking **Box** navigates to `/cart`, and checkout from `/cart` works. This simulates an ad blocker or CDN failure and must behave exactly like Part A.
23. Run the whole of Part B once on a real mobile device (iOS Safari) at 375 px: the drawer must not be clipped, the Checkout button must be reachable without scrolling past the fold when the cart holds one item, and body scroll must be locked while the drawer is open and restored after closing.
24. Keyboard-only pass on `/cart`: Tab from the top of the page, reach the qty fields, Update box, and Checkout, and confirm Enter on Checkout submits.

Record pass/fail for all 24 steps in the release ticket. **Steps 3, 8, 18 and 22 directly encode the previous build's failure and can never be waived.**

### 6.6 Responsive, browser, accessibility and performance

**AC-RESP-1 — Viewport matrix.** No horizontal scroll, no clipped text, no overlapping elements, all CTAs tappable:

| Width | Device class | Must verify |
|---|---|---|
| 320 | Galaxy Fold / small Android | Hero CTAs stack; counter `0 / 12` not truncated |
| 375 | iPhone SE / 13 mini | Builder rows readable; sticky summary does not cover Checkout |
| 393–430 | iPhone 14/15/Pro Max, Pixel | Header Box icon ≥ 44 × 44 px hit target |
| 768–834 | iPad portrait | Lineup grid 2-up or 3-up, not broken |
| 1024–1280 | Laptop | Lineup 3-up; footer 4-column |
| 1440–1920 | Desktop | Content max-width honoured; hero art not stretched |

**AC-RESP-2 — Browsers.** Safari iOS (latest and latest-1), Chrome Android, Chrome desktop, Safari macOS, Firefox desktop, Edge desktop. The purchase path (§6.4) is exercised in full on Safari iOS and Chrome Android at minimum, since >70% of Indian D2C traffic is mobile.

**AC-RESP-3 — Cart drawer on mobile.** Reachable, scrollable, closable via ✕, Escape and backdrop tap; background body scroll locked while open; focus trapped inside the drawer and returned to the Box icon on close.

**AC-A11Y-1 — Baselines.** Zero critical axe DevTools violations on Home, PDP and Cart, including with the drawer open. Lighthouse accessibility ≥ 95 on `/cart`. All images have `alt`; decorative art has `alt=""`. Body-copy contrast on `#FCEFDC` / `#FFFBF4` meets WCAG AA 4.5:1. The full purchase path is completable with keyboard only.

**AC-PERF-1 — Budgets** (Lighthouse mobile, Slow 4G, 4× CPU): Performance ≥ 80, Accessibility ≥ 95, LCP ≤ 2.5 s, CLS ≤ 0.1, total page weight ≤ 1.5 MB on Home and ≤ 1.2 MB on PDP. Every raster image is served through `image_url: width: …` with `srcset`, `sizes`, explicit `width`/`height`, `loading="lazy"` below the fold, and `fetchpriority="high"` on the LCP image only. No raw asset over 300 KB.

### 6.7 Theme Check and code quality

**AC-TC-1 — Zero errors.** `shopify theme check --fail-level error` exits 0 with **0 errors**. Warnings are permitted only if each is listed with a justification in `.theme-check.yml`; blanket disabling of a check is a fail.

**AC-TC-2 — Required checks enabled.** `.theme-check.yml` extends `theme-check:recommended` and does not disable `MissingTemplate`, `ValidJson`, `UndefinedObject`, `RequiredLayoutThemeObject`, `MissingAsset`, `TranslationKeyExists`, `DeprecatedFilter`, `ParserBlockingScript`.

**AC-TC-3 — No console errors.** The DevTools console is clean (0 errors, 0 uncaught promise rejections) on Home, PDP, BYO, Cart, About, Contact and 404 — before and after adding to cart.

**AC-TC-4 — Online Store 2.0 structure.** All templates are JSON per §3.2; every section has a `{% schema %}` with `presets` where it belongs on Home; sections are reorderable and removable in the theme editor without breaking the page.

**AC-TC-5 — Theme editor stability.** Adding, removing, reordering and hiding each section in the editor produces no Liquid error and no layout break. Removing the Build Your Own section does not break the header or cart.

### 6.8 GitHub → Shopify import

**AC-GH-1 — Root layout.** Theme directories (`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`) are at the **repository root**, not nested. `docs/` and tooling files are tolerated but must contain no `.liquid` files.

**AC-GH-2 — Clean first import.** Connecting the repo in Admin → Online Store → Themes → Add theme → Connect from GitHub, on branch `main`, produces a theme with **no import errors** in the connection panel.

**AC-GH-3 — Required files present.** `layout/theme.liquid` (containing `{{ content_for_header }}` and `{{ content_for_layout }}`), `config/settings_schema.json`, `config/settings_data.json`, `locales/en.default.json`, and `templates/{index,product,cart,collection,page,404,list-collections,search}.json` all exist. A missing `locales/en.default.json` or a malformed `settings_schema.json` blocks the import entirely.

**AC-GH-4 — Round-trip.** A commit to `main` appears in the connected theme within ~1 minute. A change made in the theme editor commits back to `main` as a `config/settings_data.json` update. Both directions verified once before launch.

**AC-GH-5 — Publish safety.** The GitHub-connected theme is previewed and passes §6.10 **before** publishing. The previously published theme is duplicated and retained as `ROLLBACK — pre-rebuild <date>` and is not deleted for at least 30 days.

### 6.9 Content and SEO regression

- [ ] Product handles unchanged: `/products/green-apple`, `/products/mojito`, `/products/watermelon` return 200 with the same titles
- [ ] `/pages/about-us` and `/pages/contact` return 200
- [ ] Policy pages (Privacy, Refund, Shipping, Terms) render from Shopify's policy objects and are linked from the footer
- [ ] Contact details render exactly: `info@blackpeak.quest`, `contact@blackpeak.quest`, `moazzam@blackpeak.quest`, `+91 7006170478`, `Mon–Sat, 9am–5pm`
- [ ] Newsletter form posts to Shopify's customer form and shows a success state; `KASHMIR50` exists as a live discount code in Admin (otherwise the fine print is a defect)
- [ ] Footer disclaimer and `Product of India` present verbatim
- [ ] `robots.txt` and `sitemap.xml` reachable; no `noindex` left on the published theme
- [ ] Open Graph title/description/image set; Instagram and Facebook links resolve

### 6.10 Sign-off checklist (all must be ticked before publish)

- [ ] §6.2 AC-CAT-1…4 pass, grep output attached
- [ ] §6.3 `scripts/copy-check.mjs` exits 0
- [ ] §6.4 AC-CART-1…13 pass, including the JS-disabled path and four real test orders
- [ ] §6.5 all 24 QA steps recorded pass, steps 3 / 8 / 18 / 22 green
- [ ] §6.6 responsive matrix complete, axe clean, Lighthouse budgets met
- [ ] §6.7 `shopify theme check` 0 errors, console clean
- [ ] §6.8 GitHub import clean, rollback theme duplicated and named
- [ ] §6.9 content/SEO regression complete
- [ ] Merchant has confirmed `build-your-own` exists, is active, priced Rs 660, tracking off, and on the Online Store channel (D1)
- [ ] Post-publish smoke test on the live domain: one real order placed and refunded

### 6.11 Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Trigger / detection |
|---|---|---|---|---|---|
| R1 | **Merchant has not created the `build-your-own` product** (Rs 660), so the builder has nothing to add and "Build my box" fails | High | Critical — the flagship path is dead | Liquid guard: if the product is missing or unavailable, the section renders a merchant-visible notice in the theme editor and hides the CTA on the storefront instead of erroring (§4.7). Send the §2.3 product spec to the merchant **before** dev starts. Block AC-CART-8 sign-off on the product existing. | AC-CAT-1; `/cart/add.js` returning 422 |
| R2 | **JavaScript blocked or fails** (ad blocker, old Safari, script error, slow 3G timeout) leaves the cart unreachable — the exact previous failure | Medium | Critical — zero revenue, and it is the bug we were hired to fix | Progressive enhancement is mandatory (§4.1): the Box icon is an `<a href="/cart">`, add-to-cart is a native `<form method="post">`, checkout is `<button type="submit" name="checkout">`. JS only intercepts and enhances. Tested with JS off on every release. | AC-CART-1, AC-CART-2, AC-CART-11; §6.5 Parts A and C |
| R3 | **Line-item properties lost at checkout** — the BYO mix does not reach the order, so fulfilment ships the wrong cans | Medium | High — wrong shipments, refunds, manual chasing | Send the mix as customer-visible properties (not only `_`-prefixed) on a single `build-your-own` line, plus the redundant one-line `Mix` summary (§2.2). Verify on the **checkout page** and the **Admin order**, not just the drawer. Never store the mix only in `localStorage` or cart attributes. | AC-CART-8; test-order inspection in Admin |
| R4 | **Stale Rs 499 / gift-box references survive** in `settings_data.json`, a nav menu, a metafield, an Admin page, or an email template | Medium | High — advertising a product that cannot be bought; credibility hit | The §2.5 Step 4 gate wired into a pre-commit hook and CI so any reintroduction fails the build, plus the manual Admin audit in AC-CAT-3 and 301s for legacy URLs | Gate output; site search for `gift`; 404-log review one week post-launch |
| R5 | **Image weight** — unoptimised can renders and hero art blow the mobile budget on Indian 4G | High | Medium — bounce rate and lost conversions | All images through `image_url` + `image_tag` with `srcset`, `sizes`, explicit dimensions, `loading="lazy"` below the fold, `fetchpriority="high"` on the LCP image only. Reject any raw asset over 300 KB. | AC-PERF-1 Lighthouse run; DevTools Network total transfer |
| R6 | Theme editor overwrites `config/settings_data.json`, causing GitHub merge conflicts or reverting dev work | Medium | Medium — lost settings, confusing diffs | Treat `settings_data.json` as merchant-owned: developers never hand-edit it after launch; pull before every push; do all default-value work in `settings_schema.json` and section `default`s (§5.6) | Conflicting commits on `main` authored by the Shopify integration |
| R7 | Shopify checkout ignores theme styling, so checkout looks off-brand after a polished storefront | Medium | Low | Set checkout branding in Admin → Settings → Checkout (logo, `#7B4FBE` accent, `#FCEFDC` background). Admin work, not theme code; flag to merchant | Visual review of the test-order checkout |
| R8 | Copy drift — a developer "fixes" `founders`, `Im`, or a missing full stop from the scraped source | Medium | Medium — client rejects the build on fidelity grounds | The verbatim rule and the sanctioned-deviation table (§6.3); `scripts/copy-check.mjs` asserts exact substrings so drift fails automatically | Non-zero exit from the copy-check script |
| R9 | INR money formatting renders inconsistently across drawer, PDP and checkout | Low | Medium — looks broken at the moment of payment | Always use the `money` filter; never string-concatenate prices; verify Admin → Settings → Store details currency formatting once and screenshot it (F18) | AC-CAT-4; visual check of drawer vs PDP vs checkout |
| R10 | Publishing the new theme before QA completes, taking the live store down | Low | Critical | Publish is gated on §6.10; the pre-rebuild theme is duplicated as a named rollback before publish and retained 30 days; rollback is one click in Admin → Themes → Publish | Release process; rollback drill run once during QA |
| R11 | `Surprise me` produces a mix that does not sum to 12 (off-by-one in the randomiser) | Medium | Medium — user cannot check out, or checks out with 11 cans | Unit-test the mix generator: 1000 iterations, every result sums to exactly 12 and every count is ≥ 2. Price is fixed server-side at Rs 660 regardless of mix, so a bad mix cannot cause a pricing exploit | AC-CART-9; §6.5 step 17 |
| R12 | Third-party app embeds (reviews, WhatsApp widget, pixels) injected via `content_for_header` break the drawer or steal focus | Low | Medium | Test with all currently installed apps enabled on the preview theme; verify AC-CART-3 and AC-RESP-3 with app embeds on | Console errors after enabling app embeds |
