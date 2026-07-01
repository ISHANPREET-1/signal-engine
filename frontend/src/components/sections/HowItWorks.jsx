import styles from "./HowItWorks.module.css";

import {
  FiSearch,
  FiCpu,
  FiUsers,
  FiSend,
  FiLayers,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiSearch />,
    title: "Detect Signal",
    description:
      "Monitor funding announcements, hiring spikes, leadership changes and company news.",
  },
  {
    icon: <FiCpu />,
    title: "Understand Context",
    description:
      "AI analyzes why the company is likely entering an active buying cycle.",
  },
  {
    icon: <FiUsers />,
    title: "Find Decision Maker",
    description:
      "Identify founders, hiring managers and executives most relevant to your offer.",
  },
  {
    icon: <FiSend />,
    title: "Generate Outreach",
    description:
      "Create personalized emails and LinkedIn messages referencing the exact signal.",
  },
  {
    icon: <FiLayers />,
    title: "Deliver to Stack",
    description:
      "Push contacts and outreach directly into your CRM and sales workflow.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <span className={styles.badge}>
          AI Workflow
        </span>

        <h2 className={styles.heading}>
          From buying signal to
          <br />
          personalized outreach.
        </h2>

        <p className={styles.subheading}>
          Signal Engine continuously detects buying intent,
          understands context, identifies the right people
          and prepares personalized outreach automatically.
        </p>

        <div className={styles.timeline}>

          {steps.map((step, index) => (
            <div
              className={styles.item}
              key={index}
            >
              <div className={styles.card}>

                <div className={styles.icon}>
                  {step.icon}
                </div>

                <div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                </div>

              </div>

              {index !== steps.length - 1 && (
                <div className={styles.line}></div>
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}