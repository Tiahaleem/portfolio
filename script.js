// EmailJS setup — same account/service as before
// Guarded: if the CDN script fails to load (slow connection, blocker, etc.)
// this shouldn't take the rest of the page's JS down with it.
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: "Rgn7Diwvj42tahJGg" });
  } else {
    console.warn("EmailJS did not load — contact form will not be able to send.");
  }
})();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const sidebar = document.getElementById("sidebar");

navToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close mobile nav after tapping a link
document.querySelectorAll(".side-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Highlight the active section in the sidebar nav while scrolling
const navLinks = document.querySelectorAll(".side-nav a");
const sections = [...navLinks].map((link) =>
  document.querySelector(link.getAttribute("href"))
);

function updateActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight * 0.3;
  let currentIndex = 0;
  sections.forEach((section, i) => {
    if (section && section.offsetTop <= scrollPos) currentIndex = i;
  });
  navLinks.forEach((link, i) =>
    link.classList.toggle("active", i === currentIndex)
  );
}
window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

// Footer clock
function updateTime() {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Africa/Lagos",
  };
  document.getElementById("footer-time").textContent = now.toLocaleString(
    "en-NG",
    options
  );
}
setInterval(updateTime, 1000 * 30);
updateTime();

// Contact form
function sendMail(event) {
  event.preventDefault();

  if (typeof emailjs === "undefined") {
    showPopup("Couldn't load the mail service — please email me directly instead.", "error");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!email || !message) {
    showPopup("Please fill in your email and message.", "warning");
    return;
  }

  const params = { from_name: name || "Portfolio visitor", from_email: email, subject, message };

  const serviceID = "service_n2wt0gj";
  const templateID = "template_d0krvlw";
  const autoReplyTemplateID = "template_autoreply";

  emailjs
    .send(serviceID, templateID, params)
    .then(() => {
      showPopup("Message sent — thanks, I'll get back to you soon.", "success");
      emailjs.send(serviceID, autoReplyTemplateID, params);
      document.getElementById("contact-form").reset();
    })
    .catch(() => {
      showPopup("Couldn't send that — please try again or email me directly.", "error");
    });
}

function showPopup(message, type = "warning") {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");

  popup.className = "popup " + type;
  msg.textContent = message;
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}