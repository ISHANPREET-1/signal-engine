import React from "react";
import styles from "./SignalRow.module.css";

export default function SignalRow({
  initial,
  company,
  detail,
  badges = [],
}) {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div className={styles.avatar}>
          {initial}
        </div>

        <div className={styles.info}>
          <h4 className={styles.company}>
            {company}
          </h4>

          <p className={styles.detail}>
            {detail}
          </p>
        </div>
      </div>

      <div className={styles.right}>
        {badges.map((badge) => (
          <span
            key={badge.label}
            className={`${styles.badge} ${styles[`badge--${badge.type}`]}`}
          >
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}