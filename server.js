// === BACKEND NEWSLETTER AVEC NODEMAILER ===
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // dotenv import corrigé


const app = express();
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();

// === CONFIG TRANSPORTEUR NODEMAILER (AVEC GMAIL) ===
// ⚠️ ATTENTION : utilise ton "mot de passe d’application Gmail", pas ton mot de passe normal
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sayariyakin256@gmail.com", // ton adresse Gmail
    pass: "hyzbkahmusrcbnkg", // ton mot de passe d’application Gmail (sans espaces)
  },
});

// === ROUTE NEWSLETTER ===
// ✅ NE RIEN CHANGER ICI
app.post("/newsletter", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Adresse email manquante." });
  }

  try {
    // Envoi du mail
    await transporter.sendMail({
      from: '"Yeiza Newsletter" <sayariyakin256@gmail.com>', // adresse d’envoi
      to: email, // adresse du client qui s’abonne
      subject: "Bienvenue dans la newsletter Yeiza 💌",
      html: `
        <h2>Bienvenue 🎉</h2>
        <p>Merci de vous être abonné à la newsletter <b>Yeiza</b> 💌</p>
        <p>À très bientôt pour nos actualités exclusives !</p>
      `,
    });

    console.log(`📧 Email envoyé à : ${email}`);
    res.json({ success: true, message: "Email envoyé avec succès." });
  } catch (err) {
    console.error("❌ Erreur Nodemailer :", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email.",
    });
  }
});

// === ROUTE FORMULAIRE CONTACTEZ-NOUS ===
app.post("/send-message", async (req, res) => {
  const { fullname, email, phone, subject, message } = req.body;

  // Vérification basique
  if (!fullname || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Veuillez remplir tous les champs requis.",
    });
  }

  try {
    await transporter.sendMail({
      from: `"${fullname}" <${email}>`,
      to: "sayariyakin256@gmail.com", // l’adresse où tu veux recevoir les messages
      subject: `📩 Nouveau message de contact - ${subject || "Sans sujet"}`,
      html: `
        <h3>Nouveau message de contact reçu :</h3>
        <p><strong>Nom :</strong> ${fullname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "Non fourni"}</p>
        <p><strong>Sujet :</strong> ${subject || "Non précisé"}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `,
    });

    console.log(`📬 Message de contact reçu de : ${fullname}`);
    res.json({ success: true, message: "Votre message a bien été envoyé !" });
  } catch (err) {
    console.error("❌ Erreur Nodemailer (contact) :", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message.",
    });
  }
});

// === LANCEMENT DU SERVEUR ===
app.listen(3000, () => {
  console.log("🚀 Serveur backend lancé sur http://127.0.0.1:3000");
});
