"use client";

import { ApolloWrapper } from "@/components/ApolloWrapper";
import { cssResolver, theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import React, { ReactNode } from "react";

interface IProviders {
  children: ReactNode;
}

const Providers = ({ children }: IProviders) => {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssResolver}>
      <DatesProvider settings={{ locale: "es-mx" }}>
        <Notifications position="top-right" />
        <ApolloWrapper>{children}</ApolloWrapper>
      </DatesProvider>
    </MantineProvider>
  );
};

export default Providers;
