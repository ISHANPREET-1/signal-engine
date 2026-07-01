import React from "react";
import AIGenerationCard from "./AIGenerationCard";
import SignalRow from "./SignalRow";
import SpotlightCard from "../reactbits/SpotlightCard";
import styles from "./DashboardMockup.module.css";

const signals = [
  {
    id: 1,
    initial: "V",
    company: "Vercel",
    detail: "Raised Series C funding",
    badges: [{ label: "Funding", type: "funding" }],
  },
  {
    id: 2,
    initial: "A",
    company: "Anthropic",
    detail: "Hiring AI Infrastructure Engineers",
    badges: [{ label: "Hiring", type: "hiring" }],
  },
  {
    id: 3,
    initial: "L",
    company: "Linear",
    detail: "New VP of Engineering joined",
    badges: [{ label: "Leadership", type: "leadership" }],
  },
];

export default function DashboardMockup() {
  return (
    <SpotlightCard
      className={styles.shell}
      spotlightColor="rgba(122, 17, 36, 0.25)"
    >
      <div className={styles.chrome}>
        <div className={styles.traffic}>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.address}>
          signal-engine.app
        </div>

        <div className={styles.placeholder} />
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={`${styles.icon} ${styles.active}`}>⌂</div>
          <div className={styles.icon}>⌕</div>
          <div className={styles.icon}>⚡</div>
          <div className={styles.icon}>⚙</div>
        </aside>

        <main className={styles.content}>
          <AIGenerationCard
            contactName="Alex"
            companyName="Vercel"
            message="just raised a Series C round and is rapidly expanding their engineering team. Signal Engine can help you reach the right people while the buying intent is highest."
          />

          <div className={styles.feed}>
            <h4 className={styles.heading}>
              Live Buying Signals
            </h4>

            {signals.map((signal) => (
              <SignalRow
                key={signal.id}
                initial={signal.initial}
                company={signal.company}
                detail={signal.detail}
                badges={signal.badges}
              />
            ))}
          </div>
        </main>
      </div>
    </SpotlightCard>
  );
}