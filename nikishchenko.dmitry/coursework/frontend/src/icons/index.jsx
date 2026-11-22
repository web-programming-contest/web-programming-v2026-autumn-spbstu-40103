// Иконки из архива макета; цвет задаётся через CSS (currentColor)

export function CatalogIcon({size = 16, ...props}) {
  return (
    <svg
      width={size * 1.0}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <rect width="7" height="7" rx="2" fill="currentColor" />
      <rect y="9" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="9" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="9" y="9" width="7" height="7" rx="2" fill="currentColor" />
    </svg>
  );
}

export function CartIcon({size = 16, ...props}) {
  return (
    <svg
      width={size * 1.0}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 16C7.10457 16 8 15.1046 8 14C8 12.8954 7.10457 12 6 12C4.89543 12 4 12.8954 4 14C4 15.1046 4.89543 16 6 16Z"
        fill="currentColor"
      />
      <path
        d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z"
        fill="currentColor"
      />
      <path
        d="M15.68 3.55714C15.36 3.16429 14.88 2.92857 14.4 2.92857H5.28L4.8 1.25714C4.64 0.55 4 0 3.2 0H1.6C0.72 0 0 0.707143 0 1.57143C0 2.43571 0.72 3.14286 1.6 3.14286H1.84L3.2 9.74286C3.36 10.5286 4 11 4.8 11H12.8C13.52 11 14.08 10.5286 14.32 9.9L15.92 4.97143C16.08 4.5 16 4.02857 15.68 3.55714Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UserIcon({size = 16, ...props}) {
  return (
    <svg
      width={size * 1.0}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z"
        fill="currentColor"
      />
      <path
        d="M16 14V15C16 15.2652 15.8946 15.5196 15.7071 15.7071C15.5196 15.8946 15.2652 16 15 16H1C0.734784 16 0.48043 15.8946 0.292893 15.7071C0.105357 15.5196 0 15.2652 0 15V14C0 12.4087 0.632141 10.8826 1.75736 9.75736C2.88258 8.63214 4.4087 8 6 8H10C11.5913 8 13.1174 8.63214 14.2426 9.75736C15.3679 10.8826 16 12.4087 16 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PhoneIcon({size = 32, ...props}) {
  return (
    <svg
      width={size * 0.6875}
      height={size}
      viewBox="0 0 22 32"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M21.6667 5.33333C21.6667 2.4 19.2667 0 16.3333 0H5.66667C2.73334 0 0.333336 2.4 0.333336 5.33333V26.6667C0.333336 29.6 2.73334 32 5.66667 32H16.3333C19.2667 32 21.6667 29.6 21.6667 26.6667V5.33333ZM12.3333 29.3333H9.66667C8.86667 29.3333 8.33334 28.8 8.33334 28C8.33334 27.2 8.86667 26.6667 9.66667 26.6667H12.3333C13.1333 26.6667 13.6667 27.2 13.6667 28C13.6667 28.8 13.1333 29.3333 12.3333 29.3333ZM19 22.6667C19 23.4667 18.4667 24 17.6667 24H4.33334C3.53334 24 3 23.4667 3 22.6667V6.66667C3 5.86667 3.53334 5.33333 4.33334 5.33333H17.6667C18.4667 5.33333 19 5.86667 19 6.66667V22.6667Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CloseIcon({size = 20, strokeWidth = 3, ...props}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 4l12 12M16 4L4 16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

// direction: 'left' | 'right'
export function ChevronIcon({direction = 'right', ...props}) {
  return (
    <svg
      width="12"
      height="22"
      viewBox="0 0 12 22"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d={
          direction === 'left'
            ? 'M10.5 1.5L1.5 11l9 9.5'
            : 'M1.5 1.5l9 9.5-9 9.5'
        }
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon({size = 30, ...props}) {
  return (
    <svg
      width={size * (40 / 30)}
      height={size}
      viewBox="0 0 40 30"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <rect width="40" height="30" rx="5" fill="currentColor" />
      <path
        d="M4 8.5l16 11 16-11"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinIcon({size = 34, ...props}) {
  return (
    <svg
      width={size * (26 / 34)}
      height={size}
      viewBox="0 0 26 34"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 0C5.8 0 0 5.8 0 13c0 9.5 13 21 13 21s13-11.5 13-21C26 5.8 20.2 0 13 0zm0 18.2a5.2 5.2 0 1 1 0-10.4 5.2 5.2 0 0 1 0 10.4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MinusIcon(props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2 7h10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2 7h10M7 2v10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M1.5 4.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({size = 12, ...props}) {
  return (
    <svg
      width={size}
      height={size * (7 / 12)}
      viewBox="0 0 12 7"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M1 1l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
