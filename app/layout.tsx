import type { Metadata, Viewport } from "next";
import { SITE } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Design, Printing & Branding in Nairobi`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Clone Hub is a Nairobi design, printing and branding studio. From business cards and brochures to billboards, event branding, signage, packaging and full installations — request a quote on WhatsApp.",
  keywords: [
    "printing Nairobi", "printing company Nairobi", "large format printing Nairobi",
    "billboard printing Nairobi", "event branding Nairobi", "corporate branding Nairobi",
    "signage Nairobi", "banner printing Nairobi", "business cards Nairobi",
    "packaging printing Nairobi", "vehicle branding Nairobi",
  ],
  authors: [{ name: SITE.contactPerson }],
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-180.png",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Design, Printing & Branding in Nairobi`,
    description:
      "Design, print, branding and installation for Nairobi businesses, events and brands. Request a quote in a couple of taps.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Clone Hub — Design, Printing and Branding" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Design, Printing & Branding`,
    description: "Nairobi printing, branding and installation. Quote on WhatsApp.",
    images: ["/og.jpg"],
  },
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1E2C86",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Local business structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: SITE.name,
              image: `${SITE.url}/hero.jpg`,
              "@id": SITE.url,
              url: SITE.url,
              telephone: SITE.phone,
              email: SITE.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Pembe Plaza, Enterprise Rd",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              areaServed: "Nairobi, Kenya",
              description:
                "Design, printing, branding and installation studio in Nairobi.",
            }),
          }}
        />
      </body>
    </html>
  );
}
