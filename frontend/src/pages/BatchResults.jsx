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

  // Highest score first; failed entries (no score to rank by) sort last.
  const ranked = [...results].sort((a, b) => {
    if (a.status === "ok" && b.status !== "ok") return -1;
    if (a.status !== "ok" && b.status === "ok") return 1;
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
            const clickable = row.status === "ok";
            const tier =
              row.score >= 70 ? "HIGH" : row.score >= 40 ? "MEDIUM" : "LOW";

            return (
              <article
                key={`${row.companyDomain}-${index}`}
                className={`batchRow ${clickable ? "clickable" : "failedRow"}`}
                onClick={() => handleRowClick(row)}
              >
                <div className="batchRank">#{index + 1}</div>

                <div className="batchCompany">
                  <h3>{row.companyName}</h3>
                  <p>{row.companyDomain}</p>
                </div>

                <div className="batchSummary">
                  {clickable
                    ? row.companySummary || "No summary available."
                    : `No data — ${row.error || "pipeline failed for this company"}`}
                </div>

                <div className="batchScore">
                  {clickable ? (
                    <>
                      <div className="scoreValue">{row.score}</div>
                      <span className={`tierBadge tier${tier}`}>{tier}</span>
                    </>
                  ) : (
                    <span className="tierBadge tierNone">NO DATA</span>
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
