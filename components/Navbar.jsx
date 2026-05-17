"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Resources", href: "#resources" },
  { label: "Operational Excellence", href: "#excellence" },
  {
    label: "Solutions",
    dropdown: [
      { label: "Smart Analytics & Reporting", href: "#analytics" },
      { label: "Smart Alerts", href: "#alerts" },
      { label: "Facility-Wide Monitoring", href: "#monitoring" },
      { label: "Intelligent Automation", href: "#automation" },
    ],
  },
  { label: "A Day in a Building", href: "#day" },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M2 4L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const EASE = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ opacity: footerVisible ? 0 : 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{ pointerEvents: footerVisible ? "none" : "auto" }}
    >
      <header
        className=""
        style={{ background: "#d6dce8" }}
      >
        <div className="max-w-[1580px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[72px] lg:h-[88px]">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start shrink-0">
              <Image
                src="/logo-navbar.png"
                alt="DeJoule"
                width={140}
                height={42}
                className="h-[42px] w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1.5 px-5 py-2 text-[17px] text-[#565656] hover:text-[#1b1b1b] transition-colors rounded-lg hover:bg-black/5"
                      style={{
                        fontFamily: "var(--font-geist-sans), sans-serif",
                      }}
                    >
                      {link.label}
                      <ChevronIcon open={openDropdown === link.label} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute top-full left-0 pt-2 w-64"
                        >
                          <div className="bg-white rounded-xl shadow-xl border border-gray-100/80 py-2">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#565656] hover:text-[#ca3604] hover:bg-orange-50/60 transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-5 py-2 text-[17px] text-[#565656] hover:text-[#1b1b1b] transition-colors rounded-lg hover:bg-black/5"
                    style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#565656] hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation"
            >
              <span className="flex flex-col gap-1.5 w-5">
                <span
                  className={`h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}
                />
                <span
                  className={`h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="px-4 py-5 space-y-1 bg-white">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div key={link.label}>
                      <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        {link.label}
                      </p>
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 pl-6 pr-3 py-2 text-sm text-[#565656] hover:text-[#ca3604] transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-[#565656] hover:text-[#ca3604] transition-colors rounded-lg"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </motion.div>
  );
}
