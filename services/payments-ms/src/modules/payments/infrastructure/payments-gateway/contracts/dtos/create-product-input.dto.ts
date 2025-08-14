export type ICreateProductInputDTO = {
  name: string;
  description: string;
  price: number;
  currency: string;
  metadata?: Record<string, string | number>;
};
