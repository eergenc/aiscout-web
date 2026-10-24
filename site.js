(function () {
  // Ticker: duplicate the items once so the loop is seamless; clones are hidden from screen readers and tab order.
  var track = document.querySelector('[data-ticker]');
  if (track) {
    Array.prototype.slice.call(track.children).forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      if (clone.tagName === 'A') clone.setAttribute('tabindex', '-1');
      track.appendChild(clone);
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form → Web3Forms (JSON), with inline status messages.
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var data = Object.fromEntries(new FormData(form).entries());
    if (data.botcheck) return;
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = form.dataset.sending;

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j && res.j.message);
        status.className = 'form-status ok';
        status.textContent = form.dataset.ok;
        form.reset();
      })
      .catch(function () {
        status.className = 'form-status err';
        status.textContent = form.dataset.err;
      })
      .finally(function () { button.disabled = false; });
  });
})();
