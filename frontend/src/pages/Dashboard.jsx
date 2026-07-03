import { useLocation, useNavigate } from "react-router-dom";
import SignalEngineLogo from "../components/logo/SignalEngineLogo";
import StatsCards from "../components/dashboard/StatsCards";
import SignalTimeline from "../components/dashboard/SignalTimeline";
import SignalList from "../components/dashboard/SignalList";
import OutreachPanel from "../components/dashboard/OutreachPanel";

import SignalEngineBackground from "../components/background/SignalEngineBackground";

import "./Dashboard.css";

export default function Dashboard() {

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.pipelineResult;

  const score = data?.score ?? 0;
  const intentTier = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

  if (!data) {

    return (

      <div className="dashboardEmpty">

        <h1>No pipeline data.</h1>

        <button
          className="primaryBtn"
          onClick={() => navigate("/setup")}
        >
          Run Pipeline
        </button>

      </div>

    );

  }

  return (

    <>

      <SignalEngineBackground />

      <main className="dashboard">

       <header className="hero">

  <div className="heroTitle">

    <SignalEngineLogo size={56} />

    <div>

      <h1>Signal Engine</h1>

      <p>
        AI-powered GTM intelligence dashboard
      </p>

    </div>

  </div>

  <button
    className="primaryBtn"
    onClick={() => navigate("/setup")}
  >
    Analyze Another Company
  </button>

</header>

        {/* AI Reasoning Summary */}

        {data.companySummary && (

          <div className="summaryBanner">

            <span className="summaryLabel">AI Analysis</span>

            <p>{data.companySummary}</p>

          </div>

        )}

        {/* Overview */}

        <div className="overviewGrid">

          <div className="companyCard">

            <h3>Company</h3>

            <h2>{data.companyName}</h2>

            <p>
              {data.contact?.companyDomain}
            </p>

          </div>

          <div className="intentCard">

            <div className="intentLabel">
              Buying Intent
            </div>

            <div className="intentScore">
              {score}
            </div>

            <span>{intentTier}</span>

          </div>

          <div className="contactPreview">

            <h3>Decision Maker</h3>

            <h2>
              {data.contact?.firstName}{" "}
              {data.contact?.lastName}
            </h2>

            <p>
              {data.contact?.role}
            </p>

          </div>

        </div>

        {/* Score Breakdown */}

        {data.breakdown && data.breakdown.length > 0 && (

          <div className="breakdownRow">

            <span className="breakdownRowLabel">Score Breakdown</span>

            <div className="breakdownBadges">

              {data.breakdown.map((item, index) => (

                <span key={index} className="breakdownBadge">
                  {item.signal} +{item.points}
                </span>

              ))}

            </div>

          </div>

        )}

        <StatsCards
          signals={data.signals}
        />

        <SignalTimeline
          signals={data.signals}
        />

        {/* Main Layout */}

        <div className="mainGrid">

          <div className="leftColumn">

            <SignalList
              signals={data.signals}
            />

         

          </div>

          <div className="rightColumn">

            <OutreachPanel
              outreach={data.outreach?.[0]?.outreach}
            />

          </div>

        </div>

      </main>

    </>

  );

}