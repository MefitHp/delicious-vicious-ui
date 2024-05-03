import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query Query {
    users {
      id
      name
      email
    }
  }
`;

export const GET_BANNERS = gql`
  query getBanners($where: PortadaWhereInput!) {
    portadas(where: $where) {
      id
      nombre
      imagen {
        url
      }
    }
  }
`;

export const GET_CRAFT_YOUR_BOX_DATA = gql`
  query getCraftYourBoxData(
    $where: BoxWhereInput!
    $productosWhere: ProductoWhereInput!
    $stocksTake: Int
    $stocksWhere: StockWhereInput!
  ) {
    boxes(where: $where) {
      id
      nombre
      size
      imagen {
        url
      }
    }
    productos(where: $productosWhere) {
      id
      descripcion
      imagen {
        url
        id
      }
      nombre
      precio
      categoria {
        id
        nombre
      }
    }
    stocks(take: $stocksTake, where: $stocksWhere) {
      id
      valido_desde
      valido_hasta
      productos
      es_valido
    }
  }
`;

export type GetBannersReponse = {
  data: {
    portadas: {
      id: string;
      nombre: string;
      imagen: {
        url: string;
      };
    }[];
  };
};
