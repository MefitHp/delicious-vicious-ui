import type { Metadata } from "next";
import { ApolloWrapper } from "./ApolloWrapper";

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
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
