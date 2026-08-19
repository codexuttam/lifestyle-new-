/**
 * Diagnostic: list Firebase Auth users and whether they carry the admin claim.
 *
 *   npm run check-auth
 */
import { adminAuth } from "@/lib/firebase/admin";

async function main() {
  const list = await adminAuth().listUsers(50);

  if (list.users.length === 0) {
    console.log(
      "No users exist yet. Create one in the Firebase console under\n" +
        "Authentication -> Users, then run: npm run grant-admin <email>"
    );
    return;
  }

  console.log(`${list.users.length} user(s):\n`);
  for (const user of list.users) {
    const admin = user.customClaims?.admin === true;
    console.log(
      `  ${user.email ?? user.uid}` +
        `\n    admin claim: ${admin ? "yes" : "NO - run: npm run grant-admin " + user.email}` +
        `\n    disabled:    ${user.disabled}\n`
    );
  }
}

main().catch((error) => {
  console.error("Could not reach Firebase Auth:", error.message);
  process.exit(1);
});
