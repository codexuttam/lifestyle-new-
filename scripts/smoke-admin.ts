/**
 * Verify every admin page renders for a signed-in admin.
 *
 *   npm run smoke -- http://localhost:3000
 *
 * Mints a session the same way the login form does — custom token, exchanged
 * for an ID token, traded for the session cookie — so the pages are exercised
 * through the real auth path rather than a bypass.
 */
import { adminAuth } from "@/lib/firebase/admin";

const base = process.argv[2] ?? "http://localhost:3000";
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const PAGES = [
  "/admin",
  "/admin/home",
  "/admin/projects",
  "/admin/projects/new",
  "/admin/services",
  "/admin/services/new",
  "/admin/testimonials",
  "/admin/testimonials/new",
  "/admin/faqs",
  "/admin/faqs/new",
  "/admin/gallery",
  "/admin/gallery/new",
  "/admin/company",
  "/admin/settings",
  "/admin/media",
  "/admin/leads",
];

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/projects",
  "/services",
  "/contact",
  "/paint-visualizer",
];

async function sessionCookie() {
  const users = await adminAuth().listUsers(1);
  const user = users.users.find((entry) => entry.customClaims?.admin === true);
  if (!user) throw new Error("No user carries the admin claim.");

  const customToken = await adminAuth().createCustomToken(user.uid, {
    admin: true,
  });

  const exchange = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    }
  );

  if (!exchange.ok) {
    throw new Error(`Token exchange failed: ${await exchange.text()}`);
  }

  const { idToken } = (await exchange.json()) as { idToken: string };

  const session = await fetch(`${base}/api/admin/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!session.ok) {
    throw new Error(`Session failed: ${session.status} ${await session.text()}`);
  }

  const setCookie = session.headers.get("set-cookie") ?? "";
  const value = setCookie.split(";")[0];
  if (!value.startsWith("__session=")) {
    throw new Error("No session cookie returned.");
  }
  return value;
}

async function main() {
  let failures = 0;

  for (const path of PUBLIC_PAGES) {
    const response = await fetch(`${base}${path}`);
    const ok = response.status === 200;
    if (!ok) failures += 1;
    console.log(`${ok ? "ok  " : "FAIL"} ${response.status}  ${path}`);
  }

  const cookie = await sessionCookie();
  console.log("\nsigned in\n");

  for (const path of PAGES) {
    const response = await fetch(`${base}${path}`, { headers: { cookie } });
    const body = await response.text();
    // A runtime render error still returns 200 in dev, so check the body too.
    const broken =
      body.includes("Runtime Error") ||
      body.includes("Unhandled Runtime Error") ||
      body.includes("call-stack-frame");
    const ok = response.status === 200 && !broken;
    if (!ok) failures += 1;
    console.log(
      `${ok ? "ok  " : "FAIL"} ${response.status}${broken ? " render-error" : ""}  ${path}`
    );
  }

  console.log(failures === 0 ? "\nAll pages rendered." : `\n${failures} failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
