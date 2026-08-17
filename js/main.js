/**
 * Site-wide interactions: photo placeholders, scroll reveals, accordions,
 * tour tabs, filter chips, gallery lightbox, WhatsApp buttons, contact form.
 */

/* ---------- Photo-slot placeholder fallback ---------------------------
   Every <img> inside a .photo-slot points at the FINAL expected filename.
   If that file doesn't exist yet, we show a clean placeholder instead of
   a broken-image icon. Drop the real photo in with the same filename and
   it appears automatically — no code changes needed. */
document.addEventListener(
  "error",
  function (e) {
    var img = e.target;
    if (!(img.tagName === "IMG")) return;
    var slot = img.closest(".photo-slot");
    if (slot) slot.classList.add("is-placeholder");
  },
  true
);

/* ---------- Scroll reveal ---------------------------------------------- */
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach(function (el) {
    io.observe(el);
  });
})();

/* ---------- Generic accordion (FAQ, tour inclusions) -------------------- */
document.addEventListener("click", function (e) {
  var q = e.target.closest(".accordion-q");
  if (!q) return;
  var item = q.closest(".accordion-item");
  var answer = item.querySelector(".accordion-a");
  var willOpen = !item.classList.contains("is-open");

  var group = item.closest("[data-accordion-group]");
  if (group) {
    group.querySelectorAll(".accordion-item.is-open").forEach(function (openItem) {
      if (openItem !== item) {
        openItem.classList.remove("is-open");
        openItem.querySelector(".accordion-a").style.maxHeight = null;
      }
    });
  }

  item.classList.toggle("is-open", willOpen);
  answer.style.maxHeight = willOpen ? answer.scrollHeight + "px" : null;
});

/* ---------- Tour tabs (Itinerary / Inclusions / Pricing) --------------- */
document.addEventListener("click", function (e) {
  var tab = e.target.closest(".tour__tab");
  if (!tab) return;
  var body = tab.closest(".tour__body");
  var targetId = tab.getAttribute("data-tab");

  body.querySelectorAll(".tour__tab").forEach(function (t) {
    t.classList.toggle("active", t === tab);
  });
  body.querySelectorAll(".tour__panel").forEach(function (p) {
    p.classList.toggle("active", p.id === targetId);
  });
});

/* ---------- Filter chips (tours / gallery) ------------------------------ */
document.addEventListener("click", function (e) {
  var chip = e.target.closest(".filter-chip");
  if (!chip) return;
  var bar = chip.closest(".filter-bar");
  var targetSelector = bar.getAttribute("data-filter-target");
  var filter = chip.getAttribute("data-filter");

  bar.querySelectorAll(".filter-chip").forEach(function (c) {
    c.classList.toggle("active", c === chip);
  });

  document.querySelectorAll(targetSelector).forEach(function (el) {
    var cats = (el.getAttribute("data-category") || "").split(" ");
    var show = filter === "all" || cats.indexOf(filter) !== -1;
    el.style.display = show ? "" : "none";
  });
});

/* ---------- WhatsApp CTA buttons ---------------------------------------
   Any element with [data-wa] gets href built from config + optional
   data-wa-en / data-wa-fr custom message. */
function refreshWaButtons() {
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var link = window.waLink(el.getAttribute("data-wa-en"), el.getAttribute("data-wa-fr"));
    if (el.tagName === "A") el.setAttribute("href", link);
    el.setAttribute("data-href", link);
  });
}
window.refreshWaButtons = refreshWaButtons;
document.addEventListener("DOMContentLoaded", refreshWaButtons);
window.onLanguageApplied = (function (prev) {
  return function (lang) {
    if (prev) prev(lang);
    refreshWaButtons();
  };
})(window.onLanguageApplied);

/* ---------- Simple lightbox for gallery photo-slots --------------------- */
(function () {
  var lb = null;
  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button><div class="lightbox__inner"></div>';
    lb.style.cssText =
      "position:fixed;inset:0;z-index:2000;background:rgba(15,15,10,.92);display:none;align-items:center;justify-content:center;padding:40px;";
    lb.querySelector(".lightbox__close").style.cssText =
      "position:absolute;top:20px;right:26px;font-size:2.2rem;background:none;border:0;color:#fff;cursor:pointer;line-height:1;";
    lb.querySelector(".lightbox__inner").style.cssText =
      "max-width:min(1100px,92vw);max-height:88vh;border-radius:12px;overflow:hidden;";
    document.body.appendChild(lb);
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }
  function open(imgSrc, caption) {
    if (!lb) buildLightbox();
    lb.querySelector(".lightbox__inner").innerHTML =
      '<img src="' +
      imgSrc +
      '" style="width:100%;height:100%;object-fit:contain;display:block;" alt="' +
      (caption || "") +
      '">';
    lb.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  function close() {
    if (!lb) return;
    lb.style.display = "none";
    document.body.style.overflow = "";
  }
  document.addEventListener("click", function (e) {
    var slot = e.target.closest("[data-lightbox] .photo-slot, .photo-slot[data-lightbox]");
    if (!slot || slot.classList.contains("is-placeholder")) return;
    var img = slot.querySelector("img");
    if (img) open(img.currentSrc || img.src, img.alt);
  });
})();

/* ---------- Contact form -> WhatsApp / email ---------------------------- */
document.addEventListener("submit", function (e) {
  var form = e.target.closest("#contactForm");
  if (!form) return;
  e.preventDefault();

  var data = new FormData(form);
  var name = data.get("name") || "";
  var travelDates = data.get("dates") || "";
  var travelers = data.get("travelers") || "";
  var message = data.get("message") || "";

  var lang = window.getCurrentLang ? window.getCurrentLang() : "en";
  var text =
    lang === "fr"
      ? "Bonjour Emanueli !\nJe m'appelle " +
        name +
        ".\nDates souhaitées : " +
        travelDates +
        "\nNombre de voyageurs : " +
        travelers +
        "\nMessage : " +
        message
      : "Hello Emanueli!\nMy name is " +
        name +
        ".\nPreferred dates: " +
        travelDates +
        "\nNumber of travelers: " +
        travelers +
        "\nMessage: " +
        message;

  var url = "https://wa.me/" + window.SITE_CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener");

  var status = form.querySelector("#formStatus");
  if (status) status.classList.add("is-visible");
});
