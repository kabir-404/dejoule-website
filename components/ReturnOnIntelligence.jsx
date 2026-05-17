"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Figma node 1:410 — exact values from Frame 2147227241 + Frame 2147227328
// Card gradient:  linear-gradient(151.33deg, #fff 57.31%, rgb(237,240,245) 90.39%)
// Card shadow:    8px 5px 13px 6px rgba(0,0,0,0.01)
// Card inset:     inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)
// Title:          Work Sans Medium 28px #1b1b1b tracking[-0.84px] leading-[1.18]
// Subtitle:       Work Sans Medium 24px #1b1b1b tracking[-1px]   leading-[1.27]
// Description:    Inter Regular 18px    #060606  opacity-75       leading-[1.28]
// Features:       Inter Medium  18px    #333      leading-[1.38]
// Button text:    Work Sans Medium 22px gradient(#ca3604→#000) tracking[-2px]

const CARD_META = {
  1: { subtitle: "From raw data to real decisions in real time",                                        image: "/roi-analytics.png" },
  2: { subtitle: "More than alerts. Built-in foresight.",                                               image: "/roi-alerts.png"   },
  3: { subtitle: "One intelligent platform. Complete visibility. Seamless control.",                    image: "/roi-monitoring.png"},
  4: { subtitle: "Your building's intelligence engine. Learning, adapting, and acting in real time.",   image: "/roi-automation.png"},
};

const ORANGE = "#ca3604";

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
  return <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ORANGE }} />;
}

// Figma Component 151/152 — same gradient-button style as CTA "Let's connect"
// bg:    linear-gradient(180deg, #fff 5.08%, rgb(194,205,216) 94.92%)
// text:  linear-gradient(90deg, #ca3604 3.64%, #000 91.45%)
// inset: inset 0px 3.48px 13.05px 0px #f8f0e0, inset 0px -1.74px 3.48px 0px rgba(0,0,0,0.1)
function SeeHowButton() {
  return (
    <button
      className="relative overflow-hidden flex items-center justify-center px-8 py-5 rounded-full border mt-2"
      style={{
        borderColor: "rgba(255,255,255,0.43)",
        boxShadow: "0px -0.87px 2.61px 0px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgb(255,255,255) 5.08%, rgb(194,205,216) 94.92%)",
        }}
      />
      <span
        className="relative whitespace-nowrap"
        style={{
          fontFamily: "var(--font-work-sans), sans-serif",
          fontWeight: 500,
          fontSize: "22px",
          letterSpacing: "-2px",
          lineHeight: 1.41,
          background: "linear-gradient(90deg, rgb(202,54,4) 3.64%, rgb(0,0,0) 91.45%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        See how it works
      </span>
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: "inset 0px 3.48px 13.05px 0px #f8f0e0, inset 0px -1.74px 3.48px 0px rgba(0,0,0,0.1)",
        }}
      />
    </button>
  );
}

function ExpandedCard({ card }) {
  return (
    <div
      className="w-full overflow-hidden relative"
      style={{
        borderRadius: "30px",
        background: "linear-gradient(151.33deg, rgb(255,255,255) 57.31%, rgb(237,240,245) 90.39%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.01)",
        backdropFilter: "blur(0.5px)",
      }}
    >
      {/* inset shadow overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[30px]"
        style={{
          boxShadow: "inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
        }}
      />

      <div className="flex min-h-[620px]">
        {/* Left content — Figma: left=41px top=49px, gap between sections=46px */}
        <div className="flex flex-col gap-10 px-10 py-12 w-[450px] shrink-0">
          {/* Title row */}
          <div className="flex items-center gap-3.5">
            <CardIcon />
            <h3
              className="leading-[1.18]"
              style={{
                color: "#1b1b1b",
                fontFamily: "var(--font-work-sans), sans-serif",
                fontWeight: 500,
                fontSize: "28px",
                letterSpacing: "-0.84px",
              }}
            >
              {card.title}
            </h3>
          </div>

          {/* Subtitle + description — gap=15px between them */}
          <div className="flex flex-col gap-4">
            <p
              className="leading-[1.27]"
              style={{
                color: "#1b1b1b",
                fontFamily: "var(--font-work-sans), sans-serif",
                fontWeight: 500,
                fontSize: "24px",
                letterSpacing: "-1px",
              }}
            >
              {card.subtitle}
            </p>
            <p
              className="leading-[1.28] opacity-75"
              style={{
                color: "#060606",
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
              }}
            >
              {card.description}
            </p>
          </div>

          {/* Feature items — gap=12px, divider rgba(202,54,4,0.2) */}
          <div className="flex flex-col gap-3">
            {card.features.map((feat, i) => (
              <div key={feat}>
                <div className="flex items-center justify-between py-1">
                  <p
                    className="leading-[1.38]"
                    style={{
                      color: "#333",
                      fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "18px",
                    }}
                  >
                    {feat}
                  </p>
                  <span style={{ color: ORANGE }} className="text-lg leading-none ml-2 shrink-0">+</span>
                </div>
                {i < card.features.length - 1 && (
                  <div className="h-px mt-1" style={{ background: "rgba(202,54,4,0.2)" }} />
                )}
              </div>
            ))}
          </div>

          <SeeHowButton />
        </div>

        {/* Right image — white card wrapper with pink border (Figma card 4 style) */}
        <div className="flex-1 flex items-center p-5 pl-0">
          <div
            className="w-full h-full rounded-[10px] p-5 flex items-center"
            style={{
              background: "rgba(255,255,255,0.61)",
              border: "1px solid #ffd4c5",
              boxShadow: "-6px 0px 35px 0px rgba(0,0,0,0.07)",
              minHeight: "380px",
            }}
          >
            <div
              className="relative w-full rounded-lg"
              style={{
                aspectRatio: "1075/441",
                boxShadow: "0px 3.918px 19.46px 0px rgba(0,0,0,0.25)",
              }}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover rounded-lg"
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

function CollapsedCard({ card, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left overflow-hidden cursor-pointer relative"
      style={{
        borderRadius: "30px",
        background: "linear-gradient(151.33deg, rgb(255,255,255) 57.31%, rgb(237,240,245) 90.39%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.01)",
        backdropFilter: "blur(0.5px)",
      }}
    >
      <div className="flex items-center gap-3.5 px-10 py-7">
        <CardIcon />
        <h3
          className="leading-[1.18]"
          style={{
            color: "#1b1b1b",
            fontFamily: "var(--font-work-sans), sans-serif",
            fontWeight: 500,
            fontSize: "clamp(18px,1.6vw,28px)",
            letterSpacing: "-0.84px",
          }}
        >
          {card.title}
        </h3>
      </div>
      <div
        className="absolute inset-0 pointer-events-none rounded-[30px]"
        style={{
          boxShadow: "inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
        }}
      />
    </button>
  );
}

export default function ReturnOnIntelligence() {
  const [active, setActive] = useState(3);
  const [cards, setCards] = useState([]);

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

  return (
    <section id="roi" className="bg-white py-20 lg:py-28">
      <div className="max-w-[1580px] mx-auto px-6 lg:px-12">

        {/* Header — Figma node 1:412 */}
        <div className="mb-8">
          {/* Tag row — DotGridIcon + "Return on intelligence" Inter Regular 20px #ca3604 uppercase */}
          <div className="flex items-center gap-3 mb-10">
            <DotGridIcon />
            <span
              className="uppercase leading-[1.1]"
              style={{
                color: ORANGE,
                fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                letterSpacing: "0.01em",
              }}
            >
              Return on intelligence
            </span>
          </div>

          {/* Two-column headline + description — Figma node 1:427, gap=288px */}
          <div className="flex items-start gap-0">
            {/* Headline — Work Sans Light/Medium 48px #1b1b1b tracking[-1.92px=-0.04em] */}
            <div className="flex-1 max-w-[680px]">
              <h2
                className="text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.18]"
                style={{
                  color: "#1b1b1b",
                  fontFamily: "var(--font-work-sans), sans-serif",
                  letterSpacing: "-0.04em",
                }}
              >
                <span style={{ fontWeight: 300 }}>Smarter buildings don&apos;t just function. </span>
                <span style={{ fontWeight: 500 }}>They deliver value.</span>
              </h2>
            </div>
            {/* Description — Inter Regular 20px tracking[-1px] */}
            <div className="hidden lg:block flex-1 pl-20 pt-1 max-w-[620px]">
              <p
                className="text-[18px] lg:text-[20px] leading-[1.41]"
                style={{
                  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "-1px",
                }}
              >
                <span style={{ color: "#676767" }}>
                  When systems think, buildings give back. DeJoule turns every minute into measurable gain across{" "}
                </span>
                <span style={{ color: "#1b1b1b", fontWeight: 500 }}>energy, uptime, and user satisfaction.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal divider */}
        <div className="h-px mb-10" style={{ background: "#e5e7eb" }} />

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {cards.map((card, i) => (
            <motion.div key={card.id} layout transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <AnimatePresence mode="wait" initial={false}>
                {active === i ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExpandedCard card={card} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CollapsedCard card={card} onClick={() => setActive(i)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
