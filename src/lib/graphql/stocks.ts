import { gql } from "@apollo/client";

export const GET_STOCKS = gql`
  query getStocks {
    stocks {
      id
      valido_desde
      valido_hasta
      productos
      es_valido
    }
  }
`;

export const CREATE_STOCK = gql`
  mutation Mutation($data: StockCreateInput!) {
    createStock(data: $data) {
      actualizado_en
      es_valido
      productos
      valido_desde
      valido_hasta
    }
  }
`;

export const DELETE_STOCK = gql`
  mutation DeleteStock($where: StockWhereUniqueInput!) {
    deleteStock(where: $where) {
      id
    }
  }
`;

export const UPDATE_STOCK = gql`
  mutation updateStock(
    $where: StockWhereUniqueInput!
    $data: StockUpdateInput!
  ) {
    updateStock(where: $where, data: $data) {
      id
    }
  }
`;
