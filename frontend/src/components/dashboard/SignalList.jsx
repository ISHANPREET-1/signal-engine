import { useState } from "react";
import "./SignalList.css";

// Mirrors backend/services/scoringService.js's weights so the list order
// matches the Score Breakdown shown above it. Display-only — scoring itself
// still happens entirely on the backend.
const CATEGORY_WEIGHTS = {
  Funding: 30,
  "Product Launch": 25,
  Acquisition: 25,
  "Executive Change": 15,
  Partnership: 15,
  Expansion: 15,
  "Competitor Pain": 10,
  "Security Incident": 10,
};

const getRelevanceWeight = (signal, hiringCount) => {
  if (signal.category === "Hiring") {
    return hiringCount >= 2 ? 20 : 10;
  }
  return CATEGORY_WEIGHTS[signal.category] || 0;
};

export default function SignalList({ signals }) {

  const [showAll, setShowAll] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(0);

  if (!signals || signals.length === 0) return null;

  const hiringCount = signals.filter((s) => s.category === "Hiring").length;

  const sortedSignals = [...signals].sort(
    (a, b) => getRelevanceWeight(b, hiringCount) - getRelevanceWeight(a, hiringCount)
  );

  const visibleSignals = showAll
    ? sortedSignals
    : sortedSignals.slice(0, 3);

  return (

    <section className="signalSection">

      <div className="signalHeader">

        <div>

          <h2>Buying Signals</h2>

          <p>
            Highest intent opportunities discovered by the pipeline
          </p>

        </div>

        <div className="signalCount">
          {signals.length} Signals
        </div>

      </div>

      <div className="signalScroll">

        <div className="signalList">

          {visibleSignals.map((signal, index) => {

            const badgeLabel = (signal.category || "Other").toUpperCase();

            return (

              <article
                key={index}
                onClick={() => setSelectedSignal(index)}
                className={`signalCard ${
                  selectedSignal === index
                    ? "activeSignal"
                    : ""
                }`}
              >

                <div className="signalTop">

                  <div className="signalBadge">
                    {badgeLabel}
                  </div>

                  <div className="signalDate">
                    {signal.date
                      ? new Date(signal.date).toLocaleDateString()
                      : ""}
                  </div>

                </div>

                <h3>
                  {signal.signalDetail}
                </h3>

                <p>
                  {signal.description}
                </p>

                <div className="signalFooter">

                  <span>
                    {signal.source}
                  </span>

                  {signal.url && (

                    <a
                      href={signal.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read Article →
                    </a>

                  )}

                </div>

              </article>

            );

          })}

        </div>

      </div>

      {signals.length > 3 && (

        <button
          className="viewAllBtn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View All"}
        </button>

      )}

    </section>

  );

}