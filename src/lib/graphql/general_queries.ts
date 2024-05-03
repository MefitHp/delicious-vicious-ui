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
