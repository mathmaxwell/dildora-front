/**
 * Normalise a numeric field value: drop non-numeric input, clamp into
 * [min, max], and round to an integer unless decimals are explicitly allowed
 * (`allowDecimal`). Returns '' for empty/garbage so the field can stay blank.
 * This is what stops e.g. "age = 999" or "births = 2.5" from sticking.
 */
export function normalizeNumber(
  raw: string,
  opts: { min?: number; max?: number; allowDecimal?: boolean },
): string {
  if (raw.trim() === '') return ''
  let n = parseFloat(raw)
  if (Number.isNaN(n)) return ''
  if (!opts.allowDecimal) n = Math.round(n)
  if (opts.min != null && n < opts.min) n = opts.min
  if (opts.max != null && n > opts.max) n = opts.max
  return String(n)
}
