import type { Metadata } from "next";
import "./globals.css";
import { WDXL_Lubrifont_TC } from "next/font/google";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { tenantConfig } from "@/config/tenant";

const lubrifont = WDXL_Lubrifont_TC({
  variable: "--font-lubrifont",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${tenantConfig.name} - ${tenantConfig.slogan}`,
  description: "Encontre os melhores veículos seminovos e usados com garantia e procedência garantida.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: `${tenantConfig.name} | Veículos Premium`,
    description: "Encontre os melhores veículos seminovos e usados com garantia e procedência.",
    siteName: tenantConfig.name,
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${lubrifont.variable} antialiased bg-background text-white min-h-screen flex flex-col font-sans`}
      >
        <div className="flex flex-col flex-1">
          {children}
        </div>
        <Footer />
        {/* Botão WhatsApp flutuante - global em todas as páginas */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
