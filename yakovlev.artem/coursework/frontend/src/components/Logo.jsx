export default function Logo({footer = false}) {
  return (
    <svg
      className={`logo-img${footer ? ' logo-img-footer' : ''}`}
      viewBox="0 0 150 28"
      width="150"
      height="28"
      role="img"
      aria-label="Gadget Hub"
    >
      <text
        x="0"
        y="21"
        fontFamily="Rubik, Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
      >
        <tspan fill={footer ? '#ffffff' : '#0C368A'}>Gadget&#160;</tspan>
        <tspan fill={footer ? '#ffffff' : '#115EFB'}>Hub</tspan>
      </text>
    </svg>
  );
}
