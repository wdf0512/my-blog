type Props = {
  number: number;
  className?: string;
  ariaHidden?: boolean;
};

/** Massive print-bleed Clash Display numeral, low opacity warm color.
 *  Sizing/positioning supplied via className from caller. */
export function IssueNumeral({ number, className = '', ariaHidden = true }: Props) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={`digest-numeral select-none pointer-events-none ${className}`}
    >
      {String(number).padStart(2, '0')}
    </span>
  );
}
