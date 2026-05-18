"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CARD_META = {
  1: {
    subtitle: "From raw data to real decisions in real time",
    image: "/roi-analytics.png",
  },
  2: {
    subtitle: "More than alerts. Built-in foresight.",
    image: "/roi-alerts.png",
  },
  3: {
    subtitle:
      "One intelligent platform. Complete visibility. Seamless control.",
    image: "/roi-monitoring.png",
  },
  4: {
    subtitle:
      "Your building's intelligence engine. Learning, adapting, and acting in real time.",
    image: "/roi-automation.png",
  },
};

const ORANGE = "#ca3604";
const EASE = [0.22, 1, 0.36, 1];

// Figma exact values
const PEEK_H = 76; // vertical gap between card tops
const EXPANDED_H = 501; // exact card height

// Card widths by depth from front — Figma: 1404/1389/1330/1272 px
// depth 0 = front (100 %), depth 1 = 99 %, depth 2 = 95 %, depth 3+ = 91 %
function cardWidth(depth) {
  if (depth === 0) return "100%";
  if (depth === 1) return "99%";
  if (depth === 2) return "95%";
  return "91%";
}

// ─── sub-components ────────────────────────────────────────────────────────────

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
        )),
      )}
    </svg>
  );
}

function CardIcon() {
  return (
    <div
      style={{
        width: 12.4,
        height: 12.4,
        borderRadius: "50%",
        background: ORANGE,
        flexShrink: 0,
      }}
    />
  );
}

function SeeHowButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden flex items-center justify-center"
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 24,
        paddingRight: 24,
        borderRadius: 60,
        border: "1px solid rgba(255,255,255,0.43)",
        boxShadow: "0px -0.87px 2.61px 0px rgba(0,0,0,0.05)",
        flexShrink: 0,
        alignSelf: "flex-start",
      }}
    >
      {/* background: white → grey (Figma: Component 151) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "inherit",
          background:
            "linear-gradient(180deg, rgb(255,255,255) 5.08%, rgb(194,205,216) 94.93%)",
        }}
      />
      {/* gradient text: orange → black (Figma) */}
      <span
        className="relative whitespace-nowrap"
        style={{
          fontFamily: "var(--font-work-sans), sans-serif",
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: "-2px",
          lineHeight: 1.41,
          backgroundImage:
            "linear-gradient(90deg, rgb(202,54,4) 3.64%, rgb(0,0,0) 91.45%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        See how it works
      </span>
      {/* inner shadow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "inherit",
          boxShadow:
            "inset 0px 3.48px 13.05px 0px #f8f0e0, inset 0px -1.74px 3.48px 0px rgba(0,0,0,0.1)",
        }}
      />
    </motion.button>
  );
}

function ExpandedCard({ card, onDismiss }) {
  const [expandedFeature, setExpandedFeature] = useState(null);

  // Flat array of feature rows + dividers so gap-12 applies uniformly (Figma layout)
  const featureItems = [];
  card.features?.forEach((feat, i) => {
    const isOpen = expandedFeature === i;
    const title = feat.title ?? feat;
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
          <span
            style={{
              color: "rgba(0,0,0,0.8)",
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
              fontWeight: 500,
              fontSize: 13,
              lineHeight: 1.38,
            }}
          >
            {title}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              color: "#333",
              display: "inline-block",
              transformOrigin: "center",
              flexShrink: 0,
              marginLeft: 8,
            }}
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
              <p
                style={{
                  color: "#555",
                  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: 13,
                  lineHeight: 1.5,
                  paddingTop: 4,
                  paddingBottom: 8,
                }}
              >
                {feat.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>,
    );
    if (i < (card.features?.length ?? 0) - 1) {
      featureItems.push(
        <div
          key={`d${i}`}
          style={{ height: 1, background: "rgba(202,54,4,0.2)" }}
        />,
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
        background:
          "linear-gradient(155.527deg, rgb(255,255,255) 57.307%, rgb(237,240,245) 90.386%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.02)",
        backdropFilter: "blur(0.5px)",
      }}
    >
      {/* inset shadow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          boxShadow:
            "inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "445px",
          gap: 24,
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: 380,
            height: "445px",
            flexShrink: 0,
          }}
        >
          {/* Title — click to dismiss */}
          <button
            onClick={onDismiss}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14.6,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <CardIcon />
            <h3
              style={{
                color: "#1b1b1b",
                fontFamily: "var(--font-work-sans), sans-serif",
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: "-0.84px",
                lineHeight: 1.18,
              }}
            >
              {card.title}
            </h3>
          </button>

          <p
            style={{
              color: "#1b1b1b",
              fontFamily: "var(--font-work-sans), sans-serif",
              fontWeight: 500,
              fontSize: 16,
              letterSpacing: "-1px",
              lineHeight: 1.27,
            }}
          >
            {card.subtitle}
          </p>

          <p
            style={{
              color: "#060606",
              fontFamily: "var(--font-geist-sans), Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.28,
              opacity: 0.75,
            }}
          >
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
        <div style={{ flex: 1, height: "365px", margin: "auto" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
              padding: "0 20px",
              background: "#ffffff",
              boxShadow: "0px 3.918px 19.46px 0px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
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

// Full EXPANDED_H so cards properly overlap — only the top PEEK_H is visible,
// the rest is covered by the card in front (matching Figma stacking behaviour).
function CollapsedCard({ card }) {
  return (
    <div
      style={{
        width: "100%",
        height: EXPANDED_H,
        position: "relative",
        overflow: "hidden",
        borderRadius: "29.679px 29.679px 0 0",
        background:
          "linear-gradient(151.326deg, rgb(255,255,255) 57.307%, rgb(237,240,245) 90.386%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.02)",
        backdropFilter: "blur(0.5px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14.6,
          height: PEEK_H,
          paddingLeft: 41,
        }}
      >
        <CardIcon />
        <h3
          style={{
            color: "#1b1b1b",
            fontFamily: "var(--font-work-sans), sans-serif",
            fontWeight: 500,
            fontSize: "clamp(20px, 1.6vw, 30px)",
            letterSpacing: "-0.84px",
            lineHeight: 1.18,
          }}
        >
          {card.title}
        </h3>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "29.679px 29.679px 0 0",
          boxShadow:
            "inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
        }}
      />
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────────

export default function ReturnOnIntelligence() {
  const [cards, setCards] = useState([]);
  const [dismissed, setDismissed] = useState(0);

  useEffect(() => {
    fetch("/api/cards")
      .then((r) => r.json())
      .then((data) =>
        setCards(
          data.map((card) => ({
            ...card,
            ...CARD_META[card.id],
            features: card.bullets,
          })),
        ),
      )
      .catch(() => {});
  }, []);

  function handleDismiss() {
    setDismissed((d) => {
      const next = d + 1;
      if (next >= cards.length) {
        setTimeout(() => setDismissed(0), 550);
      }
      return next;
    });
  }

  // cards[0..N-1]: index N-1 = front, index 0 = back
  const remaining = cards.slice(0, Math.max(0, cards.length - dismissed));
  const N = remaining.length;
  const containerHeight = (Math.max(cards.length, 1) - 1) * PEEK_H + EXPANDED_H;

  return (
    <section id="roi" className="bg-white pb-20 lg:pb-28">
      {/* ── Heading ── */}
      <div className="max-w-[1580px] mx-auto px-6 lg:px-12 pt-20 lg:pt-28">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-10">
            <DotGridIcon />
            <span
              style={{
                color: ORANGE,
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: 20,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              Return on intelligence
            </span>
          </div>

          <div className="flex items-start">
            <div className="flex-1 max-w-[680px]">
              <h2
                style={{
                  color: "#1b1b1b",
                  fontFamily: "var(--font-work-sans), sans-serif",
                  fontSize: "clamp(38px, 3.5vw, 50px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.18,
                }}
              >
                <span style={{ fontWeight: 300 }}>
                  Smarter buildings don&apos;t just function.{" "}
                </span>
                <span style={{ fontWeight: 500 }}>They deliver value.</span>
              </h2>
            </div>
            <div className="hidden lg:block flex-1 pl-20 pt-1 max-w-[620px]">
              <p
                style={{
                  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: 20,
                  lineHeight: 1.41,
                  letterSpacing: "-1px",
                }}
              >
                <span style={{ color: "#676767" }}>
                  When systems think, buildings give back. DeJoule turns every
                  minute into measurable gain across{" "}
                </span>
                <span style={{ color: "#1b1b1b", fontWeight: 500 }}>
                  energy, uptime, and user satisfaction.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: "#e5e7eb" }} />
      </div>

      {/* ── Card deck ── */}
      <div className="max-w-[1580px] mx-auto px-6 lg:px-12 mt-12">
        <div
          style={{
            maxWidth: "80%",
            margin: "0 auto",
            position: "relative",
            height: containerHeight,
            overflow: "visible",
          }}
        >
          <AnimatePresence initial={false}>
            {remaining.map((card, i) => {
              const isFront = i === N - 1;
              const depth = N - 1 - i; // 0 = front
              const width = cardWidth(depth);
              return (
                <motion.div
                  key={card.id}
                  exit={{ y: -300, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{
                    position: "absolute",
                    top: i * PEEK_H,
                    left: "50%",
                    x: "-50%", // Framer Motion merges this with exit y safely
                    width,
                    zIndex: i + 1,
                  }}
                >
                  {isFront ? (
                    <ExpandedCard card={card} onDismiss={handleDismiss} />
                  ) : (
                    <CollapsedCard card={card} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
