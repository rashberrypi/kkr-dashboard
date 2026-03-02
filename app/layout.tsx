import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jerry - the portfolio scrapper",
  description: "Made for berry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
