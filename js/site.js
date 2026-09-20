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
  if (sched) {
    const upcoming = SCHEDULE.filter((c) => c.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
    sched.innerHTML = upcoming.length ? upcoming.map((c) => {
      const info = (typeof CLASSES !== "undefined" && CLASSES[c.title]) || {};
      const { day, md } = prettyDate(c.date);
      const format = c.format || "Zoom";
      return `
      <li>
        <div class="when">${day} · ${md}<small>${esc(c.time)} PT</small></div>
        <div class="what">
          <h3>${esc(c.title)}</h3>
          ${info.blurb ? `<p class="blurb">${esc(info.blurb)}</p>` : ""}
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
