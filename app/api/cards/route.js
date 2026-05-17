export const dynamic = "force-static";

const cards = [
  {
    id: 1,
    title: "Smart Analytics & Reporting",
    description:
      "An analytics engine that turns operational data into targeted insights that drive action, not just observation. Built for complex facilities, it empowers your team with clear operational visibility, faster response times, and continuous improvement",
    bullets: [
      "Auto-generated insights, powered by AWS QuickSight",
      "360° visibility into performance metrics",
      "Built-in actionable intelligence",
    ],
  },
  {
    id: 2,
    title: "Smart Alerts",
    description:
      "Alerts that offer more than just a warning—delivering precise, actionable intelligence when it matters most. From early fault detection to guided resolution, your team has everything they need to stay ahead of failures and downtime.",
    bullets: [
      "Automated Fault Detection and Diagnostics",
      "Role-based alerts",
      "Personalized, multichannel communication",
    ],
  },
  {
    id: 3,
    title: "Facility-Wide Monitoring & Control",
    description:
      "DeJoule acts as your building's central command—integrating data, control, and actions across all systems to ensure your facility runs in perfect sync.",
    bullets: [
      "Centralized system intelligence",
      "Unified smart control",
      "Proactive maintenance workflows",
    ],
  },
  {
    id: 4,
    title: "Intelligent Automation",
    description:
      "Let's bring your systems to life with automation that evolves by the minute, making data-driven decisions to optimize performance without compromise",
    bullets: [
      "Joule Recipes for routine actions",
      "Dynamic equipment orchestration",
      "Balanced equipment utilization",
    ],
  },
];

export async function GET() {
  return Response.json(cards);
}
