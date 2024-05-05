export type ProductJsonType = Record<string, number>;

export type StockType = {
  id: string;
  __typename?: string;
  valido_desde: Date | null;
  valido_hasta: Date | null;
  es_valido: boolean;
  productos: ProductJsonType;
  actualizado_en: Date;
};
