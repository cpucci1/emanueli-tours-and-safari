/**
 * Central site configuration.
 * Edit the values below to update contact details across the ENTIRE site
 * (they are used by every page via js/partials.js and inline scripts).
 */
window.SITE_CONFIG = {
  businessName: "Emanueli Tours and Safari",
  guideName: "Emanuele",

  // IMPORTANT: replace with the real WhatsApp number in international format,
  // digits only, no "+", no spaces (e.g. Tanzania mobile => "2557XXXXXXXX").
  whatsapp: "255692009169",
  whatsappDisplay: "+255 692 009 169",

  email: "info@emanuelitoursandsafari.com",
  phone: "+255 692 009 169",

  address: {
    line1: "Sokoine Road",
    city: "Arusha, Tanzania",
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tripadvisor: "https://www.tripadvisor.com/",
    youtube: "https://youtube.com/",
  },

  // Default prefilled WhatsApp message per language.
  whatsappMessage: {
    en: "Hello Emanueli! I'd like to know more about your safari packages.",
    fr: "Bonjour Emanueli ! J'aimerais en savoir plus sur vos safaris.",
  },
};

window.waLink = function (customMessageEn, customMessageFr) {
  var lang = (window.getCurrentLang && window.getCurrentLang()) || "en";
  var msg =
    lang === "fr"
      ? customMessageFr || window.SITE_CONFIG.whatsappMessage.fr
      : customMessageEn || window.SITE_CONFIG.whatsappMessage.en;
  return (
    "https://wa.me/" +
    window.SITE_CONFIG.whatsapp +
    "?text=" +
    encodeURIComponent(msg)
  );
};
