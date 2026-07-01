import { useState } from "react";
import "./StatsCards.css";

export default function StatsCards({ signals }) {

  const [activeCard, setActiveCard] = useState(null);

  if (!signals) return null;

  const counts = {
    news: 0,
    funding: 0,
    hiring: 0,
    competitor_pain: 0,
  };

  signals.forEach((signal) => {
    if (counts[signal.signalType] !== undefined) {
      counts[signal.signalType]++;
    }
  });

  const cards = [
    {
      label: "News",
      value: counts.news,
      accent: "news",
    },
    {
      label: "Funding",
      value: counts.funding,
      accent: "funding",
    },
    {
      label: "Hiring",
      value: counts.hiring,
      accent: "hiring",
    },
    {
      label: "Competitor Pain",
      value: counts.competitor_pain,
      accent: "competitor_pain",
    },
  ];

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