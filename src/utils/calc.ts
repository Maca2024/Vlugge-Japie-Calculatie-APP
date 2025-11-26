export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
};

export function roundToCents(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function lineTotal(item: LineItem): number {
  const gross = item.quantity * item.unitPrice;
  const discount = item.discountPercent ? (gross * item.discountPercent) / 100 : 0;
  return roundToCents(gross - discount);
}

export function subtotal(items: LineItem[]): number {
  return roundToCents(items.reduce((s, it) => s + lineTotal(it), 0));
}
