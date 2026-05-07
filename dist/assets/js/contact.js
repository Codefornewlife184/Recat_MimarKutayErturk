(function() {
  function setFormMessage(text, isError) {
    var el = document.getElementById('form-messages');
    if (!el) return;
    el.classList.remove('alert-success');
    el.classList.remove('alert-danger');
    el.classList.add(isError ? 'alert-danger' : 'alert-success');
    el.style.display = 'block';
    el.textContent = text || '';
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {}
  }

  function clearForm() {
    var fields = ['fullname', 'email', 'phone', 'service', 'message'];
    fields.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  function handleSubmit(form) {
    var action = form.getAttribute('action') || '';
    if (!action) return;

    return fetch(action, {
      method: 'POST',
      body: new FormData(form),
      credentials: 'same-origin',
    })
      .then(function(res) {
        return res.text().then(function(text) {
          return { ok: res.ok, text: text || '' };
        });
      })
      .then(function(result) {
        if (result.ok) {
          setFormMessage(result.text, false);
          clearForm();
          return;
        }
        var msg = result.text || 'Mesaj g\u00f6nderilemedi. L\u00fctfen daha sonra tekrar deneyin.';
        setFormMessage(msg, true);
      })
      .catch(function() {
        var msg = 'Mesaj g\u00f6nderilemedi. L\u00fctfen daha sonra tekrar deneyin.';
        setFormMessage(msg, true);
      });
  }

  function initVanilla() {
    document.addEventListener(
      'submit',
      function(event) {
        var form = event.target;
        if (!form || form.id !== 'ajax_contact') return;
        event.preventDefault();
        handleSubmit(form);
      },
      true,
    );
  }

  function initJquery() {
    var $ = window.jQuery;
    $(document).on('submit', '#ajax_contact', function(event) {
      event.preventDefault();
      handleSubmit(this);
    });
  }

  function init() {
    if (window.jQuery) initJquery();
    else initVanilla();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
