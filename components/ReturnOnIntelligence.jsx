"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

const CARD_META = {
  1: { subtitle: "From raw data to real decisions in real time",                                      image: "/roi-analytics.png"  },
  2: { subtitle: "More than alerts. Built-in foresight.",                                             image: "/roi-alerts.png"     },
  3: { subtitle: "One intelligent platform. Complete visibility. Seamless control.",                  image: "/roi-monitoring.png" },
  4: { subtitle: "Your building's intelligence engine. Learning, adapting, and acting in real time.", image: "/roi-automation.png" },
};

const ORANGE = "#ca3604";
const EASE   = [0.22, 1, 0.36, 1];

const PEEK_H     = 76;
const EXPANDED_H = 501;

function cardWidth(depth) {
  if (depth === 0) return "100%";
  if (depth === 1) return "99%";
  if (depth === 2) return "95%";
  return "91%";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
            fill={ORANGE}
          />
        ))
      )}
    </svg>
  );
}

function CardIcon() {
  return (
    <div
      style={{ width: 12.4, height: 12.4, borderRadius: "50%", background: ORANGE, flexShrink: 0 }}
    />
  );
}

function SeeHowButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden flex items-center justify-center"
      style={{
        paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 24,
        borderRadius: 60,
        border: "1px solid rgba(255,255,255,0.43)",
        boxShadow: hovered
          ? "0 8px 24px rgba(202,54,4,0.4)"
          : "0px -0.87px 2.61px 0px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
        flexShrink: 0,
        alignSelf: "flex-start",
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
          fontFamily: "var(--font-work-sans), sans-serif",
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: "-2px",
          lineHeight: 1.41,
          ...(hovered
            ? { color: "#ffffff", WebkitTextFillColor: "#ffffff", background: "none" }
            : {
                background: "linear-gradient(90deg, #ca3604 3.64%, #000000 91.45%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }),
        }}
      >
        See how it works
      </span>
      <div
        className="absolute inset-0 rounded-full pointer-events-none group-hover:opacity-0 transition-opacity duration-300"
        style={{
          boxShadow: "inset 0px 3.48px 13.05px 0px #f8f0e0, inset 0px -1.74px 3.48px 0px rgba(0,0,0,0.1)",
        }}
      />
    </motion.button>
  );
}

function ExpandedCard({ card }) {
  const [expandedFeature, setExpandedFeature] = useState(null);

  const featureItems = [];
  card.features?.forEach((feat, i) => {
    const isOpen = expandedFeature === i;
    const title  = feat.title ?? feat;
    featureItems.push(
      <div key={`f${i}`}>
        <button
          onClick={() => setExpandedFeature(isOpen ? null : i)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            padding: "3px 0",
          }}
        >
          <span style={{
            color: "rgba(0,0,0,0.8)",
            fontFamily: "var(--font-geist-sans), Inter, sans-serif",
            fontWeight: 500,
            fontSize: 13,
            lineHeight: 1.38,
          }}>
            {title}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ color: "#333", display: "inline-block", transformOrigin: "center", flexShrink: 0, marginLeft: 8 }}
          >
            +
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && feat.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <p style={{
                color: "#555",
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: 13,
                lineHeight: 1.5,
                paddingTop: 4,
                paddingBottom: 8,
              }}>
                {feat.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
    if (i < (card.features?.length ?? 0) - 1) {
      featureItems.push(
        <div key={`d${i}`} style={{ height: 1, background: "rgba(202,54,4,0.2)" }} />
      );
    }
  });

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: 29.679,
        height: "501px",
        paddingTop: 32,
        paddingBottom: 24,
        paddingLeft: 59,
        paddingRight: 24,
        background: "linear-gradient(155.527deg, rgb(255,255,255) 57.307%, rgb(237,240,245) 90.386%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.02)",
        backdropFilter: "blur(0.5px)",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit",
        boxShadow: "inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
      }} />

      <div style={{ display: "flex", flexDirection: "row", height: "445px", gap: 24 }}>

        {/* ── Left column ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 380,
          height: "445px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14.6 }}>
            <CardIcon />
            <h3 style={{
              color: "#1b1b1b",
              fontFamily: "var(--font-work-sans), sans-serif",
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: "-0.84px",
              lineHeight: 1.18,
            }}>
              {card.title}
            </h3>
          </div>

          <p style={{
            color: "#1b1b1b",
            fontFamily: "var(--font-work-sans), sans-serif",
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: "-1px",
            lineHeight: 1.27,
          }}>
            {card.subtitle}
          </p>

          <p style={{
            color: "#060606",
            fontFamily: "var(--font-geist-sans), Inter, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: 1.28,
            opacity: 0.75,
          }}>
            {card.description}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {featureItems}
          </div>

          <div style={{ marginTop: "auto" }}>
            <SeeHowButton />
          </div>
        </div>

        {/* ── Image panel ── */}
        <div style={{ flex: 1, height: "395px" }}>
          <div style={{
            width: "100%",
            height: "100%",
            borderRadius: 10,
            padding: 5,
            background: "rgba(255,255,255,0.61)",
            border: "1px solid #ffd4c5",
            boxShadow: "-6px 0px 35px 0px rgba(0,0,0,0.07)",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0px 3.918px 19.46px 0px rgba(0,0,0,0.25)",
            }}>
              <Image
                src={card.image}
                alt={card.title}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 1280px) 100vw, 800px"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsedCard({ card }) {
  return (
    <div
      style={{
        width: "100%",
        height: EXPANDED_H,
        position: "relative",
        overflow: "hidden",
        borderRadius: "29.679px 29.679px 0 0",
        background: "linear-gradient(151.326deg, rgb(255,255,255) 57.307%, rgb(237,240,245) 90.386%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.02)",
        backdropFilter: "blur(0.5px)",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14.6,
        height: PEEK_H,
        paddingLeft: 41,
      }}>
        <CardIcon />
        <h3 style={{
          color: "#1b1b1b",
          fontFamily: "var(--font-work-sans), sans-serif",
          fontWeight: 500,
          fontSize: "clamp(20px, 1.6vw, 30px)",
          letterSpacing: "-0.84px",
          lineHeight: 1.18,
        }}>
          {card.title}
        </h3>
      </div>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        borderRadius: "29.679px 29.679px 0 0",
        boxShadow: "inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
      }} />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ReturnOnIntelligence() {
  const [cards, setCards]           = useState([]);
  const [currentFront, setCurrentFront] = useState(3);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const wrapperRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // All 4 transforms declared at top level — never inside loops
  const y3 = useTransform(scrollYProgress, [0.08, 0.35], ["0vh", "-110vh"]);
  const y2 = useTransform(scrollYProgress, [0.35, 0.62], ["0vh", "-110vh"]);
  const y1 = useTransform(scrollYProgress, [0.62, 0.89], ["0vh", "-110vh"]);
  // card 0 never moves — y = 0

  const y3Spring = useSpring(y3, { stiffness: 200, damping: 30, mass: 0.3 });
  const y2Spring = useSpring(y2, { stiffness: 200, damping: 30, mass: 0.3 });
  const y1Spring = useSpring(y1, { stiffness: 200, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.35)      setCurrentFront(3);
    else if (v < 0.62) setCurrentFront(2);
    else if (v < 0.89) setCurrentFront(1);
    else               setCurrentFront(0);
  });

  useEffect(() => {
    fetch("/api/cards")
      .then((r) => r.json())
      .then((data) =>
        setCards(
          data.map((card) => ({
            ...card,
            ...CARD_META[card.id],
            features: card.bullets,
          }))
        )
      )
      .catch(() => {});
  }, []);

  // index → y MotionValue (index 0 = static 0, never moves)
  const yTransforms = [0, y1Spring, y2Spring, y3Spring];

  const containerHeight = 3 * PEEK_H + EXPANDED_H; // 3×76 + 501 = 729px

  return (
    <section id="roi" className="bg-white pb-20 lg:pb-28">

      {/* ── Heading — normal document flow, outside scroll capture ── */}
      <div className="max-w-[1580px] mx-auto px-6 lg:px-12 pt-20 lg:pt-28">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-10">
            <DotGridIcon />
            <span style={{
              color: ORANGE,
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
              fontWeight: 400,
              fontSize: 20,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}>
              Return on intelligence
            </span>
          </div>

          <div className="flex items-start">
            <div className="flex-1 max-w-[680px]">
              <h2 style={{
                color: "#1b1b1b",
                fontFamily: "var(--font-work-sans), sans-serif",
                fontSize: "clamp(38px, 3.5vw, 50px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.18,
              }}>
                <span style={{ fontWeight: 300 }}>Smarter buildings don&apos;t just function. </span>
                <span style={{ fontWeight: 500 }}>They deliver value.</span>
              </h2>
            </div>
            <div className="hidden lg:block flex-1 pl-20 pt-1 max-w-[620px]">
              <p style={{
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: 20,
                lineHeight: 1.41,
                letterSpacing: "-1px",
              }}>
                <span style={{ color: "#676767" }}>
                  When systems think, buildings give back. DeJoule turns every minute into measurable
                  gain across{" "}
                </span>
                <span style={{ color: "#1b1b1b", fontWeight: 500 }}>
                  energy, uptime, and user satisfaction.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop: 300vh scroll capture ── */}
      <div ref={wrapperRef} className="hidden lg:block" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen overflow-visible flex items-center justify-center">
          <div className="w-full max-w-[1580px] px-6 lg:px-12">
            <div className="max-w-[80%] mx-auto">

              {/* Card stack — fixed height, relative container */}
              <div className="relative" style={{ height: containerHeight }}>
                {cards.map((card, i) => {
                  const depth     = currentFront - i;   // 0 = front, positive = behind, negative = exited
                  const width     = depth >= 0 ? cardWidth(depth) : "100%";
                  const hasExited = i > currentFront;

                  return (
                    <motion.div
                      key={card.id}
                      style={{
                        position: "absolute",
                        top: i * PEEK_H,
                        left: "50%",
                        x: "-50%",
                        y: yTransforms[i],
                        width,
                        zIndex: i + 1,
                        pointerEvents: hasExited ? "none" : "auto",
                        opacity: hasExited ? 0 : 1,
                        transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <ExpandedCard card={card} />
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fallback: vertical accordion list ── */}
      <div className="lg:hidden px-6 mt-12 space-y-3">
        {cards.map((card, i) => {
          const isExpanded = mobileExpanded === i;
          return (
            <div key={card.id}>
              {isExpanded ? (
                <div className="relative">
                  <ExpandedCard card={card} />
                  <button
                    onClick={() => setMobileExpanded(null)}
                    className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/10 text-gray-600 text-sm"
                    aria-label="Collapse"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  style={{ height: PEEK_H, overflow: "hidden", cursor: "pointer" }}
                  onClick={() => setMobileExpanded(i)}
                >
                  <CollapsedCard card={card} />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}
