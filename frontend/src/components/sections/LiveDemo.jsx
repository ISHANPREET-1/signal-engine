export default function LiveDemo() {
  return (
    <section
      id="live-demo"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "120px 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "min(1100px, calc(100% - 80px))",
          margin: "0 auto",
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
            marginBottom: "26px",
          }}
        >
          Live Demo
        </div>

        <h2
          style={{
            fontSize: "56px",
            color: "#fff",
            marginBottom: "22px",
            fontWeight: 800,
          }}
        >
          Watch Signal Engine in Action
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto 60px",
            color: "#9B9B9B",
            fontSize: "18px",
            lineHeight: 1.8,
          }}
        >
          A real walkthrough of Signal Engine detecting buying signals,
          identifying the right decision maker and generating personalized
          outreach automatically.
        </p>

        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,.08)",
            background: "linear-gradient(180deg,#181818,#121212)",
            boxShadow: "0 20px 60px rgba(0,0,0,.45)",
            overflow: "hidden",
          }}
        >
          <video
            controls
            autoPlay
            muted
            loop
            playsInline
            style={{
              display: "block",
              width: "100%",
              height: "100%",
            }}
          >
            <source
              src="/videos/signal-engine-demo.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}