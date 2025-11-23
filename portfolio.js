document.addEventListener("DOMContentLoaded", function () {
    const typewriterText = document.querySelector("#typewriter-text");
    const phrases = [
        " Frontend-Developer ",
        " Designer ",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        const currentText = isDeleting
            ? currentPhrase.substring(0, charIndex--)
            : currentPhrase.substring(0, charIndex++);

        typewriterText.textContent = currentText;

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            delay = 70;
            setTimeout(typeEffect, 1000); // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 100;
            setTimeout(typeEffect, 500); // Pause before typing next phrase
        } else {
            setTimeout(typeEffect, delay);
        }
    }

    typeEffect();
});

function updateTime() {
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Lagos'
  };
  const formattedTime = now.toLocaleString('en-NG', options);
  document.getElementById("footer-time").textContent = ` ${formattedTime}`;
}
setInterval(updateTime, 1000);
updateTime();


function sendMail(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    showPopup("⚠️ Please fill in all fields!", "warning");
    return;
  }

  const params = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message
  };

  const serviceID = "service_n2wt0gj";
  const templateID = "template_d0krvlw";
  const autoReplyTemplateID = "template_autoreply";

  emailjs.send(serviceID, templateID, params)
    .then(() => {
      showPopup("✅ Email sent successfully!", "success");

      emailjs.send(serviceID, autoReplyTemplateID, params);

      document.getElementById("contact-form").reset();
    })
    .catch(() => {
      showPopup("❌ Failed to send email. Try again.", "error");
    });
}

function showPopup(message, type="warning") {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");

  popup.className = "popup " + type; 
  msg.textContent = message;

  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 2500);
}





  function toggleMenu() {
    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("menuToggle");

    navbar.classList.toggle("show");

    // Switch icon between ☰ and ✖
    toggle.textContent = navbar.classList.contains("show") ? "✖" : "☰";
  }



