import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { runPlg } from "../services/api";
import styles from "./Loading.module.css";
import SignalEngineBackground from "../components/background/SignalEngineBackground";

const STEPS = [
  "Reading Usage Behavior",
  "Classifying Upgrade Signals",
  "Generating AI Reasoning",
  "Finalizing Results",
];

export default function PlgLoading() {
  const navigate = useNavigate();
  const location = useLocation();

  const plgData = location.state?.plgData;

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!plgData) {
      navigate("/setup");
      return;
    }

    let interval;

    const startScoring = async () => {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= STEPS.length - 1) return prev;
          return prev + 1;
        });
      }, 1500);

      try {
        const result = await runPlg(plgData);

        clearInterval(interval);

        navigate("/plg-results", {
          state: {
            plgResult: result,
          },
        });
      } catch (err) {
        clearInterval(interval);
        console.error(err);
        alert(err.message || "PLG scoring failed.");
        navigate("/setup");
      }
    };

    startScoring();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [plgData, navigate]);

  return (
    <main className={styles.page}>

      <SignalEngineBackground />

      <div className={styles.card}>

        <h1>Scoring PQL</h1>

        <p>
          We're reading in-product usage behavior and generating an honest
          upgrade-intent reasoning summary.
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
