import styles from './LinkButton.module.css';

// variant: 'pink' | 'blue'; medium — насыщенность 500 вместо 400
export default function LinkButton({
  variant = 'pink',
  medium = false,
  icon,
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`${styles.link} ${styles[variant]} ${medium ? styles.medium : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
