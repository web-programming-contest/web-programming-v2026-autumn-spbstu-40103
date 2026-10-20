export function StarIcon({className}) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path fill="#ffec41" d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8z" />
    </svg>
  )
}

export function CloseIcon({size = 20, color = 'currentColor', className}) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 3l14 14M17 3L3 17" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function CrossIcon({size = 12, color = 'currentColor'}) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function ChevronIcon({dir = 'right', width = 14, height = 24}) {
  const rotate = dir === 'left' ? 'scale(-1,1) translate(-14,0)' : undefined
  return (
    <svg width={width} height={height} viewBox="0 0 14 24" aria-hidden="true">
      <path
        transform={rotate}
        d="M3 3l9 9-9 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}
