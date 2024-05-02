"use client";

import { ApolloWrapper } from "@/components/ApolloWrapper";
import { MantineProvider } from "@mantine/core";
import React, { ReactNode } from "react";

interface IProviders {
  children: ReactNode;
}

const Providers = ({ children }: IProviders) => {
  return (
    <ApolloWrapper>
      <MantineProvider>{children}</MantineProvider>
    </ApolloWrapper>
  );
};

export default Providers;
