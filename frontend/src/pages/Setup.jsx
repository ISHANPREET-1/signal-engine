import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Setup.module.css";
import { runPipeline } from "../services/api";
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

          <form onSubmit={handleSubmit}>

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
              {loading ? "Running..." : "Analyze Company"}
            </button>

            <span className={styles.runtime}>
              Estimated runtime • 8–10 seconds
            </span>

          </form>

        </div>

      </div>

    </main>
  );
}