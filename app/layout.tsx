import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BSBI Advisor Portal",
  description: "Internal portal for BSBI advisors and agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
