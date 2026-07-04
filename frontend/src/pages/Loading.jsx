import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { runPipeline } from "../services/api";
import styles from "./Loading.module.css";
import SignalEngineBackground from "../components/background/SignalEngineBackground";

const STEPS = [
  "Discovering Buying Signals",
  "Finding Decision Maker",
  "Generating AI Outreach",
  "Syncing CRM",
  "Finalizing Results",
];

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();

  const formData = location.state?.formData;

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!formData) {
      navigate("/setup");
      return;
    }

    let interval;

    const startPipeline = async () => {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= STEPS.length - 1) return prev;
          return prev + 1;
        });
      }, 1500);

      try {
        const result = await runPipeline(formData);

        clearInterval(interval);

        navigate("/dashboard", {
          state: {
            pipelineResult: result,
          },
        });
      } catch (err) {
        clearInterval(interval);
        console.error(err);
        const message =
          err.message === "No signals found for this company"
            ? `No strong buying signals found for ${formData.companyName} in the last 30 days — try a different company or check back later.`
            : err.message || "Pipeline failed.";
        alert(message);
        navigate("/setup");
      }
    };

    startPipeline();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [formData, navigate]);

  return (
    <main className={styles.page}>

      <SignalEngineBackground />

      <div className={styles.card}>

        <h1>Running Signal Engine</h1>

        <p>
          We're gathering buying signals, enriching contact data and generating
          personalized outreach.
        </p>

        <div className={styles.steps}>

          {STEPS.map((step, index) => {

            const completed = index < activeStep;
            const current = index === activeStep;

            return (
              <div
                key={step}
                className={`${styles.step} ${
                  completed
                    ? styles.completed
                    : current
                    ? styles.active
                    : styles.pending
                }`}
              >
                <div className={styles.dot}>
                  {completed ? "✓" : index + 1}
                </div>

                <span>{step}</span>
              </div>
            );
          })}

        </div>

        <div className={styles.loader}></div>

        <div className={styles.status}>
          {activeStep < STEPS.length
            ? STEPS[activeStep]
            : "Almost done..."}
        </div>

      </div>

    </main>
  );
}