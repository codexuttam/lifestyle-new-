import { Inter, Playfair_Display, Big_Shoulders } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-inter",
});

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["500", "800"],
  variable: "--font-big-shoulders",
  adjustFontFallback: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "The Premium Construction | We Build Your Dreams",
  description:
    "The Premium Construction transforms empty plots into architectural masterpieces. Turnkey residential building across Delhi NCR — design, approvals, structure and finishing from one accountable team.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f5",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${bigShoulders.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
