/* Renders the parts of the page that come from content.js.
   You shouldn't need to edit this file to update the site. */

(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (url) => url && url.trim() ? url : SITE.defaultRegister;
  const tagClass = (format) => {
    const f = (format || "").toLowerCase();
    if (f.includes("zoom") || f.includes("online")) return "zoom";
    if (f.includes("hybrid")) return "hybrid";
    return "person";
  };

  /* --- upcoming class dates, soonest first, past ones hidden --- */
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const todayKey = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })();
  const prettyDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return { day: DAYS[dt.getDay()], md: `${MONTHS[m - 1]} ${d}` };
  };

  const sched = document.getElementById("schedule-list");
  const renderSchedule = (list) => {
    if (!sched) return;
    const upcoming = list.filter((c) => c.date && c.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
    sched.innerHTML = upcoming.length ? upcoming.map((c) => {
      const info = (typeof CLASSES !== "undefined" && CLASSES[c.title]) || {};
      const { day, md } = prettyDate(c.date);
      const format = c.format || "Zoom";
      const blurb = info.blurb;
      return `
      <li>
        <div class="when">${day} · ${md}<small>${esc(c.time)} PT</small></div>
        <div class="what">
          <h3>${esc(c.title)}</h3>
          ${blurb ? `<p class="blurb">${esc(blurb)}</p>` : ""}
          ${c.note ? `<p class="blurb note">${esc(c.note)}</p>` : ""}
          <div class="meta">
            <span class="tag ${tagClass(format)}">${esc(format)}</span>
            ${info.level ? `<span>${esc(info.level)}</span>` : ""}
          </div>
        </div>
        <div class="act">
          <a class="btn small" href="${esc(link(c.register))}">Register</a>
          <span class="price">${esc(c.price || (typeof DEFAULT_PRICE !== "undefined" ? DEFAULT_PRICE : ""))}</span>
        </div>
      </li>`;
    }).join("")
      : `<li><p class="muted">No classes on the calendar right now — join the newsletter below and you'll hear the moment new dates are up.</p></li>`;
  };

  // Paint whatever is in content.js straight away, so the page is never empty.
  renderSchedule(typeof SCHEDULE !== "undefined" ? SCHEDULE : []);

  /* --- optional: read the schedule from Christine's Google Sheet --------------
     SITE.scheduleSheet can be a normal share link or a "publish to web" CSV link.
     Either way we end up asking Google for plain CSV. If anything at all goes
     wrong — no link, sheet not shared, no internet — the list above just stays. */
  const csvUrl = (raw) => {
    const u = String(raw || "").trim();
    if (!u) return "";
    if (/output=csv|tqx=out:csv/.test(u)) return u;                 // already a CSV link
    if (u.includes("/spreadsheets/d/e/")) {                         // published-to-web link
      return u.split("#")[0].replace(/\/(pubhtml|pub).*$/, "/pub") + "?single=true&output=csv";
    }
    const id = u.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);      // normal share link
    if (!id) return "";
    const gid = (u.match(/[#&?]gid=(\d+)/) || [])[1] || "0";
    return `https://docs.google.com/spreadsheets/d/${id[1]}/gviz/tq?tqx=out:csv&gid=${gid}`;
  };

  // Minimal CSV reader: handles quoted fields, commas and newlines inside quotes.
  const parseCsv = (text) => {
    const rows = [[""]];
    let quoted = false;
    for (let k = 0; k < text.length; k++) {
      const ch = text[k], row = rows[rows.length - 1];
      if (quoted) {
        if (ch === '"' && text[k + 1] === '"') { row[row.length - 1] += '"'; k++; }
        else if (ch === '"') quoted = false;
        else row[row.length - 1] += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ",") row.push("");
      else if (ch === "\n") rows.push([""]);
      else if (ch !== "\r") row[row.length - 1] += ch;
    }
    return rows.map((r) => r.map((c) => c.trim()));
  };

  const MONTH_NAMES = {};
  MONTHS.forEach((m, n) => { MONTH_NAMES[m.toLowerCase()] = n + 1; });
  const pad = (n) => String(n).padStart(2, "0");

  // Whatever Google hands us for a date, turn it into 2026-10-13.
  const toIso = (v) => {
    const t = String(v || "").trim();
    if (!t) return "";
    let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);                       // 2026-10-13
    if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
    m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);                        // 10/13/2026
    if (m) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`;
    m = t.match(/^([A-Za-z]{3,})\s+(\d{1,2}),?\s*(\d{4})?/);               // Oct 13, 2026
    if (m) {
      const mo = MONTH_NAMES[m[1].slice(0, 3).toLowerCase()];
      if (mo) return `${m[3] || new Date().getFullYear()}-${pad(mo)}-${pad(m[2])}`;
    }
    const d = new Date(t);                                                  // last resort
    return isNaN(d) ? "" : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const sheet = csvUrl(typeof SITE !== "undefined" && SITE.scheduleSheet);
  if (sched && sheet) {
    fetch(sheet, { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => {
        const rows = parseCsv(text).filter((r) => r.some((c) => c));
        if (rows.length < 2) return;
        // Column order doesn't matter — we go by the header names.
        const head = rows[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
        const col = (...names) => { for (const n of names) { const i = head.indexOf(n); if (i > -1) return i; } return -1; };
        const ix = {
          date: col("date"), time: col("time", "times"), title: col("class", "classname", "title"),
          price: col("price", "cost"), format: col("format", "where", "location"),
          register: col("register", "link", "signup", "signuplink"), note: col("note", "notes", "description"),
        };
        if (ix.date < 0) return;                      // no date column: not a schedule, leave the page alone
        const at = (row, i) => (i > -1 ? row[i] || "" : "");
        const list = rows.slice(1).map((row) => ({
          date: toIso(at(row, ix.date)),
          time: at(row, ix.time),
          title: at(row, ix.title) || "Class",
          price: at(row, ix.price),
          format: at(row, ix.format),
          register: at(row, ix.register),
          note: at(row, ix.note),
        })).filter((c) => c.date);
        if (list.length) renderSchedule(list);
      })
      .catch(() => { /* sheet unreachable — the content.js list stays up */ });
  }

  /* --- upcoming events, soonest first, past ones hidden --- */
  const ev = document.getElementById("events-list");
  if (ev) {
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = EVENTS.filter((e) => !e.date || e.date >= today).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    ev.innerHTML = upcoming.length ? upcoming.map((e) => `
      <article class="event">
        <div class="date">${esc(e.dateLabel)}<small>${esc(e.time)}</small></div>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.blurb)}</p>
        <div class="meta">
          <span class="tag ${tagClass(e.format)}">${esc(e.format)}</span>
          <span>${esc(e.location)}</span>
        </div>
        <div class="foot">
          <span class="price">${esc(e.price)}</span>
          <a class="btn small ghost" href="${esc(link(e.register))}">Sign up</a>
        </div>
      </article>`).join("")
      : `<p class="muted">Nothing on the calendar just yet — join the newsletter below to hear first.</p>`;
  }

  /* --- rates --- */
  const rates = document.getElementById("rates-list");
  if (rates) {
    rates.innerHTML = RATES.map((r) => `
      <li>
        <span class="label">${esc(r.label)}</span>
        <span class="price">${esc(r.price)}</span>
        ${r.note ? `<span class="note">${esc(r.note)}</span>` : ""}
      </li>`).join("");
  }

  /* --- kind words --- */
  const q = document.getElementById("quotes-list");
  if (q) {
    q.innerHTML = TESTIMONIALS.map((t) => `
      <blockquote>
        <p>${esc(t.quote)}</p>
        <cite>${esc(t.who)}</cite>
      </blockquote>`).join("");
  }

  /* --- contact details from SITE --- */
  document.querySelectorAll("[data-site]").forEach((el) => {
    const key = el.getAttribute("data-site");
    const val = SITE[key];
    if (!val) return;
    if (el.tagName === "A") {
      if (key === "email") el.href = "mailto:" + val;
      else if (key === "phone") el.href = "tel:" + val.replace(/[^\d+]/g, "");
      else el.href = val;
    }
    if (!el.hasAttribute("data-keep-text")) el.textContent = val;
  });
  document.querySelectorAll("[data-register]").forEach((a) => { a.href = SITE.defaultRegister; });
  document.querySelectorAll("[data-consult]").forEach((a) => { a.href = SITE.consultation || SITE.defaultRegister; });
  // hide the podcast button until there's a link
  document.querySelectorAll('[data-site="podcast"]').forEach((a) => { if (!SITE.podcast) a.textContent = "Link coming soon"; });

  /* --- a quote beside a section, for any testimonial with section: "..." --- */
  document.querySelectorAll("[data-quote]").forEach((slot) => {
    const want = slot.getAttribute("data-quote");
    const t = (typeof TESTIMONIALS !== "undefined" ? TESTIMONIALS : []).find((x) => x.section === want);
    if (!t) { slot.hidden = true; return; }
    slot.innerHTML = `<blockquote><p>${esc(t.quote)}</p><cite>${esc(t.who)}</cite></blockquote>`;
  });

  /* --- past retreat photos (section hides itself when the list is empty) --- */
  const gal = document.getElementById("retreat-gallery");
  if (gal) {
    const photos = (typeof RETREAT_PHOTOS !== "undefined" ? RETREAT_PHOTOS : []).filter((p) => p && p.src);
    const section = gal.closest("section");
    if (!photos.length) { if (section) section.hidden = true; }
    else gal.innerHTML = photos.map((p) => `
      <figure>
        <img src="${esc(p.src)}" alt="${esc(p.caption || "On retreat with Christine")}" loading="lazy">
        ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}
      </figure>`).join("");
  }

  /* --- mobile nav --- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  /* --- newsletter placeholder (no backend wired yet) --- */
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector(".form-note");
      if (note) note.textContent = "Thanks — sign-up isn't connected yet on this demo, but it will be.";
    });
  }

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
