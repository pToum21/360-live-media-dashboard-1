import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme-provider";

// Neue Haas Grotesk Display Pro font
const neueHaas = localFont({
  src: [
    {
      path: "../public/fonts/NeueHaasDisplayPro-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasDisplayPro-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasDisplayPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasDisplayPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasDisplayPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasDisplayPro-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-neue-haas",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

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
    <html lang="en" suppressHydrationWarning className={neueHaas.variable}>
      <body className={neueHaas.className}>
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
