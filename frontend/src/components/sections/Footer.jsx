import SignalEngineLogo from "../logo/SignalEngineLogo";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,.06)",
        marginTop: "140px",
        padding: "70px 0 40px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div
        style={{
          width: "min(1180px, calc(100% - 80px))",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "80px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "340px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "18px",
            }}
          >
            <SignalEngineLogo size={42} />

            <span
              style={{
                color: "#FFFFFF",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              Signal Engine
            </span>
          </div>

          <p
            style={{
              color: "#9A9A9A",
              lineHeight: 1.8,
              fontSize: "15px",
            }}
          >
            Monitor buying signals, generate AI-powered outreach,
            and connect with prospects when intent is highest.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "80px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h4
              style={{
                color: "#FFFFFF",
                marginBottom: "18px",
                fontSize: "17px",
              }}
            >
              Product
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: "#9A9A9A",
              }}
            >
              <a href="#how-it-works">How It Works</a>
              <a href="#live-demo">Live Demo</a>
            </div>
          </div>

          <div>
            <h4
              style={{
                color: "#FFFFFF",
                marginBottom: "18px",
                fontSize: "17px",
              }}
            >
              Resources
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: "#9A9A9A",
              }}
            >
              <a
                href="https://github.com/ISHANPREET-1/signal-engine"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>

              <a href="/">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "70px",
          textAlign: "center",
          color: "#666666",
          fontSize: "14px",
        }}
      >
        ©️ 2026 Signal Engine. Built for modern GTM teams.
      </div>
    </footer>
  );
}