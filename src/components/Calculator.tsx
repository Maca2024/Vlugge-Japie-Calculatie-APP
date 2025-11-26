import React, { useMemo } from 'react';
import { LineItem, lineTotal, subtotal } from '../utils/calc';

type Props = {
  items: LineItem[];
  onChange?: (items: LineItem[]) => void;
};

export default function Calculator({ items, onChange: _onChange }: Props) {
  const total = useMemo(() => subtotal(items), [items]);

  return (
    <div className="calculator">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Discount %</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice.toFixed(2)}</td>
              <td>{item.discountPercent ?? 0}</td>
              <td>{lineTotal(item).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total">
        <strong>Subtotal: {total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
