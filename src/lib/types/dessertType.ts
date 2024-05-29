export type DessertType = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  es_visible: boolean;
  imagen: { url: string };
  imagenPlaceholder?: string;
  categoria: {
    id: number;
    nombre: string;
  };
};
