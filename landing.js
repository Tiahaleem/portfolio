// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ---------- FAQ accordion ----------
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((open) => {
      if (open !== item) open.classList.remove("open");
    });
    item.classList.toggle("open", !isOpen);
  });
});

// ---------- Process line fill ----------
const processLine = document.querySelector(".process-line");
const processSteps = document.querySelectorAll(".process-step");

function updateProcessLine() {
  if (!processLine) return;
  const rect = processLine.getBoundingClientRect();
  const viewportMid = window.innerHeight * 0.65;
  const total = rect.height;
  const passed = Math.min(Math.max(viewportMid - rect.top, 0), total);
  const pct = total > 0 ? (passed / total) * 100 : 0;
  processLine.style.setProperty("--fill", pct + "%");

  processSteps.forEach((step) => {
    const stepRect = step.getBoundingClientRect();
    step.classList.toggle("in-view", stepRect.top < viewportMid);
  });
}
window.addEventListener("scroll", updateProcessLine, { passive: true });
window.addEventListener("resize", updateProcessLine);
updateProcessLine();

// ---------- Mobile sticky CTA: hide once the enquiry form is in view ----------
const stickyCta = document.querySelector(".land-sticky-cta");
const enquirySection = document.getElementById("enquiry");

if (stickyCta && enquirySection) {
  const stickyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        stickyCta.style.display = entry.isIntersecting ? "none" : "";
      });
    },
    { threshold: 0.1 }
  );
  stickyObserver.observe(enquirySection);
}

// ---------- Enquiry form ----------
// NOTE: this currently formats the enquiry into a WhatsApp message and
// redirects there. It does not yet save to a database or notify by email —
// that lands in the next step, once Supabase is wired in.
const enquiryForm = document.getElementById("enquiry-form");
const enquirySuccess = document.getElementById("enquiry-success");

const BUSINESS_WHATSAPP = "2348153042099";

// Show/hide the website- and ads-specific fieldsets based on what the
// person says they need, and only require fields inside the one(s) shown.
const websiteFields = document.getElementById("website-fields");
const adsFields = document.getElementById("ads-fields");
const serviceRadios = document.querySelectorAll('input[name="service_interest"]');

function setFieldsetVisible(fieldset, visible) {
  fieldset.hidden = !visible;
  fieldset.querySelectorAll("select, input, textarea").forEach((field) => {
    if (field.dataset.alwaysOptional) return;
    if (visible) {
      if (field.dataset.required === "true") field.required = true;
    } else {
      field.required = false;
    }
  });
}

// Remember which fields were originally required so we can restore that
// when a fieldset is shown again.
document.querySelectorAll("#website-fields [required], #ads-fields [required]").forEach((f) => {
  f.dataset.required = "true";
});
// Website package/type/has_website were marked required in markup only for
// Website-only flows; none are strictly required since Ads-only skips them.

function updateServiceFields() {
  // Keep the pill highlight in sync even in browsers without :has() support.
  serviceRadios.forEach((radio) => {
    radio.closest(".choice-pill").classList.toggle("is-checked", radio.checked);
  });

  const chosen = document.querySelector('input[name="service_interest"]:checked');
  if (!chosen) {
    setFieldsetVisible(websiteFields, false);
    setFieldsetVisible(adsFields, false);
    return;
  }
  const wantsWebsite = chosen.value.includes("Website");
  const wantsAds = chosen.value.includes("Meta Ads");
  setFieldsetVisible(websiteFields, wantsWebsite);
  setFieldsetVisible(adsFields, wantsAds);
}

serviceRadios.forEach((radio) => radio.addEventListener("change", updateServiceFields));

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(enquiryForm).entries());

  let message =
    `New project enquiry — Spider Web Design\n\n` +
    `Name: ${data.full_name}\n` +
    `Business: ${data.business_name}\n` +
    `Email: ${data.email}\n` +
    `Industry: ${data.industry}\n` +
    `Interested in: ${data.service_interest || "—"}\n`;

  if (data.service_interest && data.service_interest.includes("Website")) {
    message +=
      `Package interest: ${data.package_interest || "—"}\n` +
      `Website type: ${data.website_type || "—"}\n` +
      `Has a website already: ${data.has_website || "—"}\n`;
  }

  if (data.service_interest && data.service_interest.includes("Meta Ads")) {
    message +=
      `Ads goal: ${data.ads_goal || "—"}\n` +
      `Run ads before: ${data.ads_experience || "—"}\n`;
  }

  message +=
    `Budget: ${data.budget}\n` +
    `Timeline: ${data.timeline}\n` +
    `Description: ${data.description}`;

  const waUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;

  enquiryForm.hidden = true;
  enquirySuccess.hidden = false;

  setTimeout(() => {
    window.open(waUrl, "_blank", "noopener");
  }, 900);
});