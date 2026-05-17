"use client";

import Link from "next/link";
import Image from "next/image";

const ORANGE = "#ca3604";

const companyLinks = [
  { label: "Operational Excellence", href: "#excellence" },
  { label: "A Day in a Building", href: "#day" },
  { label: "Smart Alerts", href: "#alerts" },
  { label: "Analytics & Reporting", href: "#analytics" },
  { label: "About Us", href: "#about" },
  { label: "Resources", href: "#resources" },
];

const solutionsLinks = [
  { label: "Full-Stack BMS", href: "#bms" },
  { label: "Chiller Plant Optimization", href: "#chiller" },
];

const socialLinks = [
  { label: "YouTube",   href: "https://youtube.com",   icon: "/icon-social-yt.png" },
  { label: "LinkedIn",  href: "https://linkedin.com",  icon: "/icon-social-li.png" },
  { label: "x.com",    href: "https://x.com",         icon: "/icon-social-x.png"  },
  { label: "Instagram", href: "https://instagram.com", icon: "/icon-social-ig.png" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(176.8deg, rgb(250,251,252) 5.84%, rgb(240,243,247) 131.41%)",
        boxShadow: "inset 0px 2px 20.1px 0px rgba(222,222,222,0.3)",
        borderRadius: "64px 64px 0 0",
      }}
    >
      <div className="max-w-[1580px] mx-auto px-6 lg:px-12 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-gray-200/60">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-footer.png"
                alt="DeJoule"
                width={200}
                height={60}
                className="h-[60px] w-auto object-contain"
              />
            </Link>
            <p
              className="text-[11px] font-light tracking-[0.08em] uppercase"
              style={{ color: ORANGE, fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              INTELLIGENCE MEETS IMPACT
            </p>
          </div>

          {/* Company */}
          <div>
            <p
              className="font-medium uppercase mb-6"
              style={{ color: ORANGE, fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "16px", letterSpacing: "-0.5px" }}
            >
              COMPANY
            </p>
            <ul className="space-y-5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-medium transition-colors hover:text-[#1b1b1b]"
                    style={{ color: "rgba(0,0,0,0.6)", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "16px", letterSpacing: "-0.5px" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <p
              className="font-medium uppercase mb-6"
              style={{ color: ORANGE, fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "16px", letterSpacing: "-0.5px" }}
            >
              SOLUTIONS
            </p>
            <ul className="space-y-5">
              {solutionsLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-medium transition-colors hover:text-[#1b1b1b]"
                    style={{ color: "rgba(0,0,0,0.6)", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "16px", letterSpacing: "-0.5px" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p
              className="font-medium uppercase mb-6"
              style={{ color: ORANGE, fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "16px", letterSpacing: "-0.5px" }}
            >
              SOCIAL
            </p>
            <ul className="space-y-5">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                  >
                    <Image src={s.icon} alt={s.label} width={22} height={22} className="object-contain" />
                    <span
                      className="font-medium"
                      style={{ color: "rgba(0,0,0,0.6)", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "16px", letterSpacing: "-0.5px" }}
                    >
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p
            style={{ color: "rgba(27,27,27,0.7)", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "18px", letterSpacing: "-1px", lineHeight: 1.18 }}
          >
            © 2025 All Rights Reserved
          </p>
          <div
            className="flex items-center gap-1"
            style={{ color: "rgba(27,27,27,0.7)", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "18px", letterSpacing: "-1px", lineHeight: 1.18 }}
          >
            <Link href="#" className="hover:text-[#1b1b1b] transition-colors">Terms and Conditions</Link>
            <span className="mx-2">|</span>
            <Link href="#" className="hover:text-[#1b1b1b] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
