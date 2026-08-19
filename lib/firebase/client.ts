"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { firebaseClientConfig } from "@/lib/env.public";

/**
 * Browser-side Firebase. Used only by the admin login screen — public pages
 * read content server-side and never load this bundle.
 *
 * Note: `getAnalytics()` is deliberately not called here. It throws during SSR
 * and needs an `isSupported()` guard; add it behind a `useEffect` if analytics
 * is ever wanted.
 */
export function clientApp() {
  return getApps().length ? getApp() : initializeApp(firebaseClientConfig);
}

export function clientAuth() {
  return getAuth(clientApp());
}
