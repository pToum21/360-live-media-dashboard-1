import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "360 Live Media - Marketing Dashboard",
  description: "Transform scattered data into actionable insights. Real-time analytics, automated reporting, and intelligent recommendations.",
  icons: {
    icon: '/Logos/Info=Basic, Color=Green-cropped.png',
    apple: '/Logos/Info=Basic, Color=Green-cropped.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
