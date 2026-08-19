/**
 * One-off: grant the `admin` custom claim to a Firebase Auth user.
 *
 * Create the user in the Firebase console first (Authentication -> Users), then:
 *   npx tsx --env-file=.env.local scripts/grant-admin.ts you@example.com
 *
 * The claim is what /api/admin/session checks before issuing a session cookie,
 * so a user without it cannot reach the CMS even with valid credentials.
 */
import { adminAuth } from "../lib/firebase/admin";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx --env-file=.env.local scripts/grant-admin.ts <email>");
    process.exit(1);
  }

  const auth = adminAuth();
  const user = await auth.getUserByEmail(email);

  if (user.customClaims?.admin) {
    console.log(`${email} already has the admin claim.`);
    return;
  }

  await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
  console.log(`Granted admin to ${email} (${user.uid}).`);
  console.log("The claim applies on next sign-in.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
