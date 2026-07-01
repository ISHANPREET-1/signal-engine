import "./HeroDashboardPreview.css";

export default function HeroDashboardPreview() {
  return (
    <div className="heroPreview">

      <div className="previewWindow">

        <div className="previewTopbar">

          <div className="trafficLights">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="previewTitle">
            signal-engine.app
          </div>

        </div>

        <div className="previewBody">

          {/* TOP OVERVIEW */}

          <div className="previewOverview">

            <div className="miniCompany">

              <span>COMPANY</span>

              <h3>Microsoft</h3>

            </div>

            <div className="miniIntent">

              <span>INTENT</span>

              <h2>92</h2>

            </div>

            <div className="miniDecision">

              <span>DECISION MAKER</span>

              <h3>Florian Schuster</h3>

            </div>

          </div>

          {/* STATS */}

          <div className="miniStats">

            <div className="miniStat">
              <span>News</span>
              <strong>5</strong>
            </div>

            <div className="miniStat">
              <span>Funding</span>
              <strong>5</strong>
            </div>

            <div className="miniStat">
              <span>Hiring</span>
              <strong>2</strong>
            </div>

            <div className="miniStat">
              <span>Competitor</span>
              <strong>0</strong>
            </div>

          </div>

          {/* CHART */}

          <div className="miniChart">

            <div className="chartHeader">
              <span>Signal Activity</span>
              <small>30 Days</small>
            </div>

            <svg
              className="chartSvg"
              viewBox="0 0 520 120"
              preserveAspectRatio="none"
            >

              <line x1="0" y1="25" x2="520" y2="25" className="gridLine"/>
              <line x1="0" y1="60" x2="520" y2="60" className="gridLine"/>
              <line x1="0" y1="95" x2="520" y2="95" className="gridLine"/>

              <path
                d="
                  M0 92
                  C45 92 60 88 95 86
                  S155 80 190 72
                  S255 50 305 42
                  S360 48 400 55
                  S455 42 520 16
                "
                className="chartStroke"
              />

            </svg>

          </div>

          {/* BOTTOM */}

          <div className="previewBottom">

            <div className="miniSignal">

              <div className="badge">
                NEWS
              </div>

              <h4>
                Microsoft expands AI infrastructure
              </h4>

              <p>
                Funding and hiring momentum indicate strong
                buying intent for enterprise AI solutions.
              </p>

            </div>

            <div className="miniOutreach">

              <h4>
                AI Outreach
              </h4>

              <div className="miniBlock">
                Personalized email generated
              </div>

              <div className="miniButton">
                Copy Draft
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}