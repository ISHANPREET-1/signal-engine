import React from "react";
import { useNavigate } from "react-router-dom";

import SplitText from "../reactbits/SplitText";
import HeroDashboardPreview from "../hero/HeroDashboardPreview";
import styles from "./Hero.module.css";
import BorderGlow from "../reactbits/BorderGlow";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>

      <div className={styles.overlay} />

      <div className={styles.container}>

        {/* LEFT */}

        <div className={styles.left}>

          <div className={styles.badge}>
            Signal-Based Outbound
          </div>

          <SplitText
            text="Reach prospects the moment they're ready to buy."
            className={styles.heading}
            delay={45}
            duration={0.8}
            ease="power3.out"
            splitType="words"
            from={{
              opacity: 0,
              y: 30,
            }}
            to={{
              opacity: 1,
              y: 0,
            }}
            textAlign="left"
          />

          <p className={styles.subheading}>
            Monitor funding, hiring, leadership changes and company news.
            Generate personalized AI outreach automatically and reach buyers
            while intent is highest.
          </p>

          <div className={styles.buttons}>

            <BorderGlow
              glowColor="122 17 36"
              backgroundColor="#7A1124"
              borderRadius={16}
              glowRadius={30}
            >
              <button
                className={styles.primary}
                onClick={() => navigate("/setup")}
              >
                Try It Free
              </button>
            </BorderGlow>

          <button
  className={styles.secondary}
  onClick={() =>
    window.open(
      "https://github.com/ISHANPREET-1/signal-engine",
      "_blank"
    )
  }
>
  GitHub
</button>

          </div>

          <div className={styles.trust}>
            Open Source • Built for GTM Engineers
          </div>

        </div>

        {/* RIGHT */}

        <div className={styles.right}>
          <HeroDashboardPreview />
        </div>

      </div>

    </section>
  );
}