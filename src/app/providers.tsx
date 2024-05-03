"use client";

import React, { ReactNode } from "react";
import { ApolloWrapper } from "@/components/ApolloWrapper";
import { Footer } from "@/components/shared";
import { cssResolver, theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { usePathname } from "next/navigation";

// Dayjs imports
import dayjs from "dayjs";
import es from "dayjs/locale/es-mx";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es-mx";

// Configure dayjs
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.locale({
  ...es,
  weekStart: 1,
});

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
