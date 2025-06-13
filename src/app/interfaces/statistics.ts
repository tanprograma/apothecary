export class Statistics {
  [product: string]: {
    product: string;
    unit: string;
    unit_value: number;
    category: string;
    date?: string;
    amount?: number;
    destination?: string;
    source?: string;
    quantity: number;
  };
}
