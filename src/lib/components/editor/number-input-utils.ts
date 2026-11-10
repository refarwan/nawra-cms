export function sanitizeNumber(val: string, allowNegative = false): number {
  const clean = allowNegative ? val.replace(/(?!^-)[^0-9]/g, "") : val.replace(/\D/g, "");
  if (clean === "" || clean === "-") return 0;
  return +clean;
}

export interface NumberKeydownOptions {
  min?: number;
  max?: number;
  allowNegative?: boolean;
}

export function handleNumberKeydown(
  e: KeyboardEvent,
  currentVal: number,
  onUpdate: (newVal: number) => void,
  options?: NumberKeydownOptions
): void {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    const step = e.shiftKey ? 10 : 1;
    let next = e.key === "ArrowUp" ? currentVal + step : currentVal - step;

    if (options?.min !== undefined) next = Math.max(options.min, next);
    if (options?.max !== undefined) next = Math.min(options.max, next);
    if (!options?.allowNegative && options?.min === undefined) next = Math.max(0, next);

    onUpdate(next);
  }
}
