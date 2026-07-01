import React from "react";
import styles from "./AIGenerationCard.module.css";

export default function AIGenerationCard({
  contactName,
  companyName,
  message,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.left}>
          <span className={styles.sparkle}>✨</span>
          <span className={styles.title}>AI Outreach Draft</span>
        </div>

        <span className={styles.status}>Draft</span>
      </div>

      <div className={styles.body}>
        <p className={styles.greeting}>
          Hey {contactName},
        </p>

        <p className={styles.message}>
          I noticed{" "}
          <strong>{companyName}</strong>{" "}
          {message}
        </p>
      </div>

      <div className={styles.footer}>
        <button className={styles.copyButton}>
          Copy Draft
        </button>
      </div>
    </div>
  );
}