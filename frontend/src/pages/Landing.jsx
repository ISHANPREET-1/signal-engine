import Navbar from "../components/navigation/Navbar";
import Hero from "../components/sections/Hero";
import HowItWorks from "../components/sections/HowItWorks";
import LiveDemo from "../components/sections/LiveDemo";
import Stats from "../components/sections/Stats";
import Footer from "../components/sections/Footer";

import SignalEngineBackground from "../components/background/SignalEngineBackground";
import Reveal from "../components/animations/Reveal";

export default function Landing() {
  return (
    <main
      style={{
        position: "relative",
        background: "#090909",
        minHeight: "100vh",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <SignalEngineBackground />

      <Navbar />

      <Reveal>
        <Hero />
      </Reveal>

      <Reveal delay={0.05}>
        <HowItWorks />
      </Reveal>

      <Reveal delay={0.08}>
        <LiveDemo />
      </Reveal>

      <Reveal delay={0.1}>
        <Stats />
      </Reveal>

      <Reveal delay={0.12}>
        <Footer />
      </Reveal>
    </main>
  );
}