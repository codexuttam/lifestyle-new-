/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Allow isolated production build verification (NEXT_DIST_DIR=.next-build)
   * without clobbering a live `next dev` server's `.next` directory.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /**
   * firebase-admin resolves some of its dependencies at runtime, which the
   * bundler mangles. Leaving it external hands resolution back to Node — the
   * arrangement its own docs assume.
   */
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
