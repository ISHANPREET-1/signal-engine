import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Navbar.module.css";
import SignalEngineLogo from "../logo/SignalEngineLogo";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navRef = useRef(null);
const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMove = (e) => {
    if (!navRef.current) return;

    const rect = navRef.current.getBoundingClientRect();

    navRef.current.style.setProperty(
      "--mx",
      `${e.clientX - rect.left}px`
    );

    navRef.current.style.setProperty(
      "--my",
      `${e.clientY - rect.top}px`
    );
  };

  const handleLeave = () => {
    if (!navRef.current) return;

    navRef.current.style.setProperty("--mx", "50%");
    navRef.current.style.setProperty("--my", "50%");
  };

  return createPortal(
    <header className={styles.wrapper}>
      <nav
        ref={navRef}
        className={`${styles.navbar} ${
          scrolled ? styles.scrolled : ""
        }`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className={styles.glassHighlight}></div>

        <a
          href="/"
          className={styles.brand}
          aria-label="Signal Engine"
        >
          <SignalEngineLogo size={48} />

          <span className={styles.brandText}>
            Signal Engine
          </span>
        </a>

        <div className={styles.links}>
          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#live-demo">
            Live Demo
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>

      <button
  className={styles.cta}
  onClick={() => navigate("/setup")}
>
  Try It Free
</button>
      </nav>
    </header>,
    document.body
  );
}