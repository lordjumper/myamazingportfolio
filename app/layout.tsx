import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mina Zaky",
  description: "Just a guy making cool stuff.",
  keywords: ["developer", "portfolio", "software engineer"],
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
