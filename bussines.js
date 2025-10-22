// Gestion du menu toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileDropdown = document.getElementById('mobileDropdown');

// Toggle du menu mobile
if (navToggle && mobileDropdown) {
  navToggle.addEventListener('click', () => {
    mobileDropdown.classList.toggle('show'); // Affiche/masque le menu
  });
}

// Gestion de la navigation : clique sur un bouton mobile
document.querySelectorAll('.mobile-dropdown .app-btn').forEach(button => {
  button.addEventListener('click', function () {
    const targetPage = this.getAttribute('href'); // Récupère l'URL de la page
    window.location.href = targetPage; // Redirige directement
  });
});


// === NEWSLETTER (ENVOI AU BACKEND NODEMAILER) ===
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletterForm');
  const emailInput = newsletterForm?.querySelector('input[type="email"]');

  if (newsletterForm && emailInput) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) return alert("Veuillez entrer votre adresse email 📧");
      if (!emailRegex.test(email)) return alert("Adresse email invalide ❌");

      try {
        const response = await fetch('http://127.0.0.1:3000/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log("Réponse du serveur:", data);

        if (data.success) {
          emailInput.value = '';
          alert("Merci 🎉 Vous êtes abonné à la newsletter Yeiza 💌");
        } else {
          alert(data.message || "Une erreur est survenue ⚠️");
        }
      } catch (err) {
        console.error("Erreur réseau :", err);
        alert("Impossible de se connecter au serveur 😢");
      }
    });
  }
});



   const track = document.getElementById("carouselTrack");

  // Dupliquer les cartes pour effet infini
  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  let position = 0;
  const speed = 0.4; // vitesse du défilement

  function animate() {
    position -= speed;
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0; // reset fluide sans coupure
    }
    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();


  document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    fullname: document.getElementById("fullname").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  if (!formData.fullname || !formData.email || !formData.message) {
    return Swal.fire({
      title: "⚠️ Champs manquants",
      text: "Merci de remplir tous les champs requis.",
      icon: "warning",
      confirmButtonText: "Ok",
      background: "#fff0f8",
      color: "#ED99F5",
      confirmButtonColor: "#ED99F5",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" }
    });
  }

  // Popup de chargement avec cœur animé
  Swal.fire({
    title: "Envoi du message...",
    html: `<div style="font-size:50px; color:#ED99F5;" class="animate__animated animate__heartBeat animate__infinite">🩷</div>
           <p style="color:#ED99F5; margin-top:10px;">Merci de patienter...</p>`,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: "#F9F9FF",
  });

  try {
    const res = await fetch("http://127.0.0.1:3000/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    Swal.close();

    if (res.ok && data.success) {
      Swal.fire({
        title: "🩷 Message envoyé !",
        html: `
          <div style="font-size:50px; color:#ED99F5; animation: heartbeat 1s infinite;">🩷</div>
          <p style="font-family: 'Poppins', sans-serif; font-weight:500; color:#000; font-size:16px; margin-top:10px;">
            Merci <strong>${formData.fullname}</strong> !
          </p>
          <p style="font-family: 'Poppins', sans-serif; font-weight:400; color:#000; font-size:15px;">
            Votre message a été envoyé avec succès à notre équipe Yeiza.
          </p>
        `,
        background: "#fff",
        color: "#000",
        confirmButtonText: "Parfait ✨",
        confirmButtonColor: "#ED99F5",
        showClass: { popup: "animate__animated animate__zoomIn" },
        hideClass: { popup: "animate__animated animate__fadeOut" }
      });
      this.reset();
    } else {
      Swal.fire({
        title: "Erreur 😢",
        text: data.message || "Une erreur est survenue. Veuillez réessayer.",
        icon: "error",
        confirmButtonText: "Réessayer",
        confirmButtonColor: "#E74C3C",
        showClass: { popup: "animate__animated animate__shakeX" },
        hideClass: { popup: "animate__animated animate__fadeOut" }
      });
    }
  } catch (err) {
    Swal.close();
    Swal.fire({
      title: "Erreur de connexion 🚫",
      text: "Impossible de contacter le serveur. Vérifiez votre connexion.",
      icon: "error",
      confirmButtonText: "Réessayer",
      confirmButtonColor: "#E74C3C",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" }
    });
  }
});
