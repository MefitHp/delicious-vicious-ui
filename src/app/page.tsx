import getClient from "@/lib/apolloClient";
import { gql } from "@apollo/client";

const GET_POSTS_QUERY = gql`
  query Query {
    users {
      id
      name
      email
    }
  }
`;

export async function HomePage() {
  const data = await getData();
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export const getData = async () => {
  const { data } = await getClient().query({ query: GET_POSTS_QUERY });
  return {
    props: {
      data,
    },
  };
};

export default HomePage;
