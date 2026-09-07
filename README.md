# BlackPeak — Shopify Theme

Kashmir's own soda. Bold flavour, bold fizz.
Online Store 2.0 theme for **blackpeak.quest**. Theme files live at the repository root so
Shopify's GitHub integration can import this directly.

Validated with `shopify theme check` — **0 errors**.

---

## 1. Import into Shopify (from GitHub)

Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub** →
pick this repository and the `main` branch. Shopify then syncs the theme and keeps it
updated whenever you push.

> Prefer a file upload instead? Run `zip -r blackpeak-theme.zip . -x ".*" -x "docs/*" -x "README.md"`
> from this folder and upload the zip. Only the standard theme folders may be in the archive root.

---

## 2. Products you must create (required)

The theme renders products from your Shopify admin — it cannot create them.
The catalogue is deliberately just **two things**:

| Product | Price | Handle | Notes |
|---|---|---|---|
| Green Apple 12 PACK | ₹600 | `green-apple` | already exists |
| Mojito 12 Pack | ₹600 | `mojito` | already exists |
| Watermelon 12 PACK | ₹600 | `watermelon` | already exists |
| **Build Your Own 12-Can Box** | **₹660** | `build-your-own` | **create this** |

**Update the three existing flavours to ₹600.** Then create the Build-Your-Own product at
**₹660** (one product, one variant, no options). The customer's chosen mix is stored on the
order as a **line item property** — e.g. `Your mix: Green Apple × 5, Mojito × 4, Watermelon × 3` —
so you can read it on the order in admin.

There is **no ₹499 gift box**, no singles and no 24-can case. They have been removed everywhere.

---

## 3. Connect products — nothing to do

Products resolve **automatically by handle**. The theme looks for:

| Handle | Used by |
|---|---|
| `green-apple` | flavours grid, build-your-own row 1 |
| `mojito` | flavours grid, build-your-own row 2 |
| `watermelon` | flavours grid, build-your-own row 3 |
| `build-your-own` | the ₹660 mixed box |

As long as those handles exist, the storefront wires itself — no theme-editor
picking required. Each section still exposes an "Override: product" picker if you
ever rename a handle.

The `/products/build-your-own` page automatically shows the same can picker as the
homepage (it detects the handle), instead of a plain add-to-cart button.

## 4. Pages & navigation

Create these pages and assign the matching template:

| Page | Handle | Template |
|---|---|---|
| About Us | `about-us` | `page.about` |
| Contact | `contact` | `page.contact` |

All copy is already in the theme's section settings — the page body can stay empty.

**Online Store → Navigation → Main menu:** Home, Shop (`/collections/all`), Contact.
The **Box** button in the header is the cart and is always present.

---

## 5. How checkout works (the thing that was broken before)

The previous build shipped a store customers could not check out of. This theme is built so
**every purchase path works even if JavaScript never runs**:

- The header **Box** is a real `<a href="/cart">`. JavaScript *upgrades* it into a drawer.
  If JS is blocked or errors, clicking it still goes to a working cart page.
- **Add to cart** is a real `<form action="/cart/add" method="post">`. JS upgrades it to AJAX.
- **Checkout** is a native `<form action="/cart" method="post">` with
  `<button type="submit" name="checkout">` — in both the drawer and the `/cart` page.
  This is Shopify's canonical checkout trigger and needs no JavaScript.
- The drawer is **server-rendered** with the current cart, so it is correct on first paint.

### Manual QA before you go live
1. Add a 12-pack → drawer opens, item + subtotal shown, header count increments.
2. Click **Checkout** in the drawer → Shopify checkout loads with the item.
3. Build a 12-can mix → **Build my box** → one ₹660 line with `Your mix` listed.
4. Visit `/cart` directly → change a quantity → **Update box** → **Checkout** works.
5. Disable JavaScript → **Box** navigates to `/cart`; Add to cart still works; Checkout still works.

---

## 6. Structure

```
assets/     base.css (design tokens), global.js (cart + build-a-box), can artwork
config/     settings_schema.json, settings_data.json
layout/     theme.liquid, password.liquid
locales/    en.default.json
sections/   header, announcement, hero, flavors-grid, build-your-own, why-blackpeak,
            story, social-proof, newsletter, faq, footer, about/contact content,
            main-product, main-collection, main-cart, main-page (+ header/footer groups)
snippets/   cart-drawer, byo-row
templates/  index, product, collection, cart, page (+ about/contact), blog, article,
            search, list-collections, 404, password, gift_card
docs/       PRD and the scraped content source of truth
```

Brand colours and fonts are CSS variables at the top of `assets/base.css`.
