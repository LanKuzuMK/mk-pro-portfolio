/**
 * Crimson Reliquary brand reminder: the repeatable MK mark is a blade-derived graphic, not text styling.
 */
export default function BladeMark({ className = "" }: { className?: string }) {
  return <svg className={`blade-mark ${className}`.trim()} viewBox="0 0 32 32" aria-hidden="true"><path d="M7 4v24M14 4v24M20 6l6 20" /><path className="blade-mark-cut" d="M4 24 26 7" /><path className="blade-mark-point" d="m25 4 3 4-3 4" /></svg>;
}
