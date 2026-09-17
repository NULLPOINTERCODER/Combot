// SIMULATED email delivery (Section 6/7 explicitly do not require real email).
// In dev we just log the "email" to the console with the action URL.
// A real implementation would swap this for nodemailer/SES/SendGrid etc.
export function sendSimulatedEmail({ to, subject, actionUrl }) {
  console.log("\n===== [SIMULATED EMAIL] =====");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Action URL: ${actionUrl}`);
  console.log("==============================\n");
}
