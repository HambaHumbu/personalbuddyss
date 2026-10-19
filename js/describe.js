/* Personal Buddy - "Describe Your Buddy" prototype.
   Client-side concept: maps a natural-language sentence to the strict
   config schema with deterministic keyword rules and the same pricing
   engine as the configurator. A production build would call an LLM with
   Zod validation server-side; this prototype never sets prices by model
   output and every request gets human review before any money is taken. */

(function () {
  "use strict";
  var root = document.getElementById("describe-buddy");
  if (!root) return;

  var TIER_PRICE = { starter: 259, smart: 289, premium: 335, custom: 399, voice: 1049 };
  var TYPE_ADD = { robot: 0, cat: 10, dog: 10, alien: 15, gamer: 20, space: 15, love: 15, custom: 60 };
  var FEAT_PRICE = { pomodoro: 15, touch: 25, weather: 20, messages: 15, motion: 25, bluetooth: 20 };
  var FEAT_TIER = {
    clock: "starter", alarm: "starter", timer: "starter", face: "starter", sounds: "starter",
    temperature: "smart", humidity: "smart", wifi: "smart", rgb: "smart",
    pomodoro: "smart", touch: "smart", motion: "smart", bluetooth: "smart",
    weather: "premium", messages: "premium", voice: "voice"
  };
  var TIER_RANK = { starter: 0, smart: 1, premium: 2, custom: 3, voice: 4 };

  var KEYWORDS = [
    [/\bcat\b|kitten|kitty/, "cat", "type"], [/\bdog\b|puppy/, "dog", "type"],
    [/\balien\b|martian/, "alien", "type"], [/\bgamer\b|gaming|esports/, "gamer", "type"],
    [/\bspace\b|astronaut|rocket/, "space", "type"], [/\blove\b|valentine|girlfriend|boyfriend|wife|husband|partner/, "love", "type"],
    [/\brobot\b|bot|droid/, "robot", "type"],
    [/\bblack\b/, "black", "colour"], [/\bwhite\b/, "white", "colour"],
    [/\bred\b/, "red", "colour"], [/\bgreen\b|mint/, "green", "colour"],
    [/\bblue\b/, "blue", "colour"], [/\bpurple\b/, "purple", "colour"], [/\bpink\b/, "pink", "colour"],
    [/\btime\b|\bclock\b|shows? the time|what time/, "clock", "feature"],
    [/\balarm\b|wake.?me|wake.?up/, "alarm", "feature"],
    [/\btimer\b|countdown/, "timer", "feature"],
    [/\bpomodoro\b|focus/, "pomodoro", "feature"],
    [/\btemp(erature)?\b|degrees|how (hot|cold)/, "temperature", "feature"],
    [/\bhumidity\b|humid/, "humidity", "feature"],
    [/\bweather\b|forecast|rain|snow/, "weather", "feature"],
    [/\brgb\b|lights?|glow|led/, "rgb", "feature"],
    [/\btouch\b|tap/, "touch", "feature"],
    [/\bmotion\b|movement|detect/, "motion", "feature"],
    [/\bface\b|smile|expression/, "face", "feature"],
    [/\bmessages?\b|say |says |remind|display.*text|shows?.*message/, "messages", "feature"],
    [/\bwifi\b|wi-fi|internet/, "wifi", "feature"],
    [/\bbluetooth\b/, "bluetooth", "feature"],
    [/\bvoice\b|talk|speak|hey buddy|assistant|music/, "voice", "feature"],
    [/\bsound\b|buzzer|beep|chime/, "sounds", "feature"]
  ];
  var UNSUPPORTED = [
    [/\bwalk\b|\brun\b|\bmove (its|their) (legs|arms)\b/, "walking / locomotion"],
    [/\bfly\b|\bflying\b|drone/, "flight"],
    [/\bcamera\b|video call/, "camera / video calls"]
  ];

  function money(n) { return "$" + n.toFixed(0); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function parse(text) {
    var t = " " + text.toLowerCase() + " ";
    var type = "robot", colour = "green", features = {}, unsupported = [];
    var confidence = 0, hits = 0;
    KEYWORDS.forEach(function (k) {
      if (k[0].test(t)) {
        hits++;
        if (k[2] === "type") { type = k[1]; confidence += 2; }
        else if (k[2] === "colour") { colour = k[1]; confidence += 2; }
        else { features[k[1]] = true; confidence += 1; }
      }
    });
    UNSUPPORTED.forEach(function (u) {
      if (u[0].test(t)) unsupported.push(u[1]);
    });
    // schedules: "at 8 AM" / "every morning at 8" with nearby quoted text
    var schedules = [];
    var re = /(?:at|every morning at|each morning at)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi, m;
    while ((m = re.exec(text)) !== null) {
      var h = parseInt(m[1], 10), min = m[2] ? parseInt(m[2], 10) : 0;
      var ap = (m[3] || "").toLowerCase();
      if (ap === "pm" && h < 12) h += 12;
      if (ap === "am" && h === 12) h = 0;
      var qm = /["']([^"']{1,60})["']/.exec(text.slice(Math.max(0, m.index - 80), m.index + 40));
      schedules.push({ time: ("0" + h).slice(-2) + ":" + ("0" + min).slice(-2), text: qm ? qm[1] : "" });
      features.messages = true;
    }
    // name: "named X" / "called X"
    var name = "", nm = /(?:named|called)\s+([A-Za-z]{2,20})/i.exec(text);
    if (nm) name = nm[1];

    var featList = Object.keys(features);
    var tier = "starter";
    featList.forEach(function (f) {
      var need = FEAT_TIER[f] || "starter";
      if (TIER_RANK[need] > TIER_RANK[tier]) tier = need;
    });
    if (type === "custom") tier = "custom";

    var total = TIER_PRICE[tier] + (TYPE_ADD[type] || 0);
    featList.forEach(function (f) { total += FEAT_PRICE[f] || 0; });

    var needsReview = unsupported.length > 0 || type === "custom" || confidence < 3 || schedules.length > 0;
    return {
      buddy_type: type, colours: [colour], features: featList,
      personality: { name: name, greeting: "", traits: [] },
      schedules: schedules, display_messages: [],
      recommended_tier: tier, unsupported_requests: unsupported,
      needs_human_review: needsReview,
      confidence: Math.min(100, 20 + confidence * 12),
      price: total
    };
  }

  var form = document.getElementById("describe-form");
  var input = document.getElementById("describe-input");
  var out = document.getElementById("describe-output");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (text.length < 10) {
      out.innerHTML = '<p class="hint">Give me a little more detail, at least a full sentence.</p>';
      return;
    }
    var r = parse(text);
    var featNames = { clock: "Smart Clock", alarm: "Alarm", timer: "Timer", face: "Animated Face", sounds: "Sounds", temperature: "Temperature", humidity: "Humidity", wifi: "Wi-Fi", rgb: "RGB Lighting", pomodoro: "Pomodoro", touch: "Touch", weather: "Weather", messages: "Custom Messages", motion: "Motion", bluetooth: "Bluetooth", voice: "Voice" };
    var html = '<div class="card corner-ticks">' +
      '<p class="spec">Proposed configuration (concept)</p>' +
      "<ul class='checklist'>" +
      "<li><strong>Type:</strong> " + esc(r.buddy_type) + "</li>" +
      "<li><strong>Colour:</strong> " + esc(r.colours[0]) + "</li>" +
      "<li><strong>Tier:</strong> " + esc(r.recommended_tier) + "</li>" +
      "<li><strong>Features:</strong> " + (r.features.length ? r.features.map(function (f) { return esc(featNames[f] || f); }).join(", ") : "basic set") + "</li>";
    if (r.personality.name) html += "<li><strong>Name:</strong> " + esc(r.personality.name) + "</li>";
    r.schedules.forEach(function (s) {
      html += "<li><strong>Schedule:</strong> " + esc(s.time) + (s.text ? " - " + esc(s.text) : "") + "</li>";
    });
    if (r.unsupported_requests.length) {
      html += "<li><strong>Needs discussion:</strong> " + r.unsupported_requests.map(esc).join(", ") + " are not in the current hardware plan.</li>";
    }
    html += "</ul>" +
      '<p style="font-family:var(--font-mono);font-size:1.6rem;color:var(--mint)">Estimated: ' + money(r.price) + ' CAD</p>' +
      '<p class="hint">Confidence ' + r.confidence + '%. ' +
      (r.needs_human_review ? "A human reviews this before anything is built." : "Looks straightforward.") +
      " Price is set by the pricing engine, not by this guess.</p>" +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px">' +
      '<button type="button" class="btn btn-primary" id="describe-request">Request My Buddy</button>' +
      '<a class="btn btn-ghost" href="build.html">Fine-tune in the configurator</a>' +
      "</div></div>";
    out.innerHTML = html;
    document.getElementById("describe-request").addEventListener("click", function () {
      var body = ["DESCRIBE YOUR BUDDY - request", "", "Customer wrote:", text, "",
        "Proposed config:", JSON.stringify(r, null, 2), "",
        "My details:", "Name: ", "Email: ", "City: "].join("\n");
      window.location.href = "mailto:support@personalbuddy.ca?subject=" +
        encodeURIComponent("Describe Your Buddy request") + "&body=" + encodeURIComponent(body);
    });
  });
})();
