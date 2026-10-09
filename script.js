"use strict";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------------- preloader ---------------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#preloader").classList.add("hide");
    document.body.classList.remove("loading");
  }, 600);
});

/* ---------------- theme toggle ---------------- */
const root = document.documentElement;
const themeBtn = $("#theme-toggle");

function setThemeIcon() {
  themeBtn.innerHTML = root.dataset.theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  setThemeIcon();
});
setThemeIcon();

/* ---------------- mobile menu ---------------- */
const navbar = $("#navbar");
const menuBtn = $("#menu-btn");

function closeMenu() {
  navbar.classList.remove("open");
  menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

menuBtn.addEventListener("click", () => {
  const open = navbar.classList.toggle("open");
  menuBtn.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
});
$$(".navbar a").forEach(a => a.addEventListener("click", closeMenu));

/* ---------------- scroll: header, progress, spy, top button ---------------- */
const header = $("#header");
const progress = $("#scroll-progress");
const scrollTopBtn = $("#scroll-top");
const sections = $$("section[id]");
const navLinks = $$(".navbar a");
const timeline = $("#timeline");
const lineFill = $("#lineFill");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;

  header.classList.toggle("scrolled", y > 30);
  scrollTopBtn.classList.toggle("active", y > 500);
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  let current = "home";
  sections.forEach(sec => {
    if (y >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));

  // timeline line draws as you scroll through it
  const r = timeline.getBoundingClientRect();
  const pct = Math.min(Math.max((window.innerHeight * 0.7 - r.top) / r.height, 0), 1);
  lineFill.style.height = pct * 100 + "%";
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => { onScroll(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
onScroll();

/* ---------------- tab title ---------------- */
const baseTitle = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.visibilityState === "visible" ? baseTitle : "Come back soon 👋 | Dilshana";
});

/* ---------------- typing effect ---------------- */
const words = [
  "Full Stack Development",
  "React & TypeScript",
  "Node.js, Prisma & PostgreSQL",
  "AI-Augmented Engineering",
  "Python & Django",
  "CI/CD with GitHub Actions",
];
const typingEl = $(".typing-text");
let wi = 0, ci = 0, deleting = false;

function typeLoop() {
  const word = words[wi];
  typingEl.textContent = word.slice(0, ci);

  if (!deleting && ci < word.length) {
    ci++;
    setTimeout(typeLoop, 70);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1400);
  } else if (ci > 0) {
    ci--;
    setTimeout(typeLoop, 35);
  } else {
    deleting = false;
    wi = (wi + 1) % words.length;
    setTimeout(typeLoop, 300);
  }
}
if (reduceMotion) typingEl.textContent = words[0];
else typeLoop();

/* ---------------- particle network ---------------- */
(function particles() {
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  const hero = $("#home");
  const mouse = { x: -9999, y: -9999 };
  let w, h, dpr, pts = [], running = true, color = "109,40,217";

  function readColor() {
    color = getComputedStyle(root).getPropertyValue("--particle").trim() || color;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(Math.floor((w * h) / 14000), 90);
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.4 + 1,
    }));
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // repel from cursor
      const mx = p.x - mouse.x, my = p.y - mouse.y;
      const md = Math.hypot(mx, my);
      if (md < 120) {
        p.x += (mx / md) * 2.2;
        p.y += (my / md) * 2.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},.55)`;
      ctx.fill();

      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${color},${0.22 * (1 - d / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  hero.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });
  hero.addEventListener("click", e => {
    const r = canvas.getBoundingClientRect();
    for (let k = 0; k < 4; k++) {
      pts.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, r: Math.random() * 2.4 + 1 });
    }
    if (pts.length > 140) pts.splice(0, pts.length - 140);
  });

  new IntersectionObserver(([entry]) => {
    const was = running;
    running = entry.isIntersecting;
    if (running && !was) draw();
  }).observe(hero);

  new MutationObserver(readColor).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

  readColor();
  resize();
  if (reduceMotion) { running = false; requestAnimationFrame(() => { running = true; draw(); running = false; }); }
  else draw();
})();

/* ---------------- skills ---------------- */
const DEV = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
const skills = [
  { name: "HTML5", cat: "frontend", img: "html5/html5-original" },
  { name: "CSS3", cat: "frontend", img: "css3/css3-original" },
  { name: "JavaScript", cat: "frontend", img: "javascript/javascript-original" },
  { name: "TypeScript", cat: "frontend", img: "typescript/typescript-original", c: "#3178c6" },
  { name: "React", cat: "frontend", img: "react/react-original", c: "#61dafb" },
  { name: "Next.js", cat: "frontend", img: "nextjs/nextjs-original", c: "#aaaaaa" },
  { name: "Vite", cat: "frontend", img: "vitejs/vitejs-original", c: "#646cff" },
  { name: "Tailwind CSS", cat: "frontend", img: "tailwindcss/tailwindcss-original", c: "#38bdf8" },
  { name: "Bootstrap", cat: "frontend", img: "bootstrap/bootstrap-original", c: "#7952b3" },
  { name: "React Router", cat: "frontend", img: "reactrouter/reactrouter-original", c: "#f44250" },
  { name: "TanStack Query", cat: "frontend", fa: "fas fa-arrows-rotate", c: "#ff4154" },
  { name: "Zustand", cat: "frontend", fa: "fas fa-paw", c: "#8b5e3c" },
  { name: "Node.js", cat: "backend", img: "nodejs/nodejs-original", c: "#539e43" },
  { name: "Express.js", cat: "backend", img: "express/express-original", c: "#aaaaaa" },
  { name: "Python", cat: "backend", img: "python/python-original", c: "#3776ab" },
  { name: "Django", cat: "backend", img: "django/django-plain", c: "#44b78b" },
  { name: "Flask", cat: "backend", img: "flask/flask-original", c: "#aaaaaa" },
  { name: "Java", cat: "backend", img: "java/java-original", c: "#f89820" },
  { name: "REST APIs", cat: "backend", fa: "fas fa-plug", c: "#0f46a2" },
  { name: "JWT / Session Auth", cat: "backend", fa: "fas fa-key", c: "#d63aff" },
  { name: "PostgreSQL", cat: "database", img: "postgresql/postgresql-original", c: "#336791" },
  { name: "Prisma ORM", cat: "database", img: "prisma/prisma-original", c: "#5a67d8" },
  { name: "MySQL", cat: "database", img: "mysql/mysql-original", c: "#4479a1" },
  { name: "SQL Server", cat: "database", img: "microsoftsqlserver/microsoftsqlserver-original", c: "#cc2927" },
  { name: "SQLite", cat: "database", img: "sqlite/sqlite-original", c: "#0f80cc" },
  { name: "Git", cat: "devops", img: "git/git-original", c: "#f05032" },
  { name: "GitHub", cat: "devops", img: "github/github-original", c: "#aaaaaa" },
  { name: "GitHub Actions", cat: "devops", img: "githubactions/githubactions-original", c: "#2088ff" },
  { name: "Docker", cat: "devops", img: "docker/docker-original", c: "#2496ed" },
  { name: "Postman", cat: "devops", img: "postman/postman-original", c: "#ff6c37" },
  { name: "AWS", cat: "devops", img: "amazonwebservices/amazonwebservices-original-wordmark", c: "#ff9900" },
  { name: "Render", cat: "devops", fa: "fas fa-cloud-arrow-up", c: "#46e3b7" },
  { name: "AI-Assisted Dev", cat: "devops", fa: "fas fa-robot", c: "#9b59b6" },
  { name: "Pandas", cat: "data", img: "pandas/pandas-original", c: "#150458" },
  { name: "NumPy", cat: "data", img: "numpy/numpy-original", c: "#4dabcf" },
  { name: "Scikit-learn", cat: "data", img: "scikitlearn/scikitlearn-original", c: "#f7931e" },
  { name: "Jupyter", cat: "data", img: "jupyter/jupyter-original", c: "#f37626" },
];

const skillsContainer = $("#skillsContainer");

function renderSkills(filter) {
  const list = filter === "all" ? skills : skills.filter(s => s.cat === filter);
  skillsContainer.innerHTML = list.map((s, i) => {
    const icon = s.img
      ? `<img src="${DEV}${s.img}.svg" alt="" loading="lazy" />`
      : `<i class="${s.fa}" style="color:${s.c}"></i>`;
    return `<div class="skill-tile" style="--c:${s.c || "#7c3aed"};animation-delay:${i * 0.03}s">
      <div class="ico">${icon}</div><span>${s.name}</span></div>`;
  }).join("");
}

function setupTabs(tabsEl, onChange) {
  tabsEl.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    $$("button", tabsEl).forEach(b => b.classList.toggle("active", b === btn));
    onChange(btn.dataset.filter);
  });
}

renderSkills("all");
setupTabs($("#skillTabs"), renderSkills);

/* ---------------- projects filter ---------------- */
const projectCards = $$("#projectGrid .project-card");
setupTabs($("#projectTabs"), filter => {
  projectCards.forEach(card => {
    const show = filter === "all" || card.dataset.cat === filter;
    card.classList.toggle("hidden", !show);
    if (show) {
      card.animate(
        [{ opacity: 0, transform: "translateY(24px) scale(.97)" }, { opacity: 1, transform: "none" }],
        { duration: 500, easing: "cubic-bezier(.22,1,.36,1)" }
      );
    }
  });
});

/* ---------------- 3D tilt ---------------- */
if (canHover && !reduceMotion) {
  $$(".tilt").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = "box-shadow .4s, transform .1s";
      card.style.transform = `perspective(900px) rotateX(${-py * 12}deg) rotateY(${px * 12}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "";
      card.style.transform = "";
    });
  });
}

/* ---------------- stats: fill counts from content ---------------- */
$('[data-stat="projects"]').dataset.count = projectCards.length;
$('[data-stat="skills"]').dataset.count = Math.floor(skills.length / 5) * 5;

/* ---------------- counters ---------------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
  const dur = 1800;
  const start = performance.now();
  (function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(step);
  })(start);
}

/* ---------------- reveal + counters + rings on scroll ---------------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("show");
    $$("[data-count]", el).forEach(animateCount);
    if (el.matches("[data-count]")) animateCount(el);
    $$(".ring", el).forEach(ring => {
      const pct = parseFloat(ring.dataset.percent);
      const bar = $(".bar", ring);
      const len = 2 * Math.PI * 54;
      requestAnimationFrame(() => { bar.style.strokeDashoffset = len * (1 - pct / 100); });
    });
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

$$(".reveal").forEach(el => io.observe(el));

/* ---------------- letter lightbox ---------------- */
const lightbox = $("#lightbox");
const letterPreview = $("#letterPreview");

function openLightbox() {
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  $("#lightboxClose").focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  letterPreview.focus();
}

letterPreview.addEventListener("click", openLightbox);
letterPreview.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(); }
});
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});

/* ---------------- contact form ----------------
   Sends through FormSubmit (no backend needed). The very first submission
   triggers a one-time activation email to the inbox below. If the request
   fails, it falls back to opening the visitor's mail app. */
const CONTACT_EMAIL = "dilshanasayyed@gmail.com";
const form = $("#contact-form");
const statusEl = $("#formStatus");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (data._honey) return;

  if (!data.name.trim() || !/^\S+@\S+\.\S+$/.test(data.email) || !data.message.trim()) {
    statusEl.className = "form-status err";
    statusEl.textContent = "Please fill in your name, a valid email and a message.";
    return;
  }

  const btn = $("button[type=submit]", form);
  btn.disabled = true;
  btn.innerHTML = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';
  statusEl.className = "form-status";
  statusEl.textContent = "";

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        _subject: data.subject || `Portfolio message from ${data.name}`,
        message: data.message,
        _template: "table",
        _captcha: "false",
      }),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    statusEl.className = "form-status ok";
    statusEl.textContent = "Thank you! Your message has been sent. I'll get back to you soon.";
  } catch (err) {
    const subject = encodeURIComponent(data.subject || `Portfolio message from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    statusEl.className = "form-status";
    statusEl.textContent = "Opening your email app to send the message…";
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
  }
});

/* ---------------- footer year ---------------- */
$("#year").textContent = new Date().getFullYear();
