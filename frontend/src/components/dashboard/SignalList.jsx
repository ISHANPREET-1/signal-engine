import { useState } from "react";
import "./SignalList.css";

const TYPE_CONFIG = {
  news: { label: "NEWS" },
  funding: { label: "FUNDING" },
  hiring: { label: "HIRING" },
  competitor_pain: { label: "COMPETITOR PAIN" },
};

export default function SignalList({ signals }) {

  const [showAll, setShowAll] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(0);

  if (!signals || signals.length === 0) return null;

  const visibleSignals = showAll
    ? signals
    : signals.slice(0, 3);

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

            const type =
              TYPE_CONFIG[signal.signalType] ??
              TYPE_CONFIG.news;

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
                    {type.label}
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