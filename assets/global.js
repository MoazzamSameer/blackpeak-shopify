/* ==========================================================================
   BLACKPEAK — global.js
   Kashmir's own soda. Bold flavour, bold fizz.

   CART PHILOSOPHY (this is the bug we are fixing):
   Every purchase path works with ZERO JavaScript.
     - "Box" in the header is a real <a href="/cart">.
     - Add-to-cart is a real <form action="/cart/add" method="post">.
     - Checkout is a real <form action="/cart" method="post"> + <button name="checkout">.
   JavaScript only *upgrades* those into a drawer. If this file fails to load,
   errors, or is blocked, the customer can still add to cart and check out.
   ========================================================================== */
(function () {
  "use strict";

  var BP = window.BlackPeak || {};
  var routes = BP.routes || {};
  var MONEY = BP.moneyFormat || "Rs. {{amount}}";
  var STR = BP.strings || {};

  var CART_URL = routes.cart || "/cart";
  var CART_ADD = routes.cart_add || "/cart/add.js";
  var CART_CHANGE = routes.cart_change || "/cart/change.js";
  var CART_JSON = routes.cart_json || "/cart.js";

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  /* ---------------------------------------------------------------- money */
  function formatMoney(cents) {
    var n = (cents || 0) / 100;
    // Indian grouping (1,23,456) for whole rupees
    var whole = Math.floor(Math.abs(n));
    var dec = Math.round((Math.abs(n) - whole) * 100);
    var s = String(whole);
    if (s.length > 3) {
      var last3 = s.slice(-3);
      var rest = s.slice(0, -3);
      s = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
    }
    var amount = s + "." + (dec < 10 ? "0" + dec : dec);
    var out = MONEY.replace(/\{\{\s*amount[^}]*\}\}/g, amount);
    if (out === MONEY) out = "Rs. " + amount; // money format had no token
    return (n < 0 ? "-" : "") + out;
  }

  /* ------------------------------------------------------------ mobile nav */
  on($("[data-nav-toggle]"), "click", function () {
    var h = $(".header");
    if (h) h.classList.toggle("nav-open");
  });

  /* --------------------------------------------------------- FAQ accordion */
  $all("details.faq__item").forEach(function (d) {
    on(d, "toggle", function () {
      if (d.open) $all("details.faq__item").forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ============================== CART DRAWER ============================= */
  var drawer = $("#CartDrawer");
  var overlay = $("#DrawerOverlay");
  var lastFocus = null;

  function drawerOpen() {
    if (!drawer) return false;
    return drawer.classList.contains("open");
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    if (overlay) overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    var f = drawer.querySelector("[data-cart-close]");
    if (f) f.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // The Box control is a real link to /cart. Upgrade it to the drawer.
  $all("[data-cart-toggle]").forEach(function (b) {
    on(b, "click", function (e) {
      if (!drawer) return;            // no drawer -> let the link navigate to /cart
      e.preventDefault();
      openDrawer();
      refreshCart();
    });
  });
  $all("[data-cart-close]").forEach(function (b) { on(b, "click", closeDrawer); });
  on(overlay, "click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawerOpen()) closeDrawer();
    if (e.key === "Tab" && drawerOpen() && drawer) {
      var f = $all('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', drawer)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function setCartCount(n) {
    $all("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.style.display = n > 0 ? "" : "none";
    });
  }

  function renderCart(cart) {
    if (!cart) return;
    setCartCount(cart.item_count);
    var wrap = $("[data-drawer-items]");
    var foot = $("[data-drawer-foot]");
    if (!wrap) return;

    if (!cart.item_count) {
      wrap.innerHTML = '<div class="drawer__empty">' +
        (STR.empty || "Your box is empty. Kashmir's waiting.") + "</div>";
      if (foot) foot.style.display = "none";
      return;
    }
    if (foot) foot.style.display = "";

    wrap.innerHTML = cart.items.map(function (it) {
      var img = it.image ? it.image.replace(/(\.[a-zA-Z0-9]+)(\?.*)?$/, "_160x$1$2") : "";
      // Show the build-your-own mix from line item properties
      var props = "";
      if (it.properties) {
        Object.keys(it.properties).forEach(function (k) {
          if (!k || k.charAt(0) === "_") return;
          var v = it.properties[k];
          if (v) props += '<div class="line__prop">' + esc(k) + ": " + esc(v) + "</div>";
        });
      }
      return '' +
        '<div class="line">' +
          (img ? '<img src="' + img + '" alt="" loading="lazy" width="60" height="60">' : '<div></div>') +
          '<div>' +
            '<div class="line__name">' + esc(it.product_title) +
              (it.variant_title && it.variant_title !== "Default Title" ? " · " + esc(it.variant_title) : "") +
            '</div>' +
            props +
            '<div class="line__price">' + it.quantity + " × " + formatMoney(it.final_price) + '</div>' +
            '<button class="line__remove" type="button" data-line-remove data-key="' + esc(it.key) + '">Remove</button>' +
          '</div>' +
          '<div class="line__price">' + formatMoney(it.final_line_price) + '</div>' +
        '</div>';
    }).join("");

    var sub = $("[data-subtotal]");
    if (sub) sub.textContent = formatMoney(cart.total_price);

    $all("[data-line-remove]", wrap).forEach(function (b) {
      on(b, "click", function () { changeLine(b.getAttribute("data-key"), 0); });
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function refreshCart() {
    return fetch(CART_JSON, { headers: { Accept: "application/json" }, credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(renderCart)
      .catch(function () { /* drawer keeps server-rendered state; /cart still works */ });
  }

  function changeLine(key, qty) {
    return fetch(CART_CHANGE, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id: key, quantity: qty })
    })
      .then(function (r) { return r.json(); })
      .then(renderCart)
      .catch(function () { window.location.href = CART_URL; });
  }

  function addItems(items) {
    return fetch(CART_ADD, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ items: items })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (e) { throw e; });
      return r.json();
    });
  }

  function flash(btn, msg, ms) {
    if (!btn) return;
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.textContent = msg;
    setTimeout(function () { btn.textContent = btn.dataset.label; btn.disabled = false; }, ms || 1400);
  }

  /* ------------------------------- product add-to-cart (progressive) ------ */
  $all("form[data-product-form]").forEach(function (form) {
    on(form, "submit", function (e) {
      var idEl = form.querySelector('[name="id"]');
      if (!idEl || !idEl.value) return;           // let it POST natively
      e.preventDefault();
      var qtyEl = form.querySelector('[name="quantity"]');
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.dataset.label = btn.textContent; btn.textContent = "Adding…"; btn.disabled = true; }

      var item = { id: Number(idEl.value), quantity: Number(qtyEl && qtyEl.value ? qtyEl.value : 1) };
      // carry any line item properties present on the form
      var props = {};
      $all('[name^="properties["]', form).forEach(function (p) {
        var m = p.name.match(/^properties\[(.+)\]$/);
        if (m && p.value) props[m[1]] = p.value;
      });
      if (Object.keys(props).length) item.properties = props;

      addItems([item])
        .then(function () {
          if (btn) { btn.textContent = "Added ✓"; }
          return refreshCart();
        })
        .then(function () {
          openDrawer();
          if (btn) flash(btn, "Added ✓", 1200);
        })
        .catch(function (err) {
          var msg = (err && (err.description || err.message)) || "Sold out";
          if (btn) { btn.textContent = msg.slice(0, 24); flash(btn, msg.slice(0, 24), 2200); }
          else { form.submit(); }
        });
    });
  });

  /* ============================ BUILD YOUR OWN =========================== */
  var byo = $("[data-byo]");
  if (byo) {
    var MAX = Number(byo.getAttribute("data-byo-max") || 12);
    var byoVariant = byo.getAttribute("data-byo-variant") || "";
    var byoPrice = Number(byo.getAttribute("data-byo-price") || 0); // in paise
    var rows = $all("[data-byo-row]", byo);
    var counts = rows.map(function () { return 0; });

    var countEl = $("[data-byo-count]", byo);
    var barEl = $("[data-byo-bar]", byo);
    var priceEl = $("[data-byo-price-out]", byo);
    var hintEl = $("[data-byo-hint]", byo);
    var addBtn = $("[data-byo-add]", byo);
    var mixField = $("[data-byo-mix]", byo);
    // JS is running, so replace the native mix picker with the interactive steppers.
    var nojs = $("[data-byo-nojs]", byo);
    if (nojs) nojs.style.display = "none";

    function total() { return counts.reduce(function (a, b) { return a + b; }, 0); }

    function mixString() {
      return rows.map(function (r, i) {
        return counts[i] > 0 ? r.getAttribute("data-byo-name") + " × " + counts[i] : null;
      }).filter(Boolean).join(", ");
    }

    function renderByo() {
      var t = total();
      rows.forEach(function (r, i) {
        var out = $("[data-byo-qty]", r);
        if (out) out.textContent = counts[i];
        var minus = $("[data-byo-minus]", r);
        var plus = $("[data-byo-plus]", r);
        if (minus) minus.disabled = counts[i] === 0;
        if (plus) plus.disabled = t >= MAX;
      });
      if (countEl) countEl.textContent = t + " / " + MAX;
      if (barEl) barEl.style.width = (t / MAX) * 100 + "%";
      if (priceEl) priceEl.textContent = t === MAX ? formatMoney(byoPrice) : formatMoney(0);
      if (hintEl) {
        hintEl.textContent = t === MAX
          ? "Your box is ready — 12 cans, mix & match."
          : (t === 0 ? "Pick 12 cans — mix all three." : "Add " + (MAX - t) + " more can" + (MAX - t === 1 ? "" : "s") + ".");
      }
      if (addBtn) {
        addBtn.disabled = t !== MAX;
        addBtn.textContent = t === MAX ? "Build my box" : "Pick " + (MAX - t) + " more";
      }
      if (mixField) {
        var val = mixString();
        if (mixField.tagName === "SELECT") {
          var opt = mixField.querySelector("option[data-custom]");
          if (!opt) { opt = document.createElement("option"); opt.setAttribute("data-custom", ""); mixField.appendChild(opt); }
          opt.value = val;
          opt.textContent = val || "Your mix";
          opt.selected = true;
        } else {
          mixField.value = val;
        }
      }
    }

    rows.forEach(function (r, i) {
      on($("[data-byo-plus]", r), "click", function () { if (total() < MAX) { counts[i]++; renderByo(); } });
      on($("[data-byo-minus]", r), "click", function () { if (counts[i] > 0) { counts[i]--; renderByo(); } });
    });

    on($("[data-byo-even]", byo), "click", function () {
      var base = Math.floor(MAX / rows.length), rem = MAX % rows.length;
      counts = rows.map(function (_, i) { return base + (i < rem ? 1 : 0); });
      renderByo();
    });

    on($("[data-byo-surprise]", byo), "click", function () {
      counts = rows.map(function () { return 0; });
      // deterministic-ish spread that still feels random, seeded by current time of click
      var seed = (new Date()).getSeconds() + (new Date()).getMilliseconds();
      for (var n = 0; n < MAX; n++) { counts[(seed + n * 7) % rows.length]++; }
      renderByo();
    });

    on($("[data-byo-reset]", byo), "click", function () {
      counts = rows.map(function () { return 0; });
      renderByo();
    });

    // The BYO form is a real form; JS upgrades it to AJAX + drawer.
    var byoForm = $("[data-byo-form]", byo);
    on(byoForm, "submit", function (e) {
      if (total() !== MAX) { e.preventDefault(); return; }
      if (!byoVariant) return;                    // no variant -> native POST/redirect
      e.preventDefault();
      if (addBtn) { addBtn.disabled = true; addBtn.textContent = "Adding…"; }
      addItems([{ id: Number(byoVariant), quantity: 1, properties: { "Your mix": mixString() } }])
        .then(refreshCart)
        .then(function () {
          openDrawer();
          counts = rows.map(function () { return 0; });
          renderByo();
        })
        .catch(function () { byoForm.submit(); });
    });

    renderByo();
  }

  /* ------------------------------- sticky add-to-cart (product page) ----- */
  var sticky = $(".sticky-atc");
  if (sticky) {
    var anchor = $("form[data-product-form]");
    if (anchor && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { sticky.classList.toggle("show", !en.isIntersecting); });
      }, { rootMargin: "0px 0px -80px 0px" }).observe(anchor);
    } else {
      sticky.classList.add("show");
    }
  }

  /* ------------------------------------------------- reveal on scroll ---- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    $all(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $all(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Keep the header count truthful on back/forward cache restores */
  window.addEventListener("pageshow", function (e) { if (e.persisted) refreshCart(); });
})();
