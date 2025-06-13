export interface Product {
  _id: string;
  name: string;
  category: string;
  units: { name: string; value: number }[];
}
