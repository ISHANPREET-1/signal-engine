import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Setup.module.css";
import { runPipeline, runBatchPipeline } from "../services/api";
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

        </div>

      </div>

    </main>
  );
}