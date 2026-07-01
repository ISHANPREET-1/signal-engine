export default function SignalEngineLogo({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="signalGradient" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#D43B5C" />
          <stop offset="100%" stopColor="#7A1124" />
        </linearGradient>
      </defs>

      <path
        d="
          M18 14
          L34 14
          L46 22
          L34 30
          L18 30
          L30 22
          Z

          M46 34
          L30 34
          L18 42
          L30 50
          L46 50
          L34 42
          Z
        "
        fill="url(#signalGradient)"
      />
    </svg>
  );
}