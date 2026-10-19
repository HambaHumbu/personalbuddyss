/* Personal Buddy - shared site JS.
   Nav, scroll reveals, hero boot terminal, pixel face demos. */

(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- scroll reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero boot terminal ---------- */
  var term = document.getElementById("boot-term");
  if (term) {
    var lines = [
      "> personal-buddy v1.0.0",
      "> display ............ OK",
      "> sensors ............ OK",
      "> wifi ............... OK",
      "> rgb ................ OK",
      "> face engine ........ OK",
      "> good morning."
    ];
    if (reduceMotion) {
      term.innerHTML = lines.map(function (l) { return escapeHtml(l); }).join("\n") + "\n";
    } else {
      term.innerHTML = "";
      var li = 0, ci = 0, out = "";
      var cursor = document.createElement("span");
      cursor.className = "cursor";
      (function type() {
        if (li >= lines.length) { term.appendChild(cursor); return; }
        var line = lines[li];
        if (ci <= line.length) {
          out = lines.slice(0, li).join("\n") + (li ? "\n" : "") + line.slice(0, ci);
          term.textContent = out;
          term.appendChild(cursor);
          ci++;
          setTimeout(type, line.charAt(0) === ">" && ci === 1 ? 260 : 14);
        } else { li++; ci = 0; setTimeout(type, 120); }
      })();
    }
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- pixel face demos ----------
     data-face: idle | happy | sleepy | alarm | listening | message | focus
     data-text: optional caption drawn under the face (e.g. 08:00) */
  var FACE_MINT = "#6FE7B8", FACE_RED = "#FF5A45", FACE_BG = "#0A0A08";
  var faces = document.querySelectorAll("canvas.face-demo");
  faces.forEach(function (cv) {
    var ctx = cv.getContext("2d");
    var W = (cv.width = 480), H = (cv.height = 270);
    var state = cv.getAttribute("data-face") || "idle";
    var caption = cv.getAttribute("data-text") || "";
    var px = 10; // pixel size
    var cx = W / 2, cy = H / 2 - 14;

    function rect(x, y, w, h, color) {
      ctx.fillStyle = color || FACE_MINT;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }
    function eye(x, y, open, color) {
      if (open) { rect(x - px, y - px, px * 2, px * 2, color); }
      else { rect(x - px, y - px / 3, px * 2, px * 0.66, color); }
    }
    function mouth(kind, color) {
      if (kind === "smile") {
        rect(cx - px * 2.5, cy + px * 2, px * 5, px, color);
        rect(cx - px * 3.5, cy + px, px, px * 2, color);
        rect(cx + px * 2.5, cy + px, px, px * 2, color);
      } else if (kind === "flat") {
        rect(cx - px * 2, cy + px * 2, px * 4, px, color);
      } else if (kind === "open") {
        rect(cx - px * 1.5, cy + px * 1.5, px * 3, px * 2, color);
      } else if (kind === "sleep") {
        rect(cx - px * 2, cy + px * 2.4, px * 4, px * 0.7, color);
      }
    }
    function draw(t) {
      ctx.fillStyle = FACE_BG;
      ctx.fillRect(0, 0, W, H);
      var color = state === "alarm" ? FACE_RED : FACE_MINT;
      var blink = state === "idle" && !reduceMotion && (t % 3200) > 3000;
      var ex = px * 4;
      if (state === "sleepy") {
        eye(cx - ex, cy, false, color); eye(cx + ex, cy, false, color);
        mouth("sleep", color);
        if (!reduceMotion) { // floating Z
          var zoff = (t / 900) % 3;
          ctx.fillStyle = color; ctx.font = "700 22px 'Space Mono', monospace";
          ctx.fillText("z", cx + px * 7, cy - px * 3 - zoff * 12);
        }
      } else if (state === "happy") {
        eye(cx - ex, cy, true, color); eye(cx + ex, cy, true, color);
        mouth("smile", color);
      } else if (state === "alarm") {
        var on = reduceMotion || (t % 800) < 400;
        if (on) { eye(cx - ex, cy, true, color); eye(cx + ex, cy, true, color); mouth("open", color); }
      } else if (state === "listening") {
        eye(cx - ex, cy, true, color); eye(cx + ex, cy, true, color);
        mouth("smile", color);
        if (!reduceMotion) { // sound bars
          for (var i = 0; i < 5; i++) {
            var h = px * (1 + Math.abs(Math.sin(t / 300 + i)) * 2.4);
            rect(cx - px * 5 + i * px * 2.4, cy + px * 5.4 - h, px * 1.2, h, color);
          }
        }
      } else if (state === "message") {
        eye(cx - ex, cy, true, color); eye(cx + ex, cy, true, color);
        mouth("smile", color);
        if (!reduceMotion && (t % 1600) < 800) { // heart
          rect(cx + px * 6, cy - px * 4, px * 3, px * 2, FACE_RED);
        }
      } else if (state === "focus") {
        eye(cx - ex, cy, true, color); eye(cx + ex, cy, true, color);
        mouth("flat", color);
      } else { // idle
        eye(cx - ex, cy, !blink, color); eye(cx + ex, cy, !blink, color);
        mouth("flat", color);
      }
      if (caption) {
        ctx.fillStyle = color;
        ctx.font = "700 40px 'Space Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(caption, cx, H - 34);
        ctx.textAlign = "left";
      }
      // corner ticks
      ctx.strokeStyle = "rgba(111,231,184,0.35)"; ctx.lineWidth = 2;
      [[14, 14, 1, 1], [W - 14, 14, -1, 1], [14, H - 14, 1, -1], [W - 14, H - 14, -1, -1]].forEach(function (c) {
        ctx.beginPath();
        ctx.moveTo(c[0], c[1] + 12 * c[3]); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0] + 12 * c[2], c[1]);
        ctx.stroke();
      });
    }
    if (reduceMotion) { draw(0); }
    else {
      (function loop() { draw(performance.now()); requestAnimationFrame(loop); })();
    }
  });

  /* ---------- live Halifax desk clock ---------- */
  var clockEl = document.getElementById("live-clock");
  var dateEl = document.getElementById("live-date");
  if (clockEl) {
    var fmtT = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Halifax", hour: "2-digit", minute: "2-digit", hour12: false });
    var fmtD = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Halifax", weekday: "long", month: "long", day: "numeric" });
    var tick = function () {
      var now = new Date();
      clockEl.textContent = fmtT.format(now);
      if (dateEl) dateEl.textContent = fmtD.format(now) + " - HALIFAX, NS";
    };
    tick();
    setInterval(tick, 10000);
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
