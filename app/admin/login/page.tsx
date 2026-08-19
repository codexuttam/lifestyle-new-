"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { clientAuth } from "@/lib/firebase/client";
import { firebaseClientConfig } from "@/lib/env.public";
import styles from "../admin.module.css";

/**
 * Firebase reports configuration problems through the same channel as a wrong
 * password. Collapsing them all into "not recognised" hides the real cause, so
 * each is named explicitly.
 */
function explain(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "That email and password combination was not recognised.";
    case "auth/user-disabled":
      return "That account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Could not reach Firebase. Check your connection.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled for this Firebase project. Enable it under Authentication -> Sign-in method.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid":
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      return "The Firebase web API key is missing or wrong. Check NEXT_PUBLIC_FIREBASE_API_KEY in .env.local and restart the dev server.";
    case "auth/configuration-not-found":
      return "This Firebase project has no auth configuration. Enable Authentication in the Firebase console.";
    default:
      return `Sign-in failed (${code}).`;
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // NEXT_PUBLIC_* values are inlined at build time, so an empty one here means
  // the server was started without them.
  const configured = Boolean(
    firebaseClientConfig.apiKey && firebaseClientConfig.authDomain
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      // Imported lazily so the Firebase SDK stays out of the initial bundle.
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const credential = await signInWithEmailAndPassword(
        clientAuth(),
        email,
        password
      );

      // Trade the ID token for an httpOnly session cookie; the browser never
      // holds a long-lived credential.
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await credential.user.getIdToken() }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Sign-in failed.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      const code =
        typeof caught === "object" && caught !== null && "code" in caught
          ? String((caught as { code: unknown }).code)
          : "";

      setError(
        code
          ? explain(code)
          : caught instanceof Error
            ? caught.message
            : "Sign-in failed."
      );
      setBusy(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <form className={styles.loginCard} onSubmit={onSubmit}>
        <h1 className={styles.loginTitle}>The Premium Construction</h1>
        <p className={styles.loginIntro}>Content management sign-in.</p>

        {!configured && (
          <p className={styles.notice}>
            Firebase is not configured in this build. Fill in the
            NEXT_PUBLIC_FIREBASE_* values in .env.local and restart the server.
          </p>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          className={styles.submit}
          type="submit"
          disabled={busy || !configured}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </main>
  );
}
