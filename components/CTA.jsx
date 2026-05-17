"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.96 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none"
      >
        <div
          id="contact"
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 pointer-events-auto overflow-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-7">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-[#ca3604] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1L10 4V8L6 11L2 8V4L6 1Z" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#ca3604] uppercase tracking-wide">DeJoule</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Let&apos;s connect</h2>
              <p className="text-sm text-gray-500 mt-1">Tell us about your building — we&apos;ll reach out within 24 hours.</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Message sent!</h3>
              <p className="text-sm text-gray-500 mt-2">We&apos;ll be in touch within one business day.</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    id="name" name="name" type="text" required
                    value={form.name} onChange={handleChange} placeholder="Alex Johnson"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ca3604]/20 focus:border-[#ca3604] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">Work Email</label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange} placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ca3604]/20 focus:border-[#ca3604] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1.5">Tell us about your building</label>
                <textarea
                  id="message" name="message" required rows={4}
                  value={form.message} onChange={handleChange}
                  placeholder="What challenges are you looking to solve? How many buildings are in your portfolio?"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ca3604]/20 focus:border-[#ca3604] transition-colors resize-none"
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">
                  Something went wrong — please try again or email us directly.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-[#ca3604] text-white text-sm font-semibold rounded-full hover:bg-[#cd3f14] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  "Send Message →"
                )}
              </button>
              <p className="text-center text-xs text-gray-400">No spam, ever. We only use your info to respond to your inquiry.</p>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}

function SectionReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function CTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <>
      <section id="contact" className="relative py-24 lg:py-36 bg-white">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <h2
              className="text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.4] tracking-[-0.06em]"
              style={{ color: "#1b1b1b", fontFamily: "var(--font-work-sans), var(--font-geist-sans), sans-serif" }}
            >
              <span style={{ fontWeight: 300 }}>Let&apos;s unlock the </span>
              <span style={{ fontWeight: 600 }}>peak performance</span>
              <span style={{ fontWeight: 300 }}> and </span>
              <span style={{ fontWeight: 600 }}>efficiency</span>
              <span style={{ fontWeight: 300 }}> of your building.</span>
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="mt-12 flex justify-center">
              <motion.button
                onClick={() => setModalOpen(true)}
                onHoverStart={() => setCtaHovered(true)}
                onHoverEnd={() => setCtaHovered(false)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative overflow-hidden flex items-center justify-center px-9 py-4 rounded-full border"
                style={{
                  borderColor: "rgba(255,255,255,0.43)",
                  boxShadow: ctaHovered
                    ? "0 8px 24px rgba(202,54,4,0.4)"
                    : "0px -0.87px 2.61px 0px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full pointer-events-none group-hover:opacity-0 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(180deg, rgb(255,255,255) 5.08%, rgb(194,205,216) 94.92%)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "#b33004" }}
                />
                <span
                  className="relative whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-work-sans), var(--font-geist-sans), sans-serif",
                    fontWeight: 500,
                    fontSize: "22px",
                    letterSpacing: "-2px",
                    lineHeight: 1.41,
                    ...(ctaHovered
                      ? { color: "#ffffff", WebkitTextFillColor: "#ffffff", background: "none" }
                      : {
                          background: "linear-gradient(90deg, #ca3604 3.64%, #000000 91.45%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }),
                  }}
                >
                  Let&apos;s connect
                </span>
                <div
                  className="absolute inset-0 rounded-full pointer-events-none group-hover:opacity-0 transition-opacity duration-300"
                  style={{
                    boxShadow: "inset 0px 3.48px 13.05px 0px #f8f0e0, inset 0px -1.74px 3.48px 0px rgba(0,0,0,0.1)",
                  }}
                />
              </motion.button>
            </div>
          </SectionReveal>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
