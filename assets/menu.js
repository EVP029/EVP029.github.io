// Dropdown menu: opens on click, closes on outside click, Escape, or choosing a link.
(function () {
  var btn = document.querySelector('.menu-btn');
  var panel = document.getElementById('menu-panel');
  if (!btn || !panel) return;
  function set(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
  }
  btn.addEventListener('click', function () {
    set(btn.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) set(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); }
  });
})();
