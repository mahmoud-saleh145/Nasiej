import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navb from "../components/custom/navbar/Navb";
import Footer from './../components/custom/footer/Footer';
import QueryProvider from "@/components/provider/QueryProvider";
import ToasterProvider from "@/components/provider/ToasterProvider";
import AuthProvider from './../components/provider/AuthProvider';
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nasieچ",
  description: "Nasieچ is an online store offering top-quality products with fast shipping and a seamless shopping experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GS24X8XWHG"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GS24X8XWHG');
          `}
        </Script>
      </head>
      <body className={`bg-background ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <div className="bg-background-dark nav-style min-h-[84px]">
              <Navb />
            </div>
            <main className="min-h-screen ">
              {children}
            </main>
            <Footer />
            <ToasterProvider />
          </AuthProvider>
        </QueryProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
