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
  title: "Aura by Lifestyle | 15-Storey Ultra-Luxury Landmark, Amravati",
  description:
    "Aura by Lifestyle — Amravati's premier 15-storey architectural highrise in Congress Nagar featuring 2 & 3 BHK luxury residences, rooftop infinity pool, 40+ sky thrills, and high-street commercial arcade. MahaRERA: P5030002502915.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06090e",
  colorScheme: "dark",
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
