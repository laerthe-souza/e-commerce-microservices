export type IUpdateProductInputDTO = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  metadata?: Record<string, string | number>;
};
