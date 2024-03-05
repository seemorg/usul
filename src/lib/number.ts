const suffixes = ["th", "st", "nd", "rd"] as const;

export function getNumberWithOrdinal(n: number) {
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
