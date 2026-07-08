import { useLocation, useNavigate } from "react-router-dom";
import SignalEngineLogo from "../components/logo/SignalEngineLogo";
import SignalEngineBackground from "../components/background/SignalEngineBackground";
import "./BatchResults.css";

export default function BatchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results;

  if (!results || results.length === 0) {
    return (
      <div className="batchEmpty">
        <h1>No batch results.</h1>
        <button className="primaryBtn" onClick={() => navigate("/setup")}>
          Run Pipeline
        </button>
      </div>
    );
  }

  // Highest score first, then clean "no signals" runs, then genuine failures.
  const statusRank = { ok: 0, no_signals: 1, failed: 2 };
  const ranked = [...results].sort((a, b) => {
    const diff = statusRank[a.status] - statusRank[b.status];
    if (diff !== 0) return diff;
    return (b.score ?? -1) - (a.score ?? -1);
  });

  const handleRowClick = (row) => {
    if (row.status !== "ok") return;
    navigate("/dashboard", {
      state: { pipelineResult: row.data },
    });
  };

  return (
    <>
      <SignalEngineBackground />

      <main className="batchResults">

        <header className="hero">

          <div className="heroTitle">
            <SignalEngineLogo size={56} />
            <div>
              <h1>Batch Results</h1>
              <p>Ranked by buying intent — {results.length} companies analyzed</p>
            </div>
          </div>

          <button className="primaryBtn" onClick={() => navigate("/setup")}>
            Run Another Batch
          </button>

        </header>

        <div className="batchList">

          {ranked.map((row, index) => {
            const tier =
              row.score >= 70 ? "HIGH" : row.score >= 40 ? "MEDIUM" : "LOW";
            const rowClass =
              row.status === "ok"
                ? "clickable"
                : row.status === "no_signals"
                ? "noSignalsRow"
                : "failedRow";

            return (
              <article
                key={`${row.companyDomain}-${index}`}
                className={`batchRow ${rowClass}`}
                onClick={() => handleRowClick(row)}
              >
                <div className="batchRank">#{index + 1}</div>

                <div className="batchCompany">
                  <h3>{row.companyName}</h3>
                  <p>{row.companyDomain}</p>
                </div>

                <div className="batchSummary">
                  {row.status === "ok"
                    ? row.companySummary || "No summary available."
                    : row.error}
                </div>

                <div className="batchScore">
                  {row.status === "ok" ? (
                    <>
                      <div className="scoreValue">{row.score}</div>
                      <span className={`tierBadge tier${tier}`}>{tier}</span>
                    </>
                  ) : row.status === "no_signals" ? (
                    <span className="tierBadge tierNone">NO SIGNALS</span>
                  ) : (
                    <span className="tierBadge tierFailed">FAILED</span>
                  )}
                </div>
              </article>
            );
          })}

        </div>

      </main>
    </>
  );
}
