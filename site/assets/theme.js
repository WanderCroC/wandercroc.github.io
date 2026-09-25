(function () {
  'use strict';
  var key = 'chengcheng-wang-theme';
  var preference = null;
  try {
    var saved = window.localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (_) { /* The control also works when storage is unavailable. */ }
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    var button = document.querySelector('.theme-toggle');
    if (button) {
      var action = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', action);
      button.setAttribute('title', action);
    }
  }
  apply(preference || 'dark');
  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('.theme-toggle');
    if (!button) return;
    button.hidden = false;
    apply(document.documentElement.dataset.theme);
    button.addEventListener('click', function () {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(preference);
      try { window.localStorage.setItem(key, preference); } catch (_) {}
    });
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    apply(preference || 'dark');
  });
})();
