import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// -------------------------------------------------------------------------
// URL BASE DEL SITIO (dominio definitivo)
// -------------------------------------------------------------------------
// Todavía no existe el dominio, así que NO se inventa aquí. En vez de
// hardcodearlo, se lee de una variable de entorno opcional. Mientras esa
// variable no exista, Next.js simplemente usa rutas relativas (el sitio
// funciona igual; solo faltan URLs absolutas en algunas meta tags).
//
// Cuando compres el dominio, solo agrega esto (local: .env.local; en
// Vercel: Project Settings → Environment Variables) y se propaga solo,
// sin tocar este archivo:
//   NEXT_PUBLIC_SITE_URL=https://tudominio.com
// -------------------------------------------------------------------------
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

const TITLE = "Neon Decor | Anuncios luminosos para tu negocio";
const DESCRIPTION =
  "Diseñamos, fabricamos e instalamos anuncios luminosos: letras 3D, neón LED, cajas de luz y más. Diseño profesional gratuito, entrega express e instalación con garantía.";

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: ["/open.jpg"],
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}