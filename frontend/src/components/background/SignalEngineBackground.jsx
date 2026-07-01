import React from "react";
import PixelBlast from "../reactbits/PixelBlast";

const containerStyle = {
  position: "fixed",
  inset: 0,
  overflow: "hidden",
  zIndex: 0,
  pointerEvents: "none",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background: `
    radial-gradient(
      circle at center,
      rgba(9,9,9,0.08) 0%,
      rgba(9,9,9,0.05) 40%,
      rgba(9,9,9,0.15) 72%,
      rgba(9,9,9,0.26) 100%
    )
  `,
  pointerEvents: "none",
  zIndex: 1,
};
export default function SignalEngineBackground() {
  return (
    <div style={containerStyle}>
      <PixelBlast
  variant="square"
  color="#9E1D37"
  pixelSize={4}
  patternScale={1.9}
  patternDensity={1.35}
  liquid={false}
  pixelSizeJitter={0.15}
  enableRipples={true}
  rippleSpeed={0.5}
  rippleThickness={0.1}
  rippleIntensityScale={1}
  speed={0.6}
  edgeFade={0.45}
  transparent={true}
  noiseAmount={0}
/>

      <div style={overlayStyle} />
    </div>
  );
}