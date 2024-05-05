import { gql } from "@apollo/client";
import { DessertType } from "../types";

export const GET_DESSERTS = gql`
  query getDesserts($where: ProductoWhereInput!) {
    productos(where: $where) {
      id
      nombre
      categoria {
        id
        nombre
      }
      descripcion
      precio
      imagen {
        url
      }
    }
  }
`;

export type GetDessertsResponse = {
  data: {
    productos: DessertType[];
  };
};
