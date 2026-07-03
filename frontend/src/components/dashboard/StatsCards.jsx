import { useState } from "react";
import "./StatsCards.css";

export default function StatsCards({ signals }) {

  const [activeCard, setActiveCard] = useState(null);

  if (!signals) return null;

  // Count by the classified category (the same field calculateBuyingIntent()
  // scores from) so these cards can never show a category as present that
  // the score didn't actually credit.
  const counts = {};

  signals.forEach((signal) => {
    const category = signal.category || "Other";
    counts[category] = (counts[category] || 0) + 1;
  });

  const cards = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([category, value]) => ({
      label: category,
      value,
      accent: category,
    }));

  return (
    <div className="statsGrid">
      {cards.map((card) => (
        <div
          key={card.label}
          onClick={() => setActiveCard(card.accent)}
          className={`statCard ${
            activeCard === card.accent ? "activeStat" : ""
          }`}
        >
          <div className="statHeading">
            {card.label}
          </div>

          <div className="statValue">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}