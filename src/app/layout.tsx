import type { Metadata } from "next";
import { Box, ColorSchemeScript } from "@mantine/core";
import Providers from "./providers";
import "@mantine/core/styles.css";

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
          <Box mih="calc(100vh - 60px - 100px)">{children}</Box>
        </Providers>
      </body>
    </html>
  );
}
