import type { Metadata, Viewport } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "İngilizce Öğren",
  description: "Aralıklı tekrar ile İngilizce kelime ve gramer çalış.",
  applicationName: "İngilizce Öğren",
  appleWebApp: { capable: true, title: "İngilizce", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // use the full screen on phones with a notch
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6ff" },
    { media: "(prefers-color-scheme: dark)", color: "#12112b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}
        <PwaRegister />
      </body>
    </html>
  );
}
