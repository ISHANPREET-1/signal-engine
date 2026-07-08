import { useLocation, useNavigate } from "react-router-dom";
import SignalEngineLogo from "../components/logo/SignalEngineLogo";
import SignalEngineBackground from "../components/background/SignalEngineBackground";

// Reuse the outbound Dashboard's visual language (score card, breakdown badges,
// summary banner, overview grid) so PLG results feel like the same product,
// plus a little PLG-specific styling for the usage recap.
import "./Dashboard.css";
import "./PlgResults.css";

export default function PlgResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.plgResult;

  if (!data) {
    return (
      <div className="dashboardEmpty">
        <h1>No PLG data.</h1>
        <button className="primaryBtn" onClick={() => navigate("/setup")}>
          Score a User
        </button>
      </div>
    );
  }

  const { signup = {}, score = 0, breakdown = [], plgSummary } = data;
  const tier = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

  const usageStats = [
    { label: "Visuals / Actions", value: signup.visualsCreated || 0 },
    { label: "Teammates Invited", value: signup.teammatesInvited || 0 },
    { label: "Free-Limit Hits", value: signup.freeTierLimitHits || 0 },
    { label: "Days Active (30d)", value: signup.daysActive || 0 },
  ];

  return (
    <>
      <SignalEngineBackground />

      <main className="dashboard plgResults">

        <header className="hero">

          <div className="heroTitle">
            <SignalEngineLogo size={56} />
            <div>
              <h1>PLG Mode</h1>
              <p>Product-qualified lead scoring · prototype</p>
            </div>
          </div>

          <button className="primaryBtn" onClick={() => navigate("/setup")}>
            Score Another User
          </button>

        </header>

        {plgSummary && (
          <div className="summaryBanner">
            <span className="summaryLabel">AI Analysis</span>
            <p>{plgSummary}</p>
          </div>
        )}

        <div className="overviewGrid">

          <div className="companyCard">
            <h3>User</h3>
            <h2>{signup.userName || signup.userEmail || "Unknown user"}</h2>
            <p>{signup.userEmail}</p>
          </div>

          <div className="intentCard">
            <div className="intentLabel">Upgrade Intent</div>
            <div className="intentScore">{score}</div>
            <span>{tier}</span>
          </div>

          <div className="contactPreview">
            <h3>Company</h3>
            <h2>{signup.companyName || "—"}</h2>
            <p>Free-tier sign-up</p>
          </div>

        </div>

        {breakdown.length > 0 ? (
          <div className="breakdownRow">
            <span className="breakdownRowLabel">Score Breakdown</span>
            <div className="breakdownBadges">
              {breakdown.map((item, index) => (
                <span key={index} className="breakdownBadge">
                  {item.signal} +{item.points}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="breakdownRow">
            <span className="breakdownRowLabel">Score Breakdown</span>
            <div className="breakdownBadges">
              <span className="plgNoSignal">
                No usage factors crossed a scoring threshold.
              </span>
            </div>
          </div>
        )}

        <div className="plgUsageGrid">
          {usageStats.map((stat) => (
            <div key={stat.label} className="plgUsageCell">
              <div className="plgUsageValue">{stat.value}</div>
              <div className="plgUsageLabel">{stat.label}</div>
            </div>
          ))}
        </div>

        {breakdown.length > 0 && (
          <div className="plgFactorList">
            {breakdown.map((item, index) => (
              <div key={index} className="plgFactorRow">
                <div className="plgFactorMain">
                  <h3>{item.signal}</h3>
                  <p>{item.detail}</p>
                </div>
                <div className="plgFactorPoints">+{item.points}</div>
              </div>
            ))}
          </div>
        )}

      </main>
    </>
  );
}
