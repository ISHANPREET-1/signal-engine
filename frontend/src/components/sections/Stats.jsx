import {
  FiZap,
  FiMail,
  FiTarget,
  FiLayers,
} from "react-icons/fi";

export default function Stats() {
  const features = [
    {
      icon: <FiZap />,
      title: "Real-Time Buying Signals",
      description:
        "Track funding announcements, hiring spikes, leadership changes, acquisitions and product launches as they happen.",
    },
    {
      icon: <FiMail />,
      title: "AI-Personalized Outreach",
      description:
        "Generate context-aware cold emails and LinkedIn messages based on the exact buying signal instead of generic templates.",
    },
    {
      icon: <FiTarget />,
      title: "Intent-Driven Prospecting",
      description:
        "Identify the right companies at the right moment so your outreach reaches prospects when purchase intent is highest.",
    },
    {
      icon: <FiLayers />,
      title: "Built for Modern GTM Teams",
      description:
        "Designed for founders, SDRs and growth teams with a workflow that fits naturally into existing outbound processes.",
    },
  ];

  return (
    <section
      id="why-signal-engine"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "180px 0 120px",
      }}
    >
      <div
        style={{
          width: "min(1180px, calc(100% - 80px))",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "70px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "9px 22px",
              borderRadius: "999px",
              background: "rgba(122,17,36,.12)",
              border: "1px solid rgba(122,17,36,.35)",
              color: "#C8C8C8",
              fontSize: "14px",
              marginBottom: "24px",
            }}
          >
            Why Signal Engine
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Everything you need for
            <br />
            signal-based outbound.
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              color: "#9B9B9B",
              fontSize: "18px",
              lineHeight: 1.8,
            }}
          >
            Signal Engine combines buying signals, AI reasoning and
            personalized outreach into one streamlined workflow.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "28px",
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: "34px",
                borderRadius: "26px",
                background:
                  "linear-gradient(180deg,#181818 0%,#121212 100%)",
                border: "1px solid rgba(255,255,255,.08)",
                boxShadow:
                  "0 16px 45px rgba(0,0,0,.35)",
                transition: "all .35s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor =
                  "rgba(158,29,55,.45)";
                e.currentTarget.style.boxShadow =
                  "0 22px 60px rgba(0,0,0,.45),0 0 35px rgba(158,29,55,.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,.08)";
                e.currentTarget.style.boxShadow =
                  "0 16px 45px rgba(0,0,0,.35)";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "18px",
                  background: "rgba(122,17,36,.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C52B4E",
                  fontSize: "28px",
                  marginBottom: "24px",
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  color: "#fff",
                  fontSize: "25px",
                  marginBottom: "16px",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  color: "#9A9A9A",
                  lineHeight: 1.8,
                  fontSize: "17px",
                  margin: 0,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}