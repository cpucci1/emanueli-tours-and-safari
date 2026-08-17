/**
 * Injects the shared header/footer/WhatsApp button into every page and
 * wires up the interactions that depend on them (mobile nav, active link,
 * scroll shadow, back-to-top, WhatsApp float link).
 */
(function () {
  function currentPage() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function markActiveLink(root) {
    var page = currentPage();
    root.querySelectorAll(".nav a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === page || (page === "index.html" && href === "./")) {
        a.classList.add("active");
      }
    });
  }

  function wireHeader(root) {
    var header = root.querySelector(".header");
    var toggle = root.querySelector("#navToggle");
    var nav = root.querySelector("#mainNav");

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("is-open");
        toggle.classList.toggle("is-active", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.classList.remove("is-active");
          document.body.style.overflow = "";
        });
      });
    }

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  function wireWhatsApp(root) {
    var wa = root.querySelector("#waFloat");
    if (!wa) return;
    var update = function () {
      wa.setAttribute("href", window.waLink());
    };
    update();
    window.onLanguageApplied = (function (prev) {
      return function (lang) {
        if (prev) prev(lang);
        update();
      };
    })(window.onLanguageApplied);
  }

  function wireSocial(root) {
    var map = {
      socialInstagram: "instagram",
      socialFacebook: "facebook",
      socialTripadvisor: "tripadvisor",
      socialYoutube: "youtube",
    };
    Object.keys(map).forEach(function (id) {
      var el = root.querySelector("#" + id);
      if (el && window.SITE_CONFIG.social[map[id]]) {
        el.setAttribute("href", window.SITE_CONFIG.social[map[id]]);
      }
    });
    var mail = root.querySelector('a[href^="mailto:"]');
    if (mail) mail.setAttribute("href", "mailto:" + window.SITE_CONFIG.email);
    var tel = root.querySelector('a[href^="tel:"]');
    if (tel) {
      tel.setAttribute("href", "tel:" + window.SITE_CONFIG.phone.replace(/\s+/g, ""));
      tel.textContent = window.SITE_CONFIG.phone;
    }
    var mailText = root.querySelector('a[href^="mailto:"]');
    if (mailText) mailText.textContent = window.SITE_CONFIG.email;
  }

  function wireBackToTop(root) {
    var btn = root.querySelector("#toTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 500);
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setYear(root) {
    var y = root.querySelector("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  function inject(id, url, after) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to load " + url);
        return r.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        if (after) after(el);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    inject("site-header", "partials/header.html", function (el) {
      markActiveLink(el);
      wireHeader(el);
      if (window.i18nApply) window.i18nApply();
    });
    inject("site-footer", "partials/footer.html", function (el) {
      wireWhatsApp(el);
      wireSocial(el);
      wireBackToTop(el);
      setYear(el);
      if (window.i18nApply) window.i18nApply();
      if (window.refreshWaButtons) window.refreshWaButtons();
    });
  });
})();
