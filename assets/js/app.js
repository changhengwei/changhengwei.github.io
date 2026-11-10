/* app.js
   Builds the page from the data files in data/, then wires up the
   interactions. Plain browser JS, no build step. */
(function () {
  "use strict";

  /* Icons. Kept here so the markup stays readable. */
  var ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 5 18.3 5.3 18.3 5.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6 9 7 9-7"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.76V1.74C24 .78 23.2 0 22.22 0z"/></svg>',
    cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M21 3l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.2 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.2s7-5.7 7-11.2a7 7 0 1 0-14 0c0 5.5 7 11.2 7 11.2z"/><circle cx="12" cy="9.8" r="2.6"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.9"/><path d="M4.6 20.2a7.4 7.4 0 0 1 14.8 0"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10.2 8.4 16 12l-5.8 3.6z"/></svg>'
  };

  /* Small DOM helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function qs(name) { return new URLSearchParams(location.search).get(name); }

  /* Jelly spring runner for the nav chips.
     The chosen chip swells and shoves its neighbours outward. Three
     springs per chip drive translateX, scaleX and scaleY, so the growth
     squashes and wobbles instead of scaling uniformly. Only transforms
     are written: the glass look and colours are left alone. */
  function createJelly(links) {
    if (!links.length) return { switchTo: function () {} };
    var reduce = !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var current = -1;
    var raf = 0, last = 0;

    function spring(k, m, bounce) {
      return { k: k, m: m, d: 2 * Math.sqrt(k * m) * (1 - bounce) };
    }
    function channel(p) {
      return { p: p, v: 0, t: p, cfg: null, startAt: 0, running: false };
    }
    var chips = links.map(function () {
      return { x: channel(0), sx: channel(1), sy: channel(1) };
    });

    function step(c, dt) {
      var s = c.cfg;
      var a = (-s.k * (c.p - c.t) - s.d * c.v) / s.m;
      c.v += a * dt;
      c.p += c.v * dt;
      if (Math.abs(c.p - c.t) < 0.0005 && Math.abs(c.v) < 0.0005) {
        c.p = c.t; c.v = 0; c.running = false;
      }
    }

    function write() {
      chips.forEach(function (chip, i) {
        links[i].style.transform = "translateX(" + chip.x.p.toFixed(3) +
          "px) scale(" + chip.sx.p.toFixed(4) + ", " + chip.sy.p.toFixed(4) + ")";
      });
    }

    function tick(now) {
      var elapsed = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      var n = Math.max(1, Math.round(elapsed / (1 / 120)));
      var h = elapsed / n;
      var alive = false;
      chips.forEach(function (chip) {
        ["x", "sx", "sy"].forEach(function (key) {
          var c = chip[key];
          if (!c.running) return;
          if (now < c.startAt) { alive = true; return; }
          for (var i = 0; i < n; i++) step(c, h);
          if (c.running) alive = true;
        });
      });
      write();
      raf = alive ? requestAnimationFrame(tick) : 0;
    }

    function set(c, target, cfg, delay, instant, now) {
      c.t = target;
      if (instant || reduce) {
        c.p = target; c.v = 0; c.running = false; c.cfg = null;
      } else {
        c.cfg = cfg; c.startAt = now + delay * 1000; c.running = true;
      }
    }

    function switchTo(sel, instant) {
      if (sel < 0 || sel >= chips.length) return;
      if (sel === current && !instant) return;
      current = sel;

      // Narrow screens have no spare room inside the pill, so the barge
      // is toned down there. The swell and the spring wobble stay.
      var small = window.innerWidth <= 760;
      var SWELL = small ? 0.09 : 0.16;
      var BARGE = small ? 0 : 4;
      var SHRINK = 0.04, JELLY = 1, BOUNCE = 0.25,
          STAGGER = 0.022, STIFFNESS = 580;
      var rtl = getComputedStyle(links[0].parentElement).direction === "rtl";
      var push = (links[sel].offsetWidth * SWELL) / 2 + BARGE;
      var now = (window.performance && performance.now) ? performance.now() : Date.now();

      chips.forEach(function (chip, i) {
        var far = Math.abs(i - sel);
        var dir = (i === sel ? 0 : (i < sel ? -1 : 1)) * (rtl ? -1 : 1);
        var x = dir * push;
        var s = i === sel ? 1 + SWELL : 1 - SHRINK;
        var k = STIFFNESS * (1 - 0.12 * Math.min(far, 3));
        var inFlight = chip.x.running || chip.sx.running || chip.sy.running;
        var delay = inFlight ? 0 : far * STAGGER;
        var j = JELLY;
        set(chip.x, x, spring(k, 0.9, BOUNCE), delay, instant, now);
        set(chip.sx, s, spring(k * (1 + 0.24 * j), 0.9 - 0.1 * j,
            Math.min(0.85, BOUNCE + 0.3 * j)), delay, instant, now);
        set(chip.sy, s, spring(k * (1 - 0.14 * j), 0.9 + 0.05 * j, BOUNCE),
            delay + 0.05 * j, instant, now);
      });

      if (instant || reduce) { write(); return; }
      if (!raf) { last = now; raf = requestAnimationFrame(tick); }
    }

    return { switchTo: switchTo };
  }

  /* 1. Navbar */
  function initNav() {
    var nav = $(".nav");
    if (!nav) return;
    var onHome = /\/(index\.html)?$/.test(location.pathname) || location.pathname.endsWith("/");
    var links = $all(".nav-links a[data-anchor]");
    // A detail page needs index.html in front of the hash.
    links.forEach(function (a) {
      a.setAttribute("href", (onHome ? "#" : "index.html#") + a.dataset.anchor);
    });

    var lastY = window.scrollY;
    var holdUntil = 0;
    var pendingAnchor = null;  // click target; the observer is muted until it arrives
    var safetyTimer = 0;

    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      // Keep the pill visible for the whole click-scroll. Normal
      // scroll-down hiding resumes once it is over.
      if (Date.now() < holdUntil || pendingAnchor) {
        nav.classList.remove("hide"); lastY = y; return;
      }
      if (y > lastY && y > 240) nav.classList.add("hide");
      else nav.classList.remove("hide");
      lastY = y;
    }, { passive: true });

    var jelly = createJelly(links);

    function highlight(id) {
      var index = -1;
      links.forEach(function (a, i) {
        var on = a.dataset.anchor === id;
        a.classList.toggle("active", on);
        if (on) index = i;
      });
      if (index >= 0) jelly.switchTo(index);
    }

    function clearPending() {
      pendingAnchor = null;
      clearTimeout(safetyTimer);
    }

    links.forEach(function (a, i) {
      a.addEventListener("click", function () {
        nav.classList.remove("hide");
        holdUntil = Date.now() + 900;
        // Light the clicked chip and send the jelly straight to it. The
        // observer below stays muted during the smooth scroll, so the pill
        // never glides through the sections in between.
        pendingAnchor = a.dataset.anchor;
        links.forEach(function (l, j) { l.classList.toggle("active", j === i); });
        jelly.switchTo(i);
        clearTimeout(safetyTimer);
        safetyTimer = setTimeout(clearPending, 1600);
      });
    });

    // Highlight the nav link for whichever section is on screen.
    var sections = $all("section[id]");
    if (sections.length) {
      var io = new IntersectionObserver(function (entries) {
        if (pendingAnchor) {
          var target = pendingAnchor;
          var arrived = false;
          entries.forEach(function (e) {
            if (e.isIntersecting && e.target.id === target) arrived = true;
          });
          if (!arrived) return;          // skip every section passed on the way
          clearPending();
          highlight(target);             // land on the clicked section only
          return;
        }
        entries.forEach(function (e) {
          if (e.isIntersecting) highlight(e.target.id);
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  /* 2. Theme toggle. Light is the default. */
  function initTheme() {
    var btn = $("#theme-toggle");
    if (!btn) return;
    var root = document.documentElement;

    function sync() {
      var isDark = root.getAttribute("data-theme") !== "light";
      btn.setAttribute("aria-checked", String(isDark));
      btn.setAttribute("aria-label", isDark
        ? "Dark mode on. Click to switch to light mode"
        : "Dark mode off. Click to switch to dark mode");
      btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    }

    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("chw-theme", next); } catch (e) {}
      sync();
    });

    sync();
  }

  /* 3. Scroll reveal */
  function initMotion() {
    // Fade sections in as they enter the viewport.
    var reveals = $all(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* 4. Card spotlight */
  function initSpotlight() {
    $all(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* 5. Home grids */
  function renderHome() {
    // Projects
    var pg = $("#projects-grid");
    if (pg && window.PROJECTS) {
      var pc = $("#proj-count"); if (pc) pc.textContent = window.PROJECTS.length;
      if (!window.PROJECTS.length) {
        pg.innerHTML = '<div class="empty reveal">' +
          '<h3>Nothing published yet</h3>' +
          '<p>Projects land here as they ship. Until then, my code is on ' +
          '<a href="https://github.com/changhengwei" target="_blank" rel="noopener" style="color:var(--accent)">GitHub</a>.</p></div>';
      } else {
        pg.innerHTML = window.PROJECTS.map(function (p) {
          return '' +
            '<a class="card reveal" href="project.html?id=' + p.id + '">' +
              '<div class="thumb"><img src="' + p.cover + '" alt="' + p.title + '" loading="lazy"></div>' +
              '<div class="meta">' + p.category + ' · ' + p.year + '</div>' +
              '<h3>' + p.title + '</h3>' +
              '<p>' + p.summary + '</p>' +
              '<div class="row">' +
                '<div class="chips">' + p.stack.slice(0, 3).map(function (s) { return '<span class="chip">' + s + '</span>'; }).join("") + '</div>' +
                '<span class="arrow">View' + ICON.arrow + '</span>' +
              '</div>' +
            '</a>';
        }).join("");
      }
    }

    var eg = $("#events-grid");
    if (eg && window.EVENTS) {
      var ec = $("#event-count"); if (ec) ec.textContent = window.EVENTS.length;
      if (!window.EVENTS.length) {
        eg.innerHTML = '<div class="empty reveal">' +
          '<h3>No events logged yet</h3>' +
          '<p>Industrial talks, site visits and hackathons get documented here with photos.</p></div>';
      } else {
        eg.innerHTML = window.EVENTS.map(function (e) {
          var videoBadge = e.video ? '<span class="badge">' + ICON.play + ' Video</span>' : '';
          var media = e.cover
            ? '<div class="evt-img"><img src="' + e.cover + '" alt="Event poster — ' + e.title + '" loading="lazy">' + videoBadge + '</div>'
            : '<div class="evt-img evt-img--empty"><span style="color:var(--accent)">' + ICON.cert + '</span></div>';
          return '' +
            '<a class="card evt-card reveal" href="event.html?id=' + e.id + '">' +
              media +
              '<div class="evt-body">' +
                '<h3 class="evt-name">' + e.title + '</h3>' +
                '<div class="evt-meta">' +
                  '<span class="evt-type">' + e.type + '</span>' +
                  '<span class="evt-when">' + e.date + '</span>' +
                  '<span class="evt-speaker">' + e.presenter + '</span>' +
                '</div>' +
                '<p class="evt-desc">' + e.summary + '</p>' +
                '<span class="arrow evt-cta">Read the full recap' + ICON.arrow + '</span>' +
              '</div>' +
            '</a>';
        }).join("");

        // Save the scroll position so "back" lands on this card, not the top.
        $all(".evt-card", eg).forEach(function (card) {
          card.addEventListener("click", function () {
            try {
              var y = card.getBoundingClientRect().top + window.scrollY;
              sessionStorage.setItem("chw:event-anchor", String(Math.round(y)));
            } catch (e) {}
          });
        });
      }
    }

    var cg = $("#certs-grid");
    if (cg && window.CERTS) {
      var cc = $("#cert-count"); if (cc) cc.textContent = window.CERTS.length;
      if (!window.CERTS.length) {
        cg.innerHTML = '<div class="empty reveal"><h3>No certificates yet</h3>' +
          '<p>Completed courses and certifications will be listed here.</p></div>';
      } else {
        cg.innerHTML = window.CERTS.map(function (c) {
          var name = c.name || c.title;
          var media = c.image
            ? '<div class="cert-img"><img src="' + c.image + '" alt="Certificate of completion — ' + name + '" loading="lazy"></div>'
            : '<div class="cert-img cert-img--empty"><span style="color:var(--accent)">' + ICON.cert + '</span></div>';
          var iss = '<span class="cert-iss">' + c.issuer + ' · ' + c.date + '</span>';
          var detail = c.detail ? '<span class="cert-detail">' + c.detail + '</span>' : '';
          var cta = c.link ? '<span class="arrow cert-cta">View verified certificate' + ICON.ext + '</span>' : '';
          var link = c.link ? ' href="' + c.link + '" target="_blank" rel="noopener noreferrer" aria-label="View verified certificate: ' + name + ' (opens in a new tab)"' : '';
          return '' +
            '<a class="card cert reveal"' + link + '>' +
              media +
              '<div class="cert-body">' +
                '<h3 class="cert-name">' + name + '</h3>' +
                '<div class="cert-meta">' + iss + detail + '</div>' +
                '<p class="cert-desc">' + c.desc + '</p>' +
                cta +
              '</div>' +
            '</a>';
        }).join("");
      }
    }

    // Bind the spotlight to the cards we just created.
    initSpotlight();
  }

  /* 6. Project detail page */
  function renderProjectDetail() {
    var root = $("#project-detail");
    if (!root || !window.PROJECTS) return;
    var p = window.PROJECTS.filter(function (x) { return x.id === qs("id"); })[0];
    if (!p) { root.innerHTML = '<p class="muted">Project not found.</p>' +
      '<a class="back" href="index.html#projects">' + ICON.back + 'Back to projects</a>'; return; }

    var links = "";
    if (p.live) links += '<a class="btn btn-primary" href="' + p.live + '" target="_blank" rel="noopener">Live site ' + ICON.ext + '</a>';
    if (p.source) links += '<a class="btn" href="' + p.source + '" target="_blank" rel="noopener">' + ICON.github + ' Source code</a>';

    root.innerHTML = '' +
      '<a class="back" href="index.html#projects">' + ICON.back + 'All projects</a>' +
      '<div class="meta">' + p.category + ' · ' + p.year + '</div>' +
      '<h1>' + p.title + '</h1>' +
      '<p class="lead">' + p.tagline + '</p>' +
      '<div class="detail-cover"><img src="' + p.cover + '" alt="' + p.title + '"></div>' +
      '<div class="detail-body">' +
        '<div class="prose">' +
          '<h2>About this project</h2>' +
          '<p>' + p.description + '</p>' +
          '<h2>Key takeaways</h2>' +
          '<ul class="takeaways">' + p.takeaways.map(function (t) { return '<li>' + t + '</li>'; }).join("") + '</ul>' +
        '</div>' +
        '<aside class="aside">' +
          '<h3>Details</h3>' +
          '<div class="kv"><span>Category</span><b>' + p.category + '</b></div>' +
          '<div class="kv"><span>Year</span><b>' + p.year + '</b></div>' +
          '<div class="kv"><span>Stack</span><b>' + p.stack.join(", ") + '</b></div>' +
          '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">' + links + '</div>' +
        '</aside>' +
      '</div>';
    document.title = p.title + " · Chang Heng Wei";
  }

  /* 7. Event detail page */
  function renderEventDetail() {
    var root = $("#event-detail");
    if (!root || !window.EVENTS) return;
    /* With no id in the URL, show the only event instead of "not found". */
    var id = qs("id");
    var e = id
      ? window.EVENTS.filter(function (x) { return x.id === id; })[0]
      : window.EVENTS[0];
    if (!e) { root.innerHTML = '<p class="muted">Event not found.</p>' +
      '<a class="back" href="index.html#events">' + ICON.back + 'Back to events</a>'; return; }

    /* Poster on the left, headline and facts on the right. */
    var poster = e.cover
      ? '<figure class="evt-poster"><img src="' + e.cover + '" alt="Event poster — ' + e.title + '"></figure>'
      : '';

    var facts = [
      { ico: ICON.calendar, lab: "Date", val: e.date },
      { ico: ICON.clock, lab: "Time", val: e.time },
      { ico: ICON.pin, lab: "Venue", val: e.location },
      { ico: ICON.user, lab: "Speaker", val: e.presenter, sub: e.presenterRole }
    ].filter(function (f) { return f.val; }).map(function (f) {
      return '<div class="evt-fact">' +
        '<span class="evt-ico">' + f.ico + '</span>' +
        '<span class="evt-lab">' + f.lab + '</span>' +
        '<span class="evt-val">' + f.val + (f.sub ? '<i>' + f.sub + '</i>' : '') + '</span>' +
      '</div>';
    }).join("");

    /* Bento gallery. The array order picks the slot for each photo. */
    var POS = ["center 30%", "center 30%", "center 35%", "center 45%"];
    var shots = (e.images && e.images.length) ? e.images.map(function (src, i) {
      var alt = (e.imageAlts && e.imageAlts[i]) || e.title;
      return '<figure class="b-' + (i + 1) + '">' +
        '<img src="' + src + '" alt="' + alt + '" loading="lazy" style="object-position:' + (POS[i] || "center") + '">' +
      '</figure>';
    }).join("") : '';

    /* Reflection: one article, paragraph breaks only. */
    var reflection = (e.reflection || []).map(function (para) {
      return '<p>' + para + '</p>';
    }).join("");

    /* Build the detail page markup. */

    root.innerHTML = '' +
      '<a class="back" href="index.html#events">' + ICON.back + 'All events</a>' +
      '<div class="evt-hero">' +
        poster +
        '<div class="evt-hero-info">' +
          '<div class="eyebrow">' + e.type + '</div>' +
          '<h1>' + e.title + '</h1>' +
          '<p class="lead">' + e.description + '</p>' +
          '<div class="evt-facts">' + facts + '</div>' +
        '</div>' +
      '</div>' +
      (shots ? '<section class="evt-block"><div class="bento">' + shots + '</div></section>' : '') +
      '<section class="evt-block">' +
        '<h2 class="evt-h2">Reflection</h2>' +
        '<article class="reflection">' + reflection + '</article>' +
      '</section>';

    document.title = e.title + " · Chang Heng Wei";
  }

  /* 8. Scroll to the right section when the URL has a hash */
  function initHashScroll() {
    if (!location.hash) return;
    var target = null;
    try { target = document.querySelector(location.hash); } catch (e) {}
    if (!target) return;

    // Coming back from a detail page: reuse the saved card position.
    var y = null;
    if (location.hash === "#events") {
      var saved = null;
      try { saved = sessionStorage.getItem("chw:event-anchor"); } catch (e) {}
      if (saved !== null && saved !== "") {
        y = parseInt(saved, 10);
        try { sessionStorage.removeItem("chw:event-anchor"); } catch (e) {}
      }
    }
    if (y === null || isNaN(y)) {
      y = target.getBoundingClientRect().top + window.scrollY - 90;
    }

    // Wait for the grids to render, then jump to the saved position.
    setTimeout(function () { window.scrollTo(0, y); }, 60);
  }

  /* 9. Footer year */
  function initYear() {
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }

  /* 10. Copy the email address. The Email box itself is not a link. */
  function initCopyEmail() {
    var btn = $(".copy-btn");
    if (!btn) return;
    var status = $("#copy-status");
    var timer;

    // navigator.clipboard needs https or localhost, so keep a fallback for file://
    function legacyCopy(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      return ok;
    }

    function done(ok) {
      if (status) status.textContent = ok
        ? "Email address copied"
        : "Copy failed — select the address manually";
      btn.classList.remove("copied");
      void btn.offsetWidth;              // force a reflow so the pop animation replays
      btn.classList.add("copied");
      clearTimeout(timer);
      timer = setTimeout(function () { btn.classList.remove("copied"); }, 600);
    }

    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var text = btn.getAttribute("data-copy") || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { done(legacyCopy(text)); }
        );
      } else {
        done(legacyCopy(text));
      }
    });
  }

  /* 11. Background music. One shared on/off state for every page. */
  function initMusic() {
    var audio = $("#bg-music");
    var btn = $("#music-toggle");
    if (!audio || !btn) return;

    var KEY = "chw-music";
    var TIME_KEY = "chw-music-time";
    var VOLUME = 0.18;
    var UNLOCK_EVENTS = ["pointerdown", "mousedown", "touchstart", "keydown", "click"];
    var on = true;
    var armed = false;
    var lastSaved = -1;

    // Nothing saved means on. Only an explicit "off" turns it off by default.
    try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}

    audio.loop = true;
    audio.volume = VOLUME;

    function label() {
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on
        ? "Music on. Click to turn off"
        : "Music off. Click to turn on");
      btn.title = on ? "Turn music off" : "Turn music on";
    }

    // Carry the playhead across page loads so navigation does not restart the track.
    function restoreTime() {
      try {
        var t = parseFloat(localStorage.getItem(TIME_KEY));
        if (isFinite(t) && t > 0 && isFinite(audio.duration) && t < audio.duration - 1) {
          audio.currentTime = t;
        }
      } catch (e) {}
    }
    if (audio.readyState >= 1) restoreTime();
    else audio.addEventListener("loadedmetadata", restoreTime, { once: true });

    audio.addEventListener("timeupdate", function () {
      var t = Math.floor(audio.currentTime);
      if (t === lastSaved || t % 2 !== 0) return;
      lastSaved = t;
      try { localStorage.setItem(TIME_KEY, String(t)); } catch (e) {}
    });

    function unlock() {
      UNLOCK_EVENTS.forEach(function (evt) {
        document.removeEventListener(evt, unlock, true);
      });
      armed = false;
      if (on) tryPlay();
    }

    function tryPlay() {
      if (!on) return;
      var p = audio.play();
      if (!p || typeof p.catch !== "function") return;
      p.catch(function (err) {
        // A browser blocks sound before the first user gesture. Retry on that
        // first click / tap / keypress. Other errors mean the file is missing
        // or unplayable, which no gesture can fix.
        if (!err || err.name !== "NotAllowedError" || armed || !on) return;
        armed = true;
        UNLOCK_EVENTS.forEach(function (evt) {
          document.addEventListener(evt, unlock, true);
        });
      });
    }

    btn.addEventListener("click", function () {
      on = !on;
      try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
      label();
      if (on) tryPlay();
      else audio.pause();
    });

    // Another tab (or another page) changed the setting: follow it at once.
    window.addEventListener("storage", function (e) {
      if (e.key !== KEY) return;
      on = e.newValue !== "off";
      label();
      if (on) tryPlay();
      else audio.pause();
    });

    label();
    if (on) tryPlay();
    else audio.pause();
  }

  /* Boot */
  function boot() {
    initTheme();
    initNav();
    renderHome();          // build the grids first
    renderProjectDetail();
    renderEventDetail();
    initMotion();          // observe every .reveal, including the ones just injected
    initSpotlight();
    initHashScroll();      // jump to the section named in the URL hash
    initYear();
    initCopyEmail();       // set up the Contact section's Copy button
    initMusic();           // start the background music
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // Bind the spotlight once more after the DOM is ready.
  document.addEventListener("DOMContentLoaded", function () { setTimeout(initSpotlight, 0); });
})();
