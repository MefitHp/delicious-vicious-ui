import type { Metadata } from "next";
import { Box, ColorSchemeScript } from "@mantine/core";
import Providers from "./providers";
import Script from "next/script";

// Dayjs imports
import dayjs from "dayjs";
import es from "dayjs/locale/es-mx";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es-mx";

// Import Mantine styles
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { Nav } from "@/components/shared";

// Configure dayjs
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.locale({
  ...es,
  weekStart: 1,
});

export const metadata: Metadata = {
  title: "Delicious Vicious",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          <Nav />
          <Box mih="calc(100vh - 60px - 100px)">{children}</Box>
        </Providers>
        <Script
          async
          defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCzguDBJ_EoMp8X9FiKUoehWDEdEOfDrc4&libraries=places&callback=initMap"
        />
      </body>
    </html>
  );
}
