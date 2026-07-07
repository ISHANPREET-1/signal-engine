import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Setup.module.css";
import { runPipeline, runBatchPipeline, runPlg } from "../services/api";
import SignalEngineBackground from "../components/background/SignalEngineBackground";
import SignalEngineLogo from "../components/logo/SignalEngineLogo";

export default function Setup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyDomain: "",
    userProduct: "",
  });

  const [loading, setLoading] = useState(false);

  // Batch mode is fully additive — "single" preserves the original form and
  // submit behavior below completely unchanged.
  const [mode, setMode] = useState("single");
  const [batchText, setBatchText] = useState("");

  // Top-level flow: "outbound" is the existing company-research path (single +
  // batch), untouched. "plg" is the separate product-qualified-lead prototype.
  const [flow, setFlow] = useState("outbound");
  const [plgData, setPlgData] = useState({
    userName: "",
    userEmail: "",
    companyName: "",
    visualsCreated: "",
    teammatesInvited: "",
    freeTierLimitHits: "",
    daysActive: "",
  });

  const handlePlgChange = (e) => {
    setPlgData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlgSubmit = async (e) => {
    e.preventDefault();

    if (!plgData.userName && !plgData.userEmail) {
      alert("Enter a user name or email.");
      return;
    }

    try {
      setLoading(true);

      const result = await runPlg(plgData);

      navigate("/plg-results", {
        state: {
          plgResult: result,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "PLG scoring failed.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const parseBatchCompanies = (text) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, domain] = line.split(",").map((part) => part?.trim());
        return { companyName: name, companyDomain: domain };
      });

  const handleBatchSubmit = async () => {
    const companies = parseBatchCompanies(batchText);

    if (companies.length === 0) {
      alert('Enter at least one company, one per line (e.g. "Vercel, vercel.com").');
      return;
    }

    if (companies.length > 5) {
      alert("Batch mode supports up to 5 companies at a time.");
      return;
    }

    const badIndex = companies.findIndex((c) => !c.companyName || !c.companyDomain);
    if (badIndex !== -1) {
      alert(
        `Line ${badIndex + 1} is missing a name or domain — use the format "Company Name, domain.com".`
      );
      return;
    }

    if (!formData.userProduct) {
      alert("Please describe your product.");
      return;
    }

    try {
      setLoading(true);

      const result = await runBatchPipeline({
        companies,
        userProduct: formData.userProduct,
      });

      navigate("/batch-results", {
        state: {
          results: result.results,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Batch pipeline failed.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "batch") {
      await handleBatchSubmit();
      return;
    }

    if (
      !formData.companyName ||
      !formData.companyDomain ||
      !formData.userProduct
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const result = await runPipeline(formData);

      navigate("/loading", {
        state: {
          formData,
          pipelineResult: result,
        },
      });
    } catch (err) {
      console.error(err);
      const message =
        err.message === "No signals found for this company"
          ? `No strong buying signals found for ${formData.companyName} in the last 30 days — try a different company or check back later.`
          : err.message || "Pipeline failed.";
      alert(message);
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>

      <SignalEngineBackground />

      <header className={styles.header}>

        <div
          className={styles.logo}
          onClick={() => navigate("/")}
        >
          <SignalEngineLogo />
          <span>Signal Engine</span>
        </div>

      </header>

      <div className={styles.container}>

        <div className={styles.left}>

          <h2>Run Signal Pipeline</h2>

          <div className={styles.modeToggle}>

            <button
              type="button"
              className={flow === "outbound" ? styles.modeActive : ""}
              onClick={() => setFlow("outbound")}
            >
              Outbound Research
            </button>

            <button
              type="button"
              className={flow === "plg" ? styles.modeActive : ""}
              onClick={() => setFlow("plg")}
            >
              PLG Mode
            </button>

          </div>

          {flow === "outbound" ? (

          <>

          <div className={styles.modeToggle}>

            <button
              type="button"
              className={mode === "single" ? styles.modeActive : ""}
              onClick={() => setMode("single")}
            >
              Single Company
            </button>

            <button
              type="button"
              className={mode === "batch" ? styles.modeActive : ""}
              onClick={() => setMode("batch")}
            >
              Batch Mode
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            {mode === "single" ? (

              <>

                <label>Company Name</label>

                <input
                  type="text"
                  name="companyName"
                  placeholder="Microsoft"
                  value={formData.companyName}
                  onChange={handleChange}
                />

                <label>Company Website</label>

                <input
                  type="text"
                  name="companyDomain"
                  placeholder="microsoft.com"
                  value={formData.companyDomain}
                  onChange={handleChange}
                />

              </>

            ) : (

              <>

                <label>Companies (one per line, up to 5)</label>

                <textarea
                  rows="5"
                  name="batchText"
                  placeholder={"Vercel, vercel.com\nNotion, notion.so\nWebflow, webflow.com"}
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                />

                <span className={styles.runtime}>
                  Format: Company Name, domain.com — processed one at a time
                </span>

              </>

            )}

            <label>Describe your product</label>

            <textarea
              rows="5"
              name="userProduct"
              placeholder="We help sales teams identify companies showing buying intent..."
              value={formData.userProduct}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Running..."
                : mode === "batch"
                ? "Analyze Batch"
                : "Analyze Company"}
            </button>

            <span className={styles.runtime}>
              {mode === "batch"
                ? "Estimated runtime • ~10 seconds per company"
                : "Estimated runtime • 8–10 seconds"}
            </span>

          </form>

          </>

          ) : (

          <form onSubmit={handlePlgSubmit}>

            <label>User Name</label>

            <input
              type="text"
              name="userName"
              placeholder="Dana Lee"
              value={plgData.userName}
              onChange={handlePlgChange}
            />

            <label>User Email</label>

            <input
              type="text"
              name="userEmail"
              placeholder="dana@acme.com"
              value={plgData.userEmail}
              onChange={handlePlgChange}
            />

            <label>Company Name</label>

            <input
              type="text"
              name="companyName"
              placeholder="Acme Inc"
              value={plgData.companyName}
              onChange={handlePlgChange}
            />

            <label>Visuals / actions created</label>

            <input
              type="number"
              min="0"
              name="visualsCreated"
              placeholder="30"
              value={plgData.visualsCreated}
              onChange={handlePlgChange}
            />

            <label>Teammates invited</label>

            <input
              type="number"
              min="0"
              name="teammatesInvited"
              placeholder="3"
              value={plgData.teammatesInvited}
              onChange={handlePlgChange}
            />

            <label>Times hit free-tier limit</label>

            <input
              type="number"
              min="0"
              name="freeTierLimitHits"
              placeholder="3"
              value={plgData.freeTierLimitHits}
              onChange={handlePlgChange}
            />

            <label>Days active (last 30)</label>

            <input
              type="number"
              min="0"
              max="30"
              name="daysActive"
              placeholder="20"
              value={plgData.daysActive}
              onChange={handlePlgChange}
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Scoring..." : "Score PQL"}
            </button>

            <span className={styles.runtime}>
              Prototype • scores a simulated sign-up from usage behavior
            </span>

          </form>

          )}

        </div>

      </div>

    </main>
  );
}