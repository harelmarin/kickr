package com.kickr_server.notification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Service pour l'envoi d'emails (ex: réinitialisation de mot de passe).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${kickr.mail.from:contact@kickrhq.com}")
    private String fromEmail;

    /**
     * Envoie un email de réinitialisation de mot de passe.
     *
     * @param toEmail   L'adresse du destinataire
     * @param resetLink Le lien de réinitialisation contenant le token
     */
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Kickr Security: Restore Your Access");

            String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <body style="margin: 0; padding: 0; background-color: #050607; font-family: 'Inter', Arial, sans-serif; color: #ffffff;">
                        <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050607; padding: 40px 20px;">
                            <tr>
                                <td align="center">
                                    <table width="100%%" max-width="500px" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0f12; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                                        <!-- Header Accent -->
                                        <tr><td height="4" style="background: linear-gradient(to right, #00f2fe, #4facfe, #00f2fe);"></td></tr>

                                        <tr>
                                            <td style="padding: 40px; text-align: center;">
                                                <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic;">Kickr</h1>
                                                <p style="margin: 10px 0 0 0; font-size: 10px; font-weight: 800; color: #4facfe; text-transform: uppercase; letter-spacing: 4px;">Security Protocol</p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding: 0 40px 40px 40px; text-align: center;">
                                                <p style="margin: 0; font-size: 14px; line-height: 24px; color: #99aabb;">
                                                    A tactical password reset was requested. Verify your identity and restore access to your account by clicking the link below.
                                                </p>

                                                <div style="margin: 40px 0;">
                                                    <a href="%s" style="display: inline-block; padding: 18px 40px; background-color: #4facfe; color: #ffffff; text-decoration: none; border-radius: 16px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; box-shadow: 0 10px 20px rgba(79, 172, 254, 0.2);">Restore Access</a>
                                                </div>

                                                <p style="margin: 0; font-size: 10px; color: #445566; text-transform: uppercase; letter-spacing: 1px;">
                                                    Link expires in 60 minutes.
                                                </p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding: 30px; background-color: rgba(255,255,255,0.02); text-align: center;">
                                                <p style="margin: 0; font-size: 10px; color: #334455; text-transform: uppercase; letter-spacing: 2px;">
                                                    If you didn't request this, ignore this transmission.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                    """
                    .formatted(resetLink);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Stylish reset email dispatched to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to generate stylized email for {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Email generation error", e);
        }
    }
}
