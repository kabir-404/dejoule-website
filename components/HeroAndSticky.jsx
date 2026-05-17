"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1];

// ── Phase timings (ms) — Issue 5: all +500ms ─────────────────────────────────
const T2 = 1700; // phone uprights
const T3 = 3300; // cards + phone screen appear
const T4 = 5500; // phone shifts right, headline exits
const T5 = 7000; // left panel fades in
const T_ITEMS = [7000, 8000, 9300, 10600]; // items 0-3 activate

// ── Animation durations (s) — Issue 5: all +0.5s ─────────────────────────────
const D_ENTER = 1.9; // phone enter
const D_CARDS = 1.4; // cards + phone screen slide in
const D_SHIFT = 1.8; // phone shifts right, headline exits
const D_PANEL = 1.5; // left panel fades in
const D_ITEM = 1.3; // item enter/exit

// ── Alert cards ───────────────────────────────────────────────────────────────
// Container: left=11.96vw, top=22.6vh, 75vw×66.8vh
const CARD_DATA = [
  {
    id: "top-right",
    title: "CHILLER 2 250TR SJPL TRIPPED",
    body: "Chiller tripped due to high discharge pressure caused by insufficent cooling tower operation...",
    pos: { top: "5%", left: "65%" },
    entryX: 60,
    entryY: -20,
    delay: 0,
  },
  {
    id: "left",
    title: "4F NW CORRIDOR AHU AREA OVERCOOLED",
    body: "4F NW Corridor area is overcooled where the area temperature is below the setpoint while the valve...",
    pos: { top: "30%", left: "0%" },
    entryX: -60,
    entryY: 0,
    delay: 0.08,
  },
  {
    id: "bottom-right",
    title: "CHILLED WATER PUMP 1 MAINTAINANCE REQUIRED",
    body: "Low power consumption detected for CHWP possibly due to blocked strainer",
    pos: { top: "48%", left: "62%" },
    entryX: 60,
    entryY: 20,
    delay: 0.16,
  },
];

// ── Left panel items ──────────────────────────────────────────────────────────
const ITEMS = [
  {
    title: "Role-based & SLA-driven",
    description:
      "Get alerts that match your responsibility without any notification clutter. One-click alert subscriptions and SLA-based escalations save time and make everyone efficient.",
  },
  {
    title: "Root-cause analysis",
    description:
      "Get alerts that tell you the root cause of the problem and history of its occurrence, based on real-time analysis of equipment and building operations.",
  },
  {
    title: "Actionable solutions",
    description:
      "Replace reactive firefighting with direct resolution actions or recommendations to prevent failures, maintain peak performance, and keep your building one step ahead.",
  },
  {
    title: "Multi-channel delivery",
    description:
      "No more lifeless information buried in a BMS, but insights delivered wherever your team works best, on WhatsApp, SMS, or email.",
  },
];

// ── Phone screen notification cards (Figma Variant3 node 1:673) ───────────────
// Issue 3: now positioned INSIDE phone motion.div (moves/scales with phone).
// Cluster: left=8.8%, top=14.2% of phone (67/761, 133/935)
//          width=39.7%, height=39.36% of phone (302/761, 368/935)
// Outer cluster: rotate(-14.38deg)
// Inner cards: rotate(8.39deg) skewX(9.67deg) scaleX(1.01) scaleY(0.97)
// Card width: 69.5% of cluster (210/302)
// Card top/left offsets as % of cluster dimensions:
//   Messages: top=-4.29/368=-1.17%, left=-14.34/302=-4.75%
//   WhatsApp: top=92.17/368=25.05%, left=-9.75/302=-3.23%
//   Mail:     top=181.5/368=49.32%, left=-9.99/302=-3.31%
const NOTIF_CARDS = [
  {
    app: "MESSAGES",
    icon: "/phone-icon-messages.svg",
    time: "now",
    title: "RECIPE ALERT",
    body: "The 280 TR chiller has tripped and alarm code is 1. Check plant room conditions...",
    topPct: -1.17,
    leftPct: -4.75,
  },
  {
    app: "WHATSAPP",
    icon: "/phone-icon-whatsapp.svg",
    time: "2m ago",
    title: "4F NW CORRIDOR AHU AREA OVERCOOLED",
    body: "Hello Rahul, 4F NW Corridor area is overcooled where the area is...",
    topPct: 19.0,
    leftPct: -3.23,
  },
  {
    app: "MAIL",
    icon: "/phone-icon-mail.svg",
    time: "1m ago",
    title: "CHILLER 2 250TR TRIPPED",
    body: "Hello Rahul, Chiller tripped due to high discharge pressure caused...",
    topPct: 39.0,
    leftPct: -3.31,
  },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
function DotGridIcon() {
  return (
    <svg width="13" height="21" viewBox="0 0 13 21" fill="none">
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={2.75 + col * 7.5}
            cy={2.75 + row * 7.5}
            r="2.75"
            fill="#ca3604"
          />
        )),
      )}
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path d="M7 1L13.5 12H0.5L7 1Z" fill="#FEF0E4" />
      <path
        d="M7 1L13.5 12H0.5L7 1Z"
        stroke="#E84B1A"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M7 5V8"
        stroke="#E84B1A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="10" r="0.7" fill="#E84B1A" />
    </svg>
  );
}

// ── Alert card ────────────────────────────────────────────────────────────────
function AlertCard({ title, body }) {
  return (
    <div
      style={{
        width: "438px",
        borderRadius: "11.786px",
        background:
          "linear-gradient(165.43deg, #ffffff 57.33%, #e7ecf2 108.88%)",
        boxShadow:
          "8px 5px 13px 6px rgba(0,0,0,0.01), inset 0px 2px 20.1px 0px rgba(222,222,222,0.3)",
        backdropFilter: "blur(0.5px)",
        padding: "24px 27px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8.3px" }}>
        <div
          style={{
            width: "33.2px",
            height: "33.2px",
            borderRadius: "3.05px",
            flexShrink: 0,
            background:
              "linear-gradient(180deg, rgba(255,227,215,0.42) 0%, rgba(255,178,143,0.42) 100%)",
            border: "0.504px solid rgba(202,54,4,0.23)",
            backdropFilter: "blur(15.9px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WarningIcon />
        </div>
        <span
          style={{
            fontFamily: "var(--font-work-sans), sans-serif",
            fontWeight: 500,
            fontSize: "16.6px",
            color: "#1b1b1b",
            letterSpacing: "-0.83px",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          Smart alert from Dejoule
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <p
          style={{
            fontFamily: "var(--font-geist-sans), Inter, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "uppercase",
            color: "#ca3604",
            letterSpacing: "-0.6px",
            lineHeight: 1.41,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-geist-sans), Inter, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            color: "#676767",
            letterSpacing: "-0.6px",
            lineHeight: 1.41,
            width: "auto",
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HeroAndSticky() {
  const [phase, setPhase] = useState(1);
  const [activeItem, setActiveItem] = useState(-1);

  // Phase progression timers
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(2), T2),
      setTimeout(() => setPhase(3), T3),
      setTimeout(() => setPhase(4), T4),
      setTimeout(() => setPhase(5), T5),
      setTimeout(() => setActiveItem(0), T_ITEMS[0]),
      setTimeout(() => setActiveItem(1), T_ITEMS[1]),
      setTimeout(() => setActiveItem(2), T_ITEMS[2]),
      setTimeout(() => setActiveItem(3), T_ITEMS[3]),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const titleStyle = {
    fontFamily: "var(--font-work-sans), sans-serif",
    fontWeight: 500,
    fontSize: "clamp(18px, 1.8vw, 26px)",
    color: "#ca3604",
    letterSpacing: "-0.05em",
    lineHeight: 1.2,
  };

  const descStyle = {
    fontFamily: "var(--font-geist-sans), Inter, sans-serif",
    fontWeight: 400,
    fontSize: "clamp(13px, 1.1vw, 16px)",
    color: "#4b4b4b",
    lineHeight: 1.4,
    opacity: 0.75,
  };

  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{ minHeight: "100vh", paddingTop: "88px" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #d6dce8 0%, #e8edf5 30%, #f4f6fb 60%, #ffffff 100%)",
        }}
      />

      <div className="relative w-full" style={{ height: "100vh" }}>
        {/* ── Headline (Issue 2: larger font, 2-line break, maxWidth 920px) ─────
          Default:   y=+80, opacity=0
          Phase 2+:  y=0,   opacity=1    (anchored at top: 14.2vh)
          Phase 4:   y=-340, opacity=0   (flies off screen top)
        */}
        <div
          className="absolute inset-x-0 z-20 flex flex-col items-center text-center pointer-events-none px-6"
          style={{ top: "8vh" }}
        >
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: phase >= 4 ? 0 : 1,
              y: phase >= 4 ? -60 : 0,
            }}
            transition={{ duration: 1.9, ease: EASE }}
          >
            <p
              className="uppercase mb-5"
              style={{
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                color: "#ca3604",
                letterSpacing: "0.1em",
                lineHeight: 1.4,
              }}
            >
              AFDD powered by Smart Alerts
            </p>
            <h1
              className="text-[clamp(28px,4vw,36px)] lg:text-[48px]"
              style={{
                fontFamily:
                  "var(--font-work-sans), var(--font-geist-sans), sans-serif",
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: "-0.04em",
                color: "#1b1b1b",
                maxWidth: "780px",
              }}
            >
              <span>Making alerts </span>
              <span style={{ fontWeight: 500 }}>relevant, personalized,</span>
              <br />
              <span>and</span>
              <span style={{ fontWeight: 500 }}> directly actionable</span>
            </h1>
          </motion.div>
        </div>

        {/* ── Phone + phone screen notifications ────────────────────────────────
          Issue 2: top moved from 24vh → 26vh (clears 2-line headline)
          Issue 3: PhoneNotifications is now a CHILD of the phone motion.div
                   so it automatically moves/scales with the phone in Phase 4.
                   visible={phase >= 3}: persists through all subsequent phases.

          Phone:     opacity=0.2, rotate=-19.71° → 1.0, -1.43° at Phase 2
          Phase 4:   x=+23vw, scale=1.2

          Notification cluster (Figma node 1:673):
            position: absolute inside phone, left=8.8%, top=14.2%
            width=39.7%, height=39.36%  (proportional to Figma phone 761×935px)
            rotate(-14.38deg) outer | rotate(8.39deg) skewX(9.67deg) per card
        */}
        <div
          className="absolute inset-0 flex items-start justify-center pointer-events-none z-10"
          style={{ paddingTop: "calc(38vh - 60px)" }}
        >
          <motion.div
            style={{
              position: "relative",
              height: "80vh",
              aspectRatio: "400 / 820",
            }}
            initial={{ y: 100, opacity: 0.2, rotate: -19.71 }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: phase >= 2 ? -1.43 : -19.71,
              x: phase >= 4 ? "23vw" : 0,
              scale: phase >= 4 ? 1.2 : 1,
            }}
            transition={{
              duration: phase >= 4 ? D_SHIFT : D_ENTER,
              ease: EASE,
            }}
          >
            <Image
              src="/hero-overlay.png"
              alt="DeJoule app"
              width={400}
              height={820}
              priority
              style={{
                height: "80vh",
                width: "auto",
                maxWidth: "none",
                display: "block",
              }}
              className="object-contain"
            />
            <motion.div
              style={{
                position: "absolute",
                top: "30%",
                left: "27%",
                width: "66%",
                height: "50%",
                overflow: "hidden",
                pointerEvents: "none",
              }}
              animate={{ opacity: phase >= 3 ? 1 : 0 }}
              transition={{ duration: D_CARDS, ease: EASE }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "4.3%",
                  top: "6.9%",
                  width: "44.1%",
                  height: "63.5%",
                  transform: "rotate(-16.00deg)",
                  transformOrigin: "top left",
                }}
              >
                {NOTIF_CARDS.map((card, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: `${card.topPct}%`,
                      left: `${card.leftPct}%`,
                      width: "69.5%",
                      transform:
                        "rotate(8.39deg) skewX(9.67deg) scaleX(1.01) scaleY(0.97)",
                      transformOrigin: "top left",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(165.43deg, #ffffff 57.33%, rgb(231,236,242) 108.88%)",
                        boxShadow:
                          "8px 5px 13px 6px rgba(0,0,0,0.01), inset 0px 2px 20.1px 0px rgba(222,222,222,0.3)",
                        borderRadius: "0.4vh",
                        overflow: "hidden",
                        padding: "0.55vh 0.65vh",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.13vh",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.18vh",
                          }}
                        >
                          <Image
                            src={card.icon}
                            alt={card.app}
                            width={17}
                            height={17}
                            unoptimized
                            style={{
                              width: "0.8vh",
                              height: "0.8vh",
                              display: "block",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.58vh",
                              fontFamily: "var(--font-work-sans), sans-serif",
                              fontWeight: 500,
                              color: "rgba(103,103,103,0.7)",
                              letterSpacing: "-0.02em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {card.app}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "0.58vh",
                            fontFamily: "var(--font-work-sans), sans-serif",
                            color: "#676767",
                            letterSpacing: "-0.02em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {card.time}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.56vh",
                          fontFamily:
                            "var(--font-geist-sans), Inter, sans-serif",
                          fontWeight: 600,
                          color: "#ca3604",
                          textTransform: "uppercase",
                          letterSpacing: "-0.015em",
                          lineHeight: 1.41,
                          marginBottom: "0.1vh",
                        }}
                      >
                        {card.title}
                      </p>
                      <p
                        style={{
                          fontSize: "0.56vh",
                          fontFamily:
                            "var(--font-geist-sans), Inter, sans-serif",
                          fontWeight: 400,
                          color: "#1b1b1b",
                          letterSpacing: "-0.015em",
                          lineHeight: 1.4,
                        }}
                      >
                        {card.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Alert cards (Figma Variant3) ───────────────────────────────────── */}
        <div
          className="absolute hidden lg:block"
          style={{
            left: "5vw",
            top: "28vh",
            width: "90vw",
            height: "55vh",
            pointerEvents: "none",
          }}
        >
          {CARD_DATA.map((card) => (
            <div key={card.id} className="absolute" style={card.pos}>
              <motion.div
                initial={{ opacity: 0, x: card.entryX, y: card.entryY + 110 }}
                animate={{
                  opacity: phase === 3 ? 1 : 0,
                  x: phase >= 3 ? 0 : card.entryX,
                  y: phase >= 3 ? 0 : card.entryY + 110,
                }}
                transition={{
                  duration: D_CARDS,
                  ease: EASE,
                  delay: phase === 3 ? card.delay : 0,
                }}
              >
                <AlertCard title={card.title} body={card.body} />
              </motion.div>
            </div>
          ))}
        </div>

        {/* ── Left panel (Phase 5+) ──────────────────────────────────────────── */}
        <motion.div
          className="absolute hidden lg:flex flex-col justify-start z-20"
          style={{ left: "9.3vw", top: 0, bottom: 0, width: "38vw", paddingTop: "120px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 5 ? 1 : 0 }}
          transition={{ duration: D_PANEL, ease: EASE }}
        >
          {/* Heading — static, does not animate */}
          <h2
            style={{
              fontFamily: "var(--font-work-sans), sans-serif",
              fontSize: "clamp(28px, 3vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#1b1b1b",
              marginBottom: "31px",
            }}
          >
            Redefining what <span style={{ fontWeight: 500 }}>alerts</span>{" "}
            should do for you
          </h2>

          {/* Body paragraphs — static */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "48px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(14px, 1.2vw, 18px)",
                lineHeight: 1.4,
                color: "#4b4b4b",
              }}
            >
              Operations teams shouldn&apos;t be bombarded with irrelevant,
              static, and stagnating alerts that increase overhead instead of
              reducing it.
            </p>
            <p
              style={{
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(14px, 1.2vw, 18px)",
                lineHeight: 1.4,
                color: "#4b4b4b",
              }}
            >
              Smart Alerts by DeJoule is redefining how alerts should speak to
              you—personalized, actionable, and like an intelligent teammate,
              always guiding you with clear, corrective steps.
            </p>
          </div>

          {/* Issue 4 — AnimatePresence mode="wait": only ONE item rendered at a time.
            When activeItem changes: current exits (y:0→-30, opacity:1→0) then
            next enters (y:30→0, opacity:0→1). Inactive items are invisible (never rendered).
          */}
          <div style={{ minHeight: "10vh" }}>
            <AnimatePresence mode="wait">
              {activeItem >= 0 && (
                <motion.div
                  key={activeItem}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: D_ITEM, ease: EASE }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <p style={titleStyle}>{ITEMS[activeItem].title}</p>
                  <p style={descStyle}>{ITEMS[activeItem].description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
