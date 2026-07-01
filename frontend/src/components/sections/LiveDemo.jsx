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
    height: "560px",
    borderRadius: "28px",
    border: "1px solid rgba(255,255,255,.08)",
    background: "linear-gradient(180deg,#181818,#121212)",
    boxShadow: "0 20px 60px rgba(0,0,0,.45)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
  }}
>
  <div
    style={{
      width: "90px",
      height: "90px",
      borderRadius: "50%",
      background: "rgba(158,29,55,.18)",
      border: "1px solid rgba(158,29,55,.35)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "34px",
      color: "#fff",
    }}
  >
    ▶️
  </div>

  <h3
    style={{
      color: "#fff",
      fontSize: "28px",
      margin: 0,
    }}
  >
    Product Walkthrough
  </h3>

  <p
    style={{
      color: "#8F8F8F",
      maxWidth: "500px",
      textAlign: "center",
      lineHeight: 1.7,
      margin: 0,
    }}
  >
    A complete walkthrough showing Signal Engine discovering buying
    signals, identifying decision makers and generating personalized
    outreach in real time.
  </p>
</div>
      </div>
    </section>
  );
}