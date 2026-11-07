/* ===== CONFIG: edita aquí rutas, fecha y formulario ===== */
const CONFIG = {
  fecha: new Date(2027, 9, 25, 0, 0, 0),       // 25 de Octubre de 2027 (Mes 9 es Octubre en JS)
  musica: "musica.mp3",
  sobreCerrado: "sobre cerrado.png",
  sobreAbierto: "sobre abierto.png",
  heroImg: "imagen hero.png",
  heroBg: "fondo hero2.png",
  changos: "fondo.jpeg",
  bolaImg: "sombrero.png",
  formURL: "https://docs.google.com/forms/d/e/1FAIpQLS_EJEMPLO/formResponse", // URL generica
  entryNombre: "entry.000000000",
  entryAsistencia: "entry.000000000",
  valorSi: "Sí asistiré",
  valorNo: "No podré asistir"
};

const $ = id => document.getElementById(id);

/* ===== Imágenes desde CONFIG ===== */
$("sobreImg").src = CONFIG.sobreCerrado;
$("heroImg").src = CONFIG.heroImg;
$("heroBg").style.setProperty("--img", `url("${CONFIG.heroBg}")`);
$("changos").style.setProperty("--img", `url("${CONFIG.changos}")`);

/* ===== Adornos ===== */
document.querySelectorAll(".deco[data-img]").forEach(d => {
  if (!d.dataset.img) return;
  const em = d.textContent.trim() === "🪩" ? "✨" : d.textContent;
  d.innerHTML = `<img src="${d.dataset.img}" alt="">`;
  d.firstChild.onerror = () => { d.textContent = em; };
});

/* ===== Títulos con tipografía por letra ===== */
function mix(el) {
  const t = el.textContent.trim();
  el.textContent = "";
  el.setAttribute("aria-label", t);
  let i = 0;
  t.split(" ").forEach((w, k, a) => {
    const s = document.createElement("span");
    s.className = "w";
    [...w].forEach(c => {
      const l = document.createElement("span");
      l.className = "l l" + (i % 4);
      l.style.setProperty("--rt", ((i * 7) % 5 - 2) + "deg");
      l.setAttribute("aria-hidden", "true");
      l.textContent = c;
      s.appendChild(l);
      i++;
    });
    el.appendChild(s);
    if (k < a.length - 1) el.appendChild(document.createTextNode(" "));
  });
}
document.querySelectorAll(".mix").forEach(mix);

/* ===== Música ===== */
const audio = new Audio(CONFIG.musica);
audio.loop = true;
let quiereMusica = false;
const mBtn = $("musicaBtn");
function reproducir() { audio.play().then(() => { mBtn.textContent = "🔊"; }).catch(() => {}); }
mBtn.addEventListener("click", () => {
  if (audio.paused) { quiereMusica = true; reproducir(); }
  else { quiereMusica = false; audio.pause(); mBtn.textContent = "🔈"; }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) audio.pause();
  else if (quiereMusica) reproducir();
});
window.addEventListener("pagehide", () => audio.pause());

/* ===== Confeti ===== */
function confeti() {
  const cv = $("confeti"), cx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#f9a8cc", "#ec6ba5", "#d6336c", "#ffffff", "#d9d6de", "#ffd1e5"];
  const ps = Array.from({ length: 150 }, () => ({
    x: innerWidth / 2, y: innerHeight * .55,
    vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4,
    s: Math.random() * 8 + 5, r: Math.random() * 6, vr: (Math.random() - .5) * .4,
    c: cols[Math.random() * cols.length | 0], star: Math.random() < .3
  }));
  const fin = performance.now() + 4500;
  (function paso(t) {
    cx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => {
      p.vy += .28; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
      cx.globalAlpha = Math.max(0, Math.min(1, (fin - t) / 1200));
      if (p.star) { cx.font = p.s * 2 + "px serif"; cx.fillText("✦", 0, 0); }
      else cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      cx.restore();
    });
    if (t < fin) requestAnimationFrame(paso); else cx.clearRect(0, 0, cv.width, cv.height);
  })(performance.now());
}

/* ===== Mini bolas cayendo ===== */
function bolasCayendo() {
  for (let i = 0; i < 9; i++) {
    const b = document.createElement("span");
    b.className = "caida";
    const s = 22 + Math.random() * 20;
    b.style.cssText = `left:${Math.random() * 94}%;width:${s}px;font-size:${s}px;animation-duration:${14 + Math.random() * 12}s;animation-delay:-${Math.random() * 22}s`;
    b.innerHTML = CONFIG.bolaImg ? `<img src="${CONFIG.bolaImg}" alt="">` : "✨";
    document.body.appendChild(b);
  }
}

/* ===== Revelar scroll ===== */
function revelar() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll(".rev").forEach(el => io.observe(el));
}

/* ===== Cuenta regresiva ===== */
let timer;
function tick() {
  const d = CONFIG.fecha - new Date();
  if (d <= 0) { $("cd").innerHTML = '<p class="hoy">¡Hoy es el gran día!</p>'; clearInterval(timer); return; }
  const v = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
  document.querySelectorAll("[data-cd]").forEach((e, i) => e.textContent = String(v[i]).padStart(2, "0"));
}
tick(); timer = setInterval(tick, 1000);

/* ===== Sobre ===== */
let abierto = false;
function abrir() {
  if (abierto) return;
  abierto = true;
  $("sobreImg").src = CONFIG.sobreAbierto;
  $("sobreEmoji").textContent = "📨";
  $("sobre").classList.add("abre");
  confeti();
  quiereMusica = true; reproducir();
  setTimeout(() => {
    $("inv").hidden = false;
    document.body.classList.remove("lock");
    window.scrollTo(0, 0);
    mBtn.hidden = false;
    revelar(); bolasCayendo();
    $("sobre").classList.add("fuera");
  }, 1300);
  setTimeout(() => $("sobre").remove(), 2500);
}
$("sobreBtn").addEventListener("click", abrir);
$("sobreBtn").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });

/* ===== Confirmación RSVP ===== */
const form = $("rsvp");
form.action = CONFIG.formURL;
$("nombre").name = CONFIG.entryNombre;
$("siR").name = $("noR").name = CONFIG.entryAsistencia;
$("siR").value = CONFIG.valorSi;
$("noR").value = CONFIG.valorNo;
form.addEventListener("submit", e => {
  if (!$("nombre").value.trim() || !(($("siR").checked) || $("noR").checked)) {
    e.preventDefault();
    $("rsvpMsg").textContent = "Escribe tu nombre y elige una opción.";
    return;
  }
  $("rsvpMsg").textContent = "";
  setTimeout(() => { form.hidden = true; $("rsvpOk").hidden = false; }, 700);
});

/* ===== Botón subir ===== */
const sBtn = $("subirBtn");
sBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  sBtn.hidden = !abierto || scrollY < innerHeight * .8;
}, { passive: true });