import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Glowora & Saqib Visuals | Premium Beauty & Skincare',
  description: 'Premium beauty and skincare e-commerce platform and portfolio featuring interactive product showcases and clinic-grade essentials.',
  openGraph: {
    title: 'Glowora & Saqib Visuals',
    description: 'Premium beauty and skincare e-commerce platform and portfolio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glowora & Saqib Visuals',
    description: 'Premium beauty and skincare e-commerce platform and portfolio.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
