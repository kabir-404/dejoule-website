"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const alertCards = [
  {
    id: 1,
    title: "CHILLER 2 250TR SJPL TRIPPED",
    description: "Critical fault detected in main chiller unit. Immediate inspection required.",
    floatAnim: "float 5s ease-in-out infinite",
    delay: 0.55,
  },
  {
    id: 2,
    title: "4F NW CORRIDOR AHU AREA OVERCOOLED",
    description: "Zone temperature 3.2°C below setpoint. Occupant comfort impacted.",
    floatAnim: "floatAlt 6.5s ease-in-out infinite",
    delay: 0.7,
  },
  {
    id: 3,
    title: "CHILLED WATER PUMP 1 MAINTAINANCE REQUIRED",
    description: "Scheduled service window approaching. Plan technician visit within 48 hrs.",
    floatAnim: "floatSlow 7s ease-in-out infinite 1.2s",
    delay: 0.85,
  },
];

function WarningIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path d="M7 1L13.5 12H0.5L7 1Z" fill="#FEF0E4" />
      <path d="M7 1L13.5 12H0.5L7 1Z" stroke="#E84B1A" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M7 5V8" stroke="#E84B1A" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.7" fill="#E84B1A" />
    </svg>
  );
}

function AlertCard({ title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-52">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center flex-shrink-0">
          <WarningIcon />
        </div>
        <span className="text-[10px] text-gray-400 font-medium leading-tight">Smart alert from Dejoule</span>
      </div>
      <p className="text-[11px] font-bold text-[#E84B1A] leading-tight mb-1.5">{title}</p>
      <p className="text-[10px] text-gray-400 leading-snug">{description}</p>
    </div>
  );
}

function LockScreen() {
  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "linear-gradient(160deg, #1C2B4A 0%, #0F1A30 100%)" }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[11px] font-semibold text-white/80">11:11</span>
        <div className="flex items-center gap-1 text-white/60">
          <svg width="12" height="9" viewBox="0 0 12 9" fill="currentColor">
            <rect x="0" y="5" width="2" height="4" rx="0.5" opacity="0.4" />
            <rect x="3" y="3" width="2" height="6" rx="0.5" opacity="0.6" />
            <rect x="6" y="1" width="2" height="8" rx="0.5" />
            <rect x="9.5" y="3" width="2" height="5" rx="0.8" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <rect x="10" y="4" width="1" height="3" rx="0.4" />
          </svg>
        </div>
      </div>

      {/* Time display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-[10px] text-white/45 font-medium mb-2 tracking-wide">Friday, 16 May</p>
        <p className="text-[56px] font-thin text-white tracking-tight leading-none">11:11</p>
        <p className="text-[10px] text-white/35 mt-3 tracking-widest uppercase">Slide to unlock</p>
      </div>

      {/* Notifications */}
      <div className="px-3 pb-4 space-y-2">
        {[
          { title: "CHILLER 2 250TR SJPL TRIPPED", time: "now" },
          { title: "4F NW CORRIDOR AHU OVERCOOLED", time: "2m" },
          { title: "PUMP 1 MAINTAINANCE REQUIRED", time: "5m" },
        ].map((n, i) => (
          <div key={i} className="bg-white/14 rounded-xl px-3 py-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-[#E84B1A] flex items-center justify-center flex-shrink-0">
                <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                  <path d="M3.5 0.5L6.5 5.5H0.5L3.5 0.5Z" fill="white" />
                </svg>
              </div>
              <span className="text-[9px] text-white/55 font-medium">DeJoule · {n.time}</span>
            </div>
            <p className="text-[9.5px] font-semibold text-white leading-tight">{n.title}</p>
          </div>
        ))}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-3">
        <div className="w-20 h-1 bg-white/25 rounded-full" />
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, #ECEEF2 0%, #F4F5F8 35%, #FAFAFA 65%, #FFFFFF 100%)",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 flex flex-col items-center text-center flex-1">
        {/* Text block */}
        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-[11px] font-bold tracking-widest text-[#E84B1A] uppercase">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#E84B1A]"
                style={{ animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
              />
              AFDD Powered by Smart Alerts
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-7 max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-[60px] xl:text-[68px] leading-[1.08] tracking-tight text-gray-900"
          >
            <span className="font-light">Making alerts </span>
            <span className="font-semibold">relevant,</span>
            <br />
            <span className="font-semibold text-[#E84B1A]">personalized,</span>
            <span className="font-light"> and directly</span>
            <br />
            <span className="font-semibold">actionable</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 max-w-lg mx-auto text-base sm:text-lg text-gray-500 leading-relaxed"
          >
            DeJoule&apos;s AFDD platform cuts through alert noise to deliver precise,
            prioritized building intelligence — to the people who need it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="#contact"
              className="px-8 py-3.5 bg-[#E84B1A] text-white text-sm font-semibold rounded-full hover:bg-[#cd3f14] transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5"
            >
              Request a Demo
            </a>
            <a
              href="#sticky-scroll"
              className="px-8 py-3.5 text-gray-700 text-sm font-medium rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              See How It Works →
            </a>
          </motion.div>
        </motion.div>

        {/* ── Phone + floating cards ── */}
        <div
          className="relative mt-16 lg:mt-20 w-full max-w-5xl mx-auto flex items-center justify-center"
          style={{ height: "580px" }}
        >
          {/* Card: top-right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: alertCards[0].delay }}
            className="absolute top-8 right-2 lg:right-12 z-10 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <AlertCard title={alertCards[0].title} description={alertCards[0].description} />
            </motion.div>
          </motion.div>

          {/* Card: left (middle) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.55, delay: alertCards[1].delay }}
            className="absolute left-0 lg:left-8 top-1/2 -translate-y-1/2 z-10 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 7, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
            >
              <AlertCard title={alertCards[1].title} description={alertCards[1].description} />
            </motion.div>
          </motion.div>

          {/* Card: bottom-right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: alertCards[2].delay }}
            className="absolute bottom-12 right-4 lg:right-20 z-10 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1.2 }}
            >
              <AlertCard title={alertCards[2].title} description={alertCards[2].description} />
            </motion.div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ scale: 0.76, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ y: phoneY }}
            className="relative z-20 flex-shrink-0"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-[44px] -z-10 scale-110 blur-3xl"
              style={{ background: "radial-gradient(ellipse, rgba(232,75,26,0.14) 0%, transparent 70%)" }}
            />
            {/* Shell */}
            <div className="w-56 sm:w-64 h-[480px] sm:h-[540px] rounded-[44px] border-[8px] border-gray-900 bg-gray-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.40)] relative overflow-hidden">
              {/* Dynamic island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-b-3xl z-10 flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-700" />
                <div className="w-3.5 h-1 rounded-full bg-gray-700" />
              </div>
              {/* Screen */}
              <div className="absolute inset-0 rounded-[36px] overflow-hidden pt-6">
                <LockScreen />
              </div>
              {/* Reflection */}
              <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/6 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <svg width="16" height="26" viewBox="0 0 16 26" fill="none">
              <rect x="1" y="1" width="14" height="24" rx="7" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="7" r="2.5" fill="currentColor" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
