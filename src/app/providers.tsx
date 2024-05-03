"use client";

import { ApolloWrapper } from "@/components/ApolloWrapper";
import { Footer } from "@/components/shared";
import { cssResolver, theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

interface IProviders {
  children: ReactNode;
}

const Providers = ({ children }: IProviders) => {
  const path = usePathname();

  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssResolver}>
      <DatesProvider settings={{ locale: "es-mx" }}>
        <Notifications position="top-right" />
        <ApolloWrapper>{children}</ApolloWrapper>
        {path !== "/arma-tu-box" && <Footer />}
      </DatesProvider>
    </MantineProvider>
  );
};

export default Providers;
