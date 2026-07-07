import "./IntentTrend.css";

const formatRelativeTime = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.round(diffMs / 60000);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
};

export default function IntentTrend({ history, currentScore }) {
  if (!history || history.length === 0) return null;

  const previous = history[history.length - 1];
  const delta = currentScore - previous.score;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const arrow = direction === "up" ? "▲" : direction === "down" ? "▼" : "―";

  return (
    <div className={`intentTrend intentTrend-${direction}`}>
      <span className="intentTrendArrow">{arrow}</span>
      <span>
        Previously {previous.score} ({formatRelativeTime(previous.date)}) → now {currentScore}
      </span>
    </div>
  );
}
