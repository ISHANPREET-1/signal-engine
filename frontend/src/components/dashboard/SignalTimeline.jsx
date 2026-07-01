import "./SignalTimeline.css";

export default function SignalTimeline({ signals = [] }) {
  return (
    <div className="timelineCard">
      <div className="timelineHeader">
        <div>
          <h2>Signal Activity</h2>
          <p>Last 30 days</p>
        </div>

        <div className="timelineBadge">
          {signals.length} Signals
        </div>
      </div>

      <div className="timelineGraph">

        <div className="gridLine"></div>
        <div className="gridLine"></div>
        <div className="gridLine"></div>
        <div className="gridLine"></div>

        <svg
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          className="graphSvg"
        >
          <defs>
            <linearGradient id="lineGlow" x1="0" x2="1">
              <stop offset="0%" stopColor="#7A1124" />
              <stop offset="100%" stopColor="#C41F45" />
            </linearGradient>
          </defs>

          <path
            d="
            M0,185
            C120,175 170,180 250,165
            S390,120 480,95
            S640,105 740,110
            S860,60 1000,25
            "
            fill="none"
            stroke="url(#lineGlow)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="timelineLabels">
          <span>30d Ago</span>
          <span>24d</span>
          <span>18d</span>
          <span>12d</span>
          <span>6d</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}