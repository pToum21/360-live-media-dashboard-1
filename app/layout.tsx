import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "360 Live Media - Internal Marketing Dashboard",
  description: "Internal marketing analytics dashboard for the 360 Live Media team. Track website, email, and social media metrics in real-time.",
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
