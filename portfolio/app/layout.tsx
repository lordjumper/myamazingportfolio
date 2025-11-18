import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Developer Portfolio | Modern & Professional",
  description:
    "A modern, sleek developer portfolio showcasing projects, skills, and experience.",
  keywords: ["developer", "portfolio", "web development", "software engineer"],
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
