(function () {
  var btn = document.getElementById('menu-btn');
  var panel = document.getElementById('menu-panel');
  if (btn && panel) {
    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(panel.hidden);
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !panel.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); }
    });
  }
  var dds = document.querySelectorAll('.dd');
  dds.forEach(function (d) {
    var bt = d.querySelector('.dd-btn');
    bt.addEventListener('click', function (e) {
      e.stopPropagation();
      var was = d.classList.contains('open');
      dds.forEach(function (x) { x.classList.remove('open'); x.querySelector('.dd-btn').setAttribute('aria-expanded', 'false'); });
      if (!was) { d.classList.add('open'); bt.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', function () { dds.forEach(function (x) { x.classList.remove('open'); }); });
  var copy = document.getElementById('copy');
  var mail = document.getElementById('mail');
  if (copy && mail) {
    copy.addEventListener('click', function () {
      function done() { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy email'; }, 1600); }
      function select() {
        var r = document.createRange(); r.selectNodeContents(mail);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      }
      try { navigator.clipboard.writeText(mail.textContent).then(done, select); } catch (err) { select(); }
    });
  }
})();

/* gentle parallax on the home hero: drawing and name drift in opposite directions; the colour-inversion layers are offset to stay aligned with the drawing */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  var cx = 0, cy = 0, tx = 0, ty = 0, fine = !(window.matchMedia && matchMedia('(hover: none)').matches), t0 = Date.now(), run = true;
  var DEPTH_BG = 10, DEPTH_FG = 10;
  if (fine) {
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    document.addEventListener('mouseleave', function () { tx = 0; ty = 0; });
  }
  document.addEventListener('visibilitychange', function () { run = !document.hidden; if (run) tick(); });
  function tick() {
    if (!run) return;
    if (!fine) { var t = (Date.now() - t0) / 1000; tx = Math.sin(t * 0.45) * 0.7; ty = Math.cos(t * 0.33) * 0.5; }
    cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
    var s = hero.style;
    s.setProperty('--dx', (-cx * DEPTH_BG).toFixed(2) + 'px');
    s.setProperty('--dy', (-cy * DEPTH_BG * 0.6).toFixed(2) + 'px');
    s.setProperty('--tx', (cx * DEPTH_FG).toFixed(2) + 'px');
    s.setProperty('--ty', (cy * DEPTH_FG * 0.6).toFixed(2) + 'px');
    requestAnimationFrame(tick);
  }
  tick();
})();

/* carousel */
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (c) {
    var tr = c.querySelector('.track');
    function step(d) { tr.scrollBy({ left: d * Math.max(300, tr.clientWidth * 0.7), behavior: 'smooth' }); }
    c.querySelector('.prev').addEventListener('click', function () { step(-1); });
    c.querySelector('.next').addEventListener('click', function () { step(1); });
  });
})();

/* back to top, shown once the section index has scrolled out of view */
(function () {
  var jump = document.querySelector('.jump'), btn = document.querySelector('.to-top');
  if (!jump || !btn) return;
  function show(v) { btn.classList.toggle('show', v); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { show(!es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe(jump);
  } else { window.addEventListener('scroll', function () { show(window.scrollY > 400); }, { passive: true }); }
  btn.addEventListener('click', function () {
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
  });
})();

// Projects background: play the video from its start each time its slot comes up, and keep it playing.
(function () {
  var slot = document.querySelector('.proj-bg i.vid');
  if (!slot) return;
  var v = slot.querySelector('video');
  if (!v) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { v.pause(); v.removeAttribute('autoplay'); return; }
  function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  v.muted = true;
  play();
  slot.addEventListener('animationiteration', function () { try { v.currentTime = 0; } catch (e) {} play(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) play(); });
  ['click', 'touchstart', 'scroll', 'keydown'].forEach(function (ev) { window.addEventListener(ev, play, { once: true, passive: true }); });
})();
