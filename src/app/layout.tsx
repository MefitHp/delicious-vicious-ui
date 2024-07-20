import type { Metadata } from "next";
import { Box, ColorSchemeScript } from "@mantine/core";
import NextTopLoader from "nextjs-toploader";
import Providers from "./providers";
import Script from "next/script";
import { Nav } from "@/components/shared";

// Import Mantine styles
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/image/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/image/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/image/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <NextTopLoader color="#37614c" />
        <Providers>
          <Nav />
          <Box mih="calc(100vh - 60px - 100px)">{children}</Box>
        </Providers>
        <Script
          async
          defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCzguDBJ_EoMp8X9FiKUoehWDEdEOfDrc4&loading=async&libraries=places&callback=initMap"
        />
      </body>
    </html>
  );
}
