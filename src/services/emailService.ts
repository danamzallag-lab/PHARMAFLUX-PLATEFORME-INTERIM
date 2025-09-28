import { Resend } from 'resend';

// Service email pour Vite/React avec Resend
export const emailService = {
  // Test d'envoi d'email
  async sendTestEmail(): Promise<{ ok: boolean; error?: string }> {
    if (!import.meta.env.RESEND_API_KEY) {
      return { ok: false, error: "RESEND_API_KEY missing" };
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const to = import.meta.env.TEST_EMAIL_TO || "you@example.com";

    try {
      const { error } = await resend.emails.send({
        from: import.meta.env.EMAIL_FROM || "Onboarding <onboarding@resend.dev>",
        to,
        subject: "PharmaFlux – test Resend",
        text: "Ceci est un test Resend depuis le client Vite/React",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">🧪 Test Email PharmaFlux</h1>
            <p>Ceci est un email de test envoyé depuis l'application React/Vite.</p>
            <p><strong>Configuration :</strong></p>
            <ul>
              <li>Service: Resend</li>
              <li>Architecture: Vite + React (client-side)</li>
              <li>Date: ${new Date().toLocaleString('fr-FR')}</li>
            </ul>
            <p style="color: #059669;">✅ L'intégration email fonctionne correctement !</p>
          </div>
        `
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  },

  // Envoi email nouvelle mission aux candidats
  async sendMissionInvite(candidateEmail: string, mission: any): Promise<{ ok: boolean; error?: string }> {
    if (!import.meta.env.RESEND_API_KEY) {
      return { ok: false, error: "RESEND_API_KEY missing" };
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    try {
      const { error } = await resend.emails.send({
        from: import.meta.env.EMAIL_FROM || "PharmaFlux <onboarding@resend.dev>",
        to: candidateEmail,
        subject: `Nouvelle mission : ${mission.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">💊 Nouvelle mission disponible</h1>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1e293b; margin-top: 0;">${mission.title}</h2>
              <p><strong>Type :</strong> ${mission.type}</p>
              <p><strong>Lieu :</strong> ${mission.location}</p>
              <p><strong>Date :</strong> ${mission.start_date}</p>
              <p><strong>Horaires :</strong> ${mission.start_time} - ${mission.end_time}</p>
              <p><strong>Taux horaire :</strong> ${mission.hourly_rate} €/h</p>
            </div>
            <p>Une mission correspondant à votre profil est disponible !</p>
            <p>Connectez-vous à votre espace candidat pour accepter ou refuser cette proposition.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}"
                 style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Voir la mission
              </a>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px;">
              PharmaFlux - Plateforme d'intérim pharmaceutique<br>
              Cet email a été envoyé automatiquement suite à un matching de profil.
            </p>
          </div>
        `
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  }
};