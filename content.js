/* ============================================================
   CHRISTINE BURKE YOGA — EDITABLE CONTENT
   ------------------------------------------------------------
   This is the one file to edit for anything that changes often:
   the class schedule, upcoming workshops, prices, contact info.

   Rules of thumb:
   - Keep the quotes around text. Commas between items.
   - Lines starting with // are notes and are ignored by the site.
   - Save the file, reload the page, and the change is live.
   ============================================================ */

const SITE = {
  name: "Christine Burke Yoga",
  teacher: "Christine Burke",
  tagline: "Living a Liberated Life with Christine Burke",

  email: "christine@liberationyoga.com",
  instagram: "https://www.instagram.com/liberationyoga/",
  facebook: "https://www.facebook.com/LiberationYoga",     // confirmed by Christine (she's not active there)
  venmo: "@christine-burke-7",                             // from the SMHD page on the old site
  podcast: "https://open.spotify.com/show/2lyaKbhmM9ZGaH1FFcdNHY",

  // Where a "Register" button goes when a class has no link of its own.
  // Today: an email to Christine, who replies with the Zoom link. Zero cost.
  // Later, if she ever wants a booking tool, paste its URL here and every button follows.
  defaultRegister: "mailto:christine@liberationyoga.com?subject=Class%20registration",

  // Where "Book a consultation" goes. A free Calendly link works well here if she wants one.
  consultation: "mailto:christine@liberationyoga.com?subject=Free%2020-minute%20consultation",

  // THE CLASS SCHEDULE SPREADSHEET (optional).
  // Paste the Google Sheet link here and the site reads the schedule from the
  // sheet every time the page loads — Christine edits the sheet, nothing else.
  // Works with either link:
  //   the normal share link   https://docs.google.com/spreadsheets/d/ABC123/edit#gid=0
  //     (the sheet must be shared as "Anyone with the link — Viewer")
  //   or File > Share > Publish to web (CSV)
  // Leave it as "" and the site uses the SCHEDULE list further down instead.
  // If the sheet is ever unreachable, the site quietly falls back to that list too.
  scheduleSheet: "",
};

/* ------------------------------------------------------------
   CLASS TYPES
   Describe each class once here. The schedule below just names it.
   ------------------------------------------------------------ */
const CLASSES = {
  "Morning Magic": {
    level: "Level 1–2 · All welcome",
    blurb: "An inspired blend of Hatha, Iyengar and Vinyasa — moderate, strengthening and rejuvenating, infused with mudras, pranayama and guided meditation. Start the day uplifted, focused and relaxed.",
  },
  "Vitality Flow": {
    level: "All levels",
    blurb: "A Saturday flow to wake up the whole body — breath-led movement, balance and a long, sweet rest at the end.",  // TODO: Christine's own description
  },
};

/* ------------------------------------------------------------
   ZOOM YOGA WITH CHRISTINE — upcoming class dates
   One line per class. Date is YYYY-MM-DD. Past dates hide themselves,
   so you can keep adding to the bottom and never delete anything.
   Optional extras on any line:  price: "...",  register: "https://...",
   format: "In person" (default is Zoom).
   ------------------------------------------------------------ */
const SCHEDULE = [
  // *** Example dates in Christine's usual pattern — replace with her real list ***
  // Ignored while SITE.scheduleSheet above has a link in it (except as a fallback).
  { date: "2026-09-22", time: "9:30 – 10:45 AM", title: "Morning Magic" },
  { date: "2026-09-24", time: "9:30 – 10:45 AM", title: "Morning Magic" },
  { date: "2026-09-26", time: "10:15 – 11:30 AM", title: "Vitality Flow" },
  { date: "2026-09-29", time: "9:30 – 10:45 AM", title: "Morning Magic" },
  { date: "2026-10-01", time: "9:30 – 10:45 AM", title: "Morning Magic" },
  { date: "2026-10-03", time: "10:15 – 11:30 AM", title: "Vitality Flow" },
  { date: "2026-10-06", time: "9:00 – 10:15 AM", title: "Morning Magic" },
  { date: "2026-10-08", time: "9:30 – 10:45 AM", title: "Morning Magic" },
  { date: "2026-10-10", time: "10:15 – 11:30 AM", title: "Vitality Flow" },
];

// Shown on every class unless the line sets its own price.
const DEFAULT_PRICE = "$19 drop-in · series available";

/* ------------------------------------------------------------
   UPCOMING WORKSHOPS, POP-UPS, RETREATS
   Dated, one-off things. Delete an entry when it's passed.
   ------------------------------------------------------------ */
const EVENTS = [
  {
    date: "2026-10-04",
    dateLabel: "Sat, Oct 4",
    time: "10:00 AM – 12:00 PM PT",
    title: "Pop-Up: Breath & Hand Yoga Immersion",
    blurb: "A two-hour dive into pranayama and mudras from Christine's book — practical tools you can use the same day.",
    format: "In person",
    location: "Los Angeles · location sent on registration",
    price: "$45",
    register: "",
  },
  {
    date: "2026-10-15",
    dateLabel: "Wed, Oct 15",
    time: "7:00 PM PT · 6 weeks",
    title: "Spiritual Mental Health Diet — Fall Session",
    blurb: "40 days to a lighter, brighter you. Weekly live group sessions, practices for mind, body and spirit, a workbook, and every session recorded.",
    format: "Zoom",
    location: "Live online",
    price: "$325 early bird · $350 after",
    register: "#smhd",
  },
  {
    date: "2027-03-01",
    dateLabel: "Spring 2027",
    time: "Dates coming soon",
    title: "Healing Adventure Retreat",
    blurb: "A few days away to practice, rest, eat well and remember who you are. Location and dates announced to the newsletter first.",
    format: "In person",
    location: "TBA",
    price: "Details soon",
    register: "",
  },
];

/* ------------------------------------------------------------
   RATES
   ------------------------------------------------------------ */
const RATES = [
  { label: "First class",           price: "Free",  note: "Zoom or in person — just come." },
  { label: "Single class",          price: "$19",   note: "" },
  { label: "5-class series",        price: "$85",   note: "$17 per class" },
  { label: "10-class series",       price: "$160",  note: "$16 per class" },
  { label: "Seniors & students",    price: "$16",   note: "With current ID" },
  { label: "Private session",       price: "Ask",   note: "One-on-one, in person or online" },
];

/* ------------------------------------------------------------
   KIND WORDS
   Add  section: "classes" | "coaching" | "retreats" | "smhd"  to a quote
   and it also appears beside that part of the page. Quotes with no
   section only appear here in Kind words.
   ------------------------------------------------------------ */
const TESTIMONIALS = [
  {
    quote: "There's nobody on the planet that can't do some form of yoga.",
    who: "Christine, in Westways Magazine",
  },
  {
    quote: "Christine meets you exactly where you are and somehow gets you somewhere you didn't know you could go.",
    who: "A longtime student",   // TODO: placeholder — replace with real student quotes
    section: "classes",
  },
  {
    quote: "Yoga can only approach healing if you're in the right space. You should feel relaxed, safe, comfortable, and like you're inhabiting postures, not forcing them.",
    who: "Christine, on teaching with injuries",
  },
];

/* ------------------------------------------------------------
   PAST RETREAT PHOTOS
   Photos from retreats that have already happened. Drop the image files
   into the images/ folder and add a line each. Caption is optional.
   The whole section hides itself while this list is empty.
   ------------------------------------------------------------ */
const RETREAT_PHOTOS = [
  // { src: "images/retreat-costa-rica-1.jpg", caption: "Costa Rica, 2024" },
];
