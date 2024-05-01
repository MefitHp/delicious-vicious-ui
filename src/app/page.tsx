"use client";
import { Suspense } from "react";
import { gql, useSuspenseQuery } from "@apollo/client";

export default function Page() {
  const { data } = useSuspenseQuery(GET_POSTS_QUERY, {});
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Suspense>
    </>
  );
}

const GET_POSTS_QUERY = gql`
  query Query {
    users {
      id
      name
      email
    }
  }
`;
