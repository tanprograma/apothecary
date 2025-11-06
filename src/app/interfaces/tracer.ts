export interface Tracer {
  product: string;
  store: string;
  quantity: number;
  available: number;
  created_on: string;
}
export interface TracerReport extends Tracer {
  received: number;
  issued: number;
  dispensed: number;
  purchased: number;
}
