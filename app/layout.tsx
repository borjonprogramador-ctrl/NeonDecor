import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BUSINESS_NAME, CONTACT, SITE_URL, SOCIAL_LINKS } from "./lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// La URL base del sitio vive en app/lib/site.ts (SITE_URL). Se puede
// sobreescribir con la variable de entorno NEXT_PUBLIC_SITE_URL.

const TITLE = "Neon Decor | Letreros y anuncios luminosos en Ensenada";
const DESCRIPTION =
  "Diseñamos, fabricamos e instalamos anuncios luminosos en Ensenada, B.C.: letras 3D, neón LED, cajas de luz y más. Diseño sin costo, entrega desde 4 días hábiles e instalación con garantía.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: BUSINESS_NAME,
    images: ["/open.jpg"],
    locale: "es_MX",
    type: "website",
  },
};

// Datos del negocio para Google (JSON-LD LocalBusiness).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS_NAME,
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/open.jpg`,
  telephone: CONTACT.tel,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: CONTACT.ciudad,
    addressRegion: "B.C.",
    addressCountry: "MX",
  },
  areaServed: CONTACT.cobertura,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: Object.values(SOCIAL_LINKS),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
