import { gql } from "@apollo/client";
import { BannerType } from "../types";

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
      es_version_movil
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
      categoria {
        id
        nombre
      }
      descripcion
    }
    productos(where: $productosWhere) {
      id
      descripcion
      imagen {
        url
        id
      }
      imagenPlaceholder
      nombre
      precio
      categoria {
        id
        nombre
        se_vende_por_caja
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

export const GET_EDIT_STOCK_DATA = gql`
  query getEditStockData(
    $stockWhere: StockWhereUniqueInput!
    $productosWhere: ProductoWhereInput!
  ) {
    stock(where: $stockWhere) {
      id
      productos
      valido_desde
      es_valido
      valido_hasta
    }
    productos(where: $productosWhere) {
      id
      nombre
      categoria {
        id
        nombre
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrderCreateInput!) {
    createOrder(data: $data) {
      id
    }
  }
`;

export type GetBannersReponse = {
  data: {
    portadas: BannerType[];
  };
};
