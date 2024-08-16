export type BoxType = {
  id: string;
  size: number;
  nombre: string;
  imagen: {
    url: string;
  };
  categoria?: {
    id: string;
    nombre: string;
    se_vende_por_caja: boolean;
  };
  descripcion?: string;
};
