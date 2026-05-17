"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CARD_META = {
  1: { subtitle: "From raw data to real decisions in real time",                                        image: "/roi-analytics.png" },
  2: { subtitle: "More than alerts. Built-in foresight.",                                               image: "/roi-alerts.png"   },
  3: { subtitle: "One intelligent platform. Complete visibility. Seamless control.",                    image: "/roi-monitoring.png"},
  4: { subtitle: "Your building's intelligence engine. Learning, adapting, and acting in real time.",   image: "/roi-automation.png"},
};

const ORANGE = "#ca3604";
const EASE = [0.22, 1, 0.36, 1];

const EXPANDED_H = 621;
const PEEK_H = 80;

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

function SeeHowButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden flex items-center justify-center px-8 py-5 rounded-full border mt-2"
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
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(202,54,4,0.15)" }}
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
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: "inset 0px 3.48px 20px 0px rgba(202,54,4,0.2), inset 0px -1.74px 5px 0px rgba(0,0,0,0.15)",
        }}
      />
    </motion.button>
  );
}

function ExpandedCard({ card, onDismiss }) {
  const [expandedFeature, setExpandedFeature] = useState(null);

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{
        borderRadius: "30px",
        background: "linear-gradient(151.33deg, rgb(255,255,255) 57.31%, rgb(237,240,245) 90.39%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.02)",
        backdropFilter: "blur(0.5px)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-[30px]"
        style={{
          boxShadow: "inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
        }}
      />

      <div className="flex min-h-[620px]">
        <div className="flex flex-col gap-10 px-10 py-12 w-[450px] shrink-0">
          <button
            onClick={onDismiss}
            className="flex items-center gap-3.5 text-left cursor-pointer"
          >
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
          </button>

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

          <div className="flex flex-col gap-0">
            {card.features.map((feat, i) => {
              const isOpen = expandedFeature === i;
              return (
                <div key={feat.title ?? feat}>
                  <button
                    onClick={() => setExpandedFeature(isOpen ? null : i)}
                    className="flex items-center justify-between py-1 w-full text-left"
                  >
                    <p
                      className="leading-[1.38]"
                      style={{
                        color: "#333",
                        fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "18px",
                      }}
                    >
                      {feat.title ?? feat}
                    </p>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      style={{ color: "#333", display: "inline-block", transformOrigin: "center" }}
                      className="text-lg leading-none ml-2 shrink-0"
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
                        transition={{ duration: 0.4, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          className="pb-2 pt-1 leading-[1.5]"
                          style={{
                            color: "#555",
                            fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                            fontWeight: 400,
                            fontSize: "15px",
                          }}
                        >
                          {feat.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {i < card.features.length - 1 && (
                    <div className="h-px mt-1 mb-2" style={{ background: "rgba(202,54,4,0.2)" }} />
                  )}
                </div>
              );
            })}
          </div>

          <SeeHowButton />
        </div>

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

function CollapsedCard({ card }) {
  return (
    <div
      className="w-full text-left overflow-hidden relative"
      style={{
        borderRadius: "30px",
        background: "linear-gradient(151.33deg, rgb(255,255,255) 57.31%, rgb(237,240,245) 90.39%)",
        boxShadow: "8px 5px 13px 6px rgba(0,0,0,0.02)",
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
          boxShadow: "inset 0px 4px 11.1px 11px rgba(202,54,4,0.02), inset 0px 2px 8px 0px rgba(222,222,222,0.3)",
        }}
      />
    </div>
  );
}

export default function ReturnOnIntelligence() {
  const [cards, setCards] = useState([]);
  const [dismissed, setDismissed] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  // Incremented on reset so all cards remount with initial positions (no animation)
  const [resetKey, setResetKey] = useState(0);

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

  const handleDismiss = () => {
    if (isDismissing || cards.length === 0) return;
    setIsDismissing(true);
    setTimeout(() => {
      const next = dismissed + 1;
      if (next >= cards.length) {
        setDismissed(0);
        setResetKey((k) => k + 1);
      } else {
        setDismissed(next);
      }
      setIsDismissing(false);
    }, 500);
  };

  // cards[n-1] starts active (bottom); slice removes from the right as each is dismissed
  const remaining = cards.slice(0, cards.length - dismissed);

  const totalCards = cards.length || 4;
  const containerHeight = EXPANDED_H + (totalCards - 1) * PEEK_H;

  return (
    <section id="roi" className="bg-white py-20 lg:py-28">
      <div className="max-w-[1580px] mx-auto px-6 lg:px-12">

        <div className="mb-8">
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

          <div className="flex items-start gap-0">
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

        <div className="h-px mb-10" style={{ background: "#e5e7eb" }} />

        <div style={{ position: "relative", height: containerHeight }}>
          {remaining.map((card, i) => {
            const peekIndex = remaining.length - 1 - i;
            const isTop = peekIndex === 0;
            const cardY = i * PEEK_H;

            const cardScale = 1 - peekIndex * 0.03;

            return (
              <motion.div
                key={`${card.id}-${resetKey}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: i + 1,
                  transformOrigin: "top center",
                }}
                initial={{ y: cardY, opacity: 1, scale: cardScale }}
                animate={{
                  y: isTop && isDismissing ? cardY - 300 : cardY,
                  opacity: isTop && isDismissing ? 0 : 1,
                  scale: cardScale,
                }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {isTop ? (
                  <ExpandedCard card={card} onDismiss={handleDismiss} />
                ) : (
                  <CollapsedCard card={card} />
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
