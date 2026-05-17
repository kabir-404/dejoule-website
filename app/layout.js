import { Geist, Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "DeJoule — Smart Building Intelligence",
  description:
    "Making alerts relevant, personalized, and directly actionable. AFDD-powered building intelligence platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${workSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
