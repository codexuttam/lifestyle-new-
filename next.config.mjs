/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * firebase-admin resolves some of its dependencies at runtime, which the
   * bundler mangles. Leaving it external hands resolution back to Node — the
   * arrangement its own docs assume.
   */
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
