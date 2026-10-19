/* Personal Buddy - configurator.
   5 steps, URL state, deterministic pricing engine.
   Prices are ESTIMATES; the brief requires server-side re-verification
   at checkout before launch. See docs/pricing-model.xlsx for the cost basis. */

(function () {
  "use strict";
  var root = document.getElementById("configurator");
  if (!root) return;

  var TIERS = [
    { id: "starter", name: "Starter", price: 259, blurb: "Clock, alarm, OLED face, buzzer. The essentials." },
    { id: "smart", name: "Smart", price: 289, blurb: "Adds temperature, humidity, Wi-Fi sync and RGB." },
    { id: "premium", name: "Premium", price: 335, blurb: "Adds touch, weather, custom messages and sounds." },
    { id: "custom", name: "Custom", price: 399, blurb: "Quote-based. Designed with you, reviewed by a human." },
    { id: "voice", name: "Voice", price: 1049, blurb: "Raspberry Pi voice companion. COMING SOON.", coming: true }
  ];
  var TIER_RANK = { starter: 0, smart: 1, premium: 2, custom: 3, voice: 4 };

  var TYPES = [
    { id: "robot", name: "Robot", add: 0 },
    { id: "cat", name: "Cat", add: 10 },
    { id: "dog", name: "Dog", add: 10 },
    { id: "alien", name: "Alien", add: 15 },
    { id: "gamer", name: "Gamer", add: 20 },
    { id: "space", name: "Space", add: 15 },
    { id: "love", name: "Love", add: 15 },
    { id: "custom", name: "Fully custom", add: 60, note: "Needs human review" }
  ];

  var COLOURS = [
    { id: "black", name: "Black", hex: "#232323", add: 0 },
    { id: "white", name: "White", hex: "#f2f2f2", add: 0 },
    { id: "red", name: "Red", hex: "#FF4D4D", add: 0 },
    { id: "green", name: "Green", hex: "#6FE7B8", add: 0 },
    { id: "blue", name: "Blue", hex: "#4d7cff", add: 0 },
    { id: "purple", name: "Purple", hex: "#9b5cff", add: 0 },
    { id: "pink", name: "Pink", hex: "#ff7ad9", add: 0 },
    { id: "custom", name: "Custom", hex: "linear-gradient(135deg,#6FE7B8,#C2452D)", add: 12 }
  ];

  var FEATURES = [
    { id: "clock", name: "Smart Clock", price: 0, min: "starter", status: "available", incl: ["starter", "smart", "premium", "custom", "voice"] },
    { id: "alarm", name: "Alarm", price: 0, min: "starter", status: "available", incl: ["starter", "smart", "premium", "custom", "voice"] },
    { id: "timer", name: "Timer", price: 0, min: "starter", status: "available", incl: ["starter", "smart", "premium", "custom", "voice"] },
    { id: "face", name: "Animated Face", price: 0, min: "starter", status: "available", incl: ["starter", "smart", "premium", "custom", "voice"] },
    { id: "sounds", name: "Sounds", price: 0, min: "starter", status: "available", incl: ["starter", "smart", "premium", "custom", "voice"] },
    { id: "temperature", name: "Temperature", price: 0, min: "smart", status: "available", incl: ["smart", "premium", "custom", "voice"] },
    { id: "humidity", name: "Humidity", price: 0, min: "smart", status: "available", incl: ["smart", "premium", "custom", "voice"] },
    { id: "wifi", name: "Wi-Fi", price: 0, min: "smart", status: "available", incl: ["smart", "premium", "custom", "voice"] },
    { id: "rgb", name: "RGB Lighting", price: 0, min: "smart", status: "available", incl: ["smart", "premium", "custom", "voice"] },
    { id: "pomodoro", name: "Pomodoro", price: 15, min: "smart", status: "preorder", incl: [] },
    { id: "touch", name: "Touch", price: 25, min: "smart", status: "preorder", incl: [] },
    { id: "weather", name: "Weather", price: 20, min: "premium", status: "preorder", incl: [] },
    { id: "messages", name: "Custom Messages", price: 15, min: "premium", status: "preorder", incl: [] },
    { id: "motion", name: "Motion", price: 25, min: "smart", status: "coming", incl: [] },
    { id: "bluetooth", name: "Bluetooth", price: 20, min: "smart", status: "coming", incl: [] },
    { id: "voice", name: "Voice", price: 0, min: "voice", status: "coming", incl: ["voice"] }
  ];

  var EXTRAS = [
    { id: "giftwrap", name: "Gift wrap", price: 12 },
    { id: "oled13", name: '1.3" OLED upgrade', price: 15 },
    { id: "spares", name: "Spare parts kit", price: 18 },
    { id: "psu", name: "Certified 5V/3A PSU", price: 18 },
    { id: "cable", name: "Extra USB-C cable", price: 12 },
    { id: "warranty2", name: "Second-year warranty", price: 25 }
  ];

  var PERSONALITIES = ["Chill", "Playful", "Formal", "Motivational"];

  var state = {
    step: 1,
    tier: "smart",
    type: "robot",
    colour: "green",
    features: ["clock", "alarm", "timer", "face", "sounds", "temperature", "humidity", "wifi", "rgb"],
    waitlist: [],
    extras: [],
    name: "",
    greeting: "",
    favColour: "",
    personality: "Playful"
  };

  /* ---------- URL state ---------- */
  function readURL() {
    var q = new URLSearchParams(window.location.search);
    ["tier", "type", "colour", "name", "greeting", "favColour", "personality"].forEach(function (k) {
      if (q.get(k)) state[k] = q.get(k);
    });
    if (q.get("features")) state.features = q.get("features").split(",").filter(Boolean);
    if (q.get("extras")) state.extras = q.get("extras").split(",").filter(Boolean);
    if (q.get("step")) state.step = Math.min(5, Math.max(1, parseInt(q.get("step"), 10) || 1));
    if (!TIER_RANK.hasOwnProperty(state.tier)) state.tier = "smart";
  }
  function writeURL() {
    var q = new URLSearchParams();
    q.set("tier", state.tier); q.set("type", state.type); q.set("colour", state.colour);
    q.set("features", state.features.join(","));
    if (state.extras.length) q.set("extras", state.extras.join(","));
    if (state.name) q.set("name", state.name);
    if (state.greeting) q.set("greeting", state.greeting);
    if (state.favColour) q.set("favColour", state.favColour);
    q.set("personality", state.personality);
    q.set("step", state.step);
    history.replaceState(null, "", "?" + q.toString());
  }

  /* ---------- pricing ---------- */
  function tierOf(id) { return TIERS.filter(function (t) { return t.id === id; })[0]; }
  function featOf(id) { return FEATURES.filter(function (f) { return f.id === id; })[0]; }
  function extraOf(id) { return EXTRAS.filter(function (e) { return e.id === id; })[0]; }

  function price() {
    var total = tierOf(state.tier).price;
    var lines = [{ label: tierOf(state.tier).name + " base", amount: tierOf(state.tier).price }];
    var type = TYPES.filter(function (t) { return t.id === state.type; })[0];
    if (type && type.add) { total += type.add; lines.push({ label: type.name + " body", amount: type.add }); }
    var col = COLOURS.filter(function (c) { return c.id === state.colour; })[0];
    if (col && col.add) { total += col.add; lines.push({ label: "Custom colour", amount: col.add }); }
    state.features.forEach(function (fid) {
      var f = featOf(fid);
      if (!f) return;
      if (f.incl.indexOf(state.tier) >= 0) return;
      if (f.status === "coming") return;
      total += f.price;
      lines.push({ label: f.name + (f.status === "preorder" ? " (pre-order)" : ""), amount: f.price });
    });
    state.extras.forEach(function (eid) {
      var e = extraOf(eid);
      if (e) { total += e.price; lines.push({ label: e.name, amount: e.price }); }
    });
    return { total: total, lines: lines };
  }

  function money(n) { return "$" + n.toFixed(0); }
  function statusTag(s) {
    if (s === "available") return '<span class="tag tag-available">Available</span>';
    if (s === "preorder") return '<span class="tag tag-preorder">Pre-order</span>';
    return '<span class="tag tag-coming">Coming soon</span>';
  }

  /* ---------- render ---------- */
  var stepsEl = document.getElementById("cfg-steps");
  var bodyEl = document.getElementById("cfg-body");
  var sumEl = document.getElementById("cfg-summary");
  var STEP_NAMES = ["Buddy", "Colours", "Features", "Personality", "Price"];

  function render() {
    writeURL();
    renderSteps();
    renderBody();
    renderSummary();
  }

  function renderSteps() {
    stepsEl.innerHTML = "";
    STEP_NAMES.forEach(function (n, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cfg-step" + (i + 1 < state.step ? " done" : "");
      b.textContent = (i + 1) + ". " + n;
      if (i + 1 === state.step) b.setAttribute("aria-current", "step");
      b.addEventListener("click", function () { state.step = i + 1; render(); });
      stepsEl.appendChild(b);
    });
  }

  function optButton(label, pressed, onclick, extraHTML, disabled, title) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    b.setAttribute("aria-pressed", pressed ? "true" : "false");
    if (disabled) b.setAttribute("disabled", "");
    if (title) b.title = title;
    b.innerHTML = (extraHTML || "") + "<span>" + label + "</span>";
    b.addEventListener("click", onclick);
    return b;
  }

  function renderBody() {
    bodyEl.innerHTML = "";
    var h = document.createElement("h2");
    var grid = document.createElement("div");
    grid.className = "opt-grid";

    if (state.step === 1) {
      h.textContent = "Step 1. Choose your Buddy";
      bodyEl.appendChild(h);
      var tp = document.createElement("p");
      tp.className = "muted";
      tp.textContent = "Pick a tier first, then a body style. Tiers set the electronics inside.";
      bodyEl.appendChild(tp);
      var tierH = document.createElement("h3"); tierH.textContent = "Tier"; tierH.style.marginTop = "24px";
      bodyEl.appendChild(tierH);
      var tierGrid = document.createElement("div"); tierGrid.className = "opt-grid";
      TIERS.forEach(function (t) {
        tierGrid.appendChild(optButton(
          t.name + (t.coming ? " (soon)" : ""),
          state.tier === t.id,
          function () {
            state.tier = t.id;
            state.features = FEATURES.filter(function (f) {
              return f.incl.indexOf(t.id) >= 0;
            }).map(function (f) { return f.id; });
            render();
          },
          '<span class="opt-price">from ' + money(t.price) + " CAD</span>",
          t.coming, t.coming ? "Voice tier is coming soon. Join the waitlist below." : t.blurb
        ));
      });
      bodyEl.appendChild(tierGrid);
      var typeH = document.createElement("h3"); typeH.textContent = "Body style"; typeH.style.marginTop = "24px";
      bodyEl.appendChild(typeH);
      TYPES.forEach(function (t) {
        grid.appendChild(optButton(
          t.name + (t.note ? " *" : ""),
          state.type === t.id,
          function () { state.type = t.id; render(); },
          t.add ? '<span class="opt-price">+' + money(t.add) + "</span>" : '<span class="opt-price">included</span>'
        ));
      });
      bodyEl.appendChild(grid);
      var note = document.createElement("p");
      note.className = "hint"; note.textContent = "* Fully custom bodies need a human review before we quote.";
      bodyEl.appendChild(note);
    }

    if (state.step === 2) {
      h.textContent = "Step 2. Choose colours";
      bodyEl.appendChild(h);
      COLOURS.forEach(function (c) {
        grid.appendChild(optButton(
          c.name, state.colour === c.id,
          function () { state.colour = c.id; render(); },
          '<span class="swatch" style="background:' + c.hex + '"></span>' +
          (c.add ? '<span class="opt-price">+' + money(c.add) + "</span>" : '<span class="opt-price">included</span>')
        ));
      });
      bodyEl.appendChild(grid);
      var p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Colours map to real PLA filament. Custom colours are matched as close as the filament range allows.";
      bodyEl.appendChild(p);
    }

    if (state.step === 3) {
      h.textContent = "Step 3. Choose features";
      bodyEl.appendChild(h);
      FEATURES.forEach(function (f) {
        var okTier = TIER_RANK[state.tier] >= TIER_RANK[f.min] || state.tier === "custom";
        var coming = f.status === "coming";
        var pressed = state.features.indexOf(f.id) >= 0;
        var priceTxt = f.incl.indexOf(state.tier) >= 0 ? "included"
          : (f.price ? "+" + money(f.price) : "included");
        var label = f.name + "<br>" + statusTag(f.status);
        var btn = optButton(label, pressed && !coming, function () {
          if (coming) {
            var i = state.waitlist.indexOf(f.id);
            if (i >= 0) state.waitlist.splice(i, 1); else state.waitlist.push(f.id);
          } else {
            var j = state.features.indexOf(f.id);
            if (j >= 0) state.features.splice(j, 1); else state.features.push(f.id);
          }
          render();
        }, '<span class="opt-price">' + priceTxt + "</span>",
          !okTier,
          !okTier ? "Needs the " + tierOf(f.min).name + " tier or above." : (coming ? "Coming soon. Tap to join the waitlist." : f.name));
        if (coming && state.waitlist.indexOf(f.id) >= 0) btn.setAttribute("aria-pressed", "true");
        grid.appendChild(btn);
      });
      bodyEl.appendChild(grid);
      if (state.waitlist.length) {
        var w = document.createElement("div");
        w.className = "waitlist-note";
        w.innerHTML = "<strong>Waitlist:</strong> " + state.waitlist.map(function (id) { return featOf(id).name; }).join(", ") +
          ". We will email you when these ship. They are not charged today.";
        bodyEl.appendChild(w);
      }
      var r = document.createElement("p");
      r.className = "hint";
      r.textContent = "Compatibility is enforced: Touch needs Smart or above, Weather and Custom Messages need Premium, Voice needs the Voice tier.";
      bodyEl.appendChild(r);
    }

    if (state.step === 4) {
      h.textContent = "Step 4. Give it a personality";
      bodyEl.appendChild(h);
      bodyEl.appendChild(field("Buddy name", "text", "name", state.name, "e.g. Pixel"));
      bodyEl.appendChild(field("Greeting", "text", "greeting", state.greeting, "e.g. Good morning, champ"));
      bodyEl.appendChild(field("Favourite colour", "text", "favColour", state.favColour, "e.g. mint green"));
      var lab = document.createElement("label"); lab.textContent = "Personality type";
      bodyEl.appendChild(lab);
      var pg = document.createElement("div"); pg.className = "opt-grid";
      PERSONALITIES.forEach(function (pn) {
        pg.appendChild(optButton(pn, state.personality === pn, function () { state.personality = pn; render(); }, ""));
      });
      bodyEl.appendChild(pg);
    }

    if (state.step === 5) {
      h.textContent = "Step 5. Your estimated price";
      bodyEl.appendChild(h);
      var eg = document.createElement("div"); eg.className = "opt-grid";
      EXTRAS.forEach(function (e) {
        eg.appendChild(optButton(e.name, state.extras.indexOf(e.id) >= 0, function () {
          var i = state.extras.indexOf(e.id);
          if (i >= 0) state.extras.splice(i, 1); else state.extras.push(e.id);
          render();
        }, '<span class="opt-price">+' + money(e.price) + "</span>"));
      });
      var eh = document.createElement("h3"); eh.textContent = "Extras"; eh.style.marginTop = "8px";
      bodyEl.appendChild(eh);
      bodyEl.appendChild(eg);
    }

    var nav2 = document.createElement("div");
    nav2.style.cssText = "display:flex;gap:12px;margin-top:32px;flex-wrap:wrap;";
    if (state.step > 1) {
      var back = document.createElement("button");
      back.type = "button"; back.className = "btn btn-ghost"; back.textContent = "Back";
      back.addEventListener("click", function () { state.step--; render(); });
      nav2.appendChild(back);
    }
    if (state.step < 5) {
      var next = document.createElement("button");
      next.type = "button"; next.className = "btn btn-primary"; next.textContent = "Continue";
      next.addEventListener("click", function () { state.step++; render(); window.scrollTo(0, 0); });
      nav2.appendChild(next);
    }
    bodyEl.appendChild(nav2);
  }

  function field(labelText, type, key, val, ph) {
    var d = document.createElement("div"); d.className = "field";
    var lab = document.createElement("label"); lab.textContent = labelText;
    lab.setAttribute("for", "cfg-" + key);
    var inp = document.createElement("input");
    inp.type = type; inp.id = "cfg-" + key; inp.value = val || ""; inp.placeholder = ph || "";
    inp.maxLength = 60;
    inp.addEventListener("input", function () { state[key] = inp.value; writeURL(); renderSummary(); });
    d.appendChild(lab); d.appendChild(inp);
    return d;
  }

  function renderSummary() {
    var pr = price();
    var t = tierOf(state.tier);
    var type = TYPES.filter(function (x) { return x.id === state.type; })[0];
    var col = COLOURS.filter(function (x) { return x.id === state.colour; })[0];
    var html = '<p class="spec">Live estimate</p>' +
      '<div class="total">' + money(pr.total) + ' <span style="font-size:1rem;color:var(--muted-on-dark)">CAD</span></div>' +
      '<p class="hint">Estimated. Taxes and shipping are calculated before payment. Final price is confirmed before you pay.</p>' +
      "<ul class='checklist'>" +
      "<li><strong>" + t.name + "</strong> tier</li>" +
      "<li>" + type.name + " body, " + col.name + "</li>" +
      "<li>" + state.features.length + " features" +
      (state.waitlist.length ? " + " + state.waitlist.length + " on waitlist" : "") + "</li>" +
      (state.name ? "<li>Name: " + escapeHtml(state.name) + "</li>" : "") +
      "</ul>" +
      '<div style="margin-top:8px">' + pr.lines.map(function (l) {
        return '<div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.8rem;padding:4px 0;border-bottom:1px solid var(--line)"><span>' +
          escapeHtml(l.label) + "</span><span>" + money(l.amount) + "</span></div>";
      }).join("") + "</div>";

    if (state.step === 5) {
      html += '<div style="display:flex;flex-direction:column;gap:12px;margin-top:24px">' +
        '<button type="button" class="btn btn-primary" id="cfg-build">Build My Buddy</button>' +
        '<button type="button" class="btn btn-ghost" id="cfg-copy">Copy config link</button>' +
        "</div>" +
        '<p class="hint">Build My Buddy sends your configuration as an order request. No payment is taken on this site yet; we confirm the final price and details with you first.</p>';
    } else {
      html += '<button type="button" class="btn btn-primary" id="cfg-goto5" style="margin-top:24px;width:100%">See price</button>';
    }
    sumEl.innerHTML = html;
    var b1 = document.getElementById("cfg-build");
    if (b1) b1.addEventListener("click", sendOrder);
    var b2 = document.getElementById("cfg-copy");
    if (b2) b2.addEventListener("click", function () {
      var url = window.location.href;
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      b2.textContent = "Link copied";
      setTimeout(function () { b2.textContent = "Copy config link"; }, 2000);
    });
    var b3 = document.getElementById("cfg-goto5");
    if (b3) b3.addEventListener("click", function () { state.step = 5; render(); window.scrollTo(0, 0); });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function sendOrder() {
    var pr = price();
    var body = [
      "BUILD MY BUDDY - order request",
      "",
      "Tier: " + tierOf(state.tier).name,
      "Body: " + state.type,
      "Colour: " + state.colour,
      "Features: " + state.features.join(", "),
      "Waitlist: " + (state.waitlist.join(", ") || "none"),
      "Extras: " + (state.extras.join(", ") || "none"),
      "Name: " + state.name,
      "Greeting: " + state.greeting,
      "Favourite colour: " + state.favColour,
      "Personality: " + state.personality,
      "Estimated price: $" + pr.total.toFixed(0) + " CAD",
      "",
      "Config link: " + window.location.href,
      "",
      "My details:",
      "Name: ",
      "Email: ",
      "City: ",
      "Pickup or shipping: "
    ].join("\n");
    window.location.href = "mailto:support@personalbuddy.ca?subject=" +
      encodeURIComponent("Build My Buddy request - " + tierOf(state.tier).name + " " + state.type) +
      "&body=" + encodeURIComponent(body);
  }

  readURL();
  render();
})();
