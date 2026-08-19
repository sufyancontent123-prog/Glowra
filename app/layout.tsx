import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Glowora | Muhammad Sufyan Agentic AI RAG & Web Developer',
  description: 'Premium beauty and skincare e-commerce platform and developer portfolio by Muhammad Sufiyan - Agentic AI, RAG and Full-Stack Web Developer.',
  openGraph: {
    title: 'Glowora | Muhammad Sufyan Agentic AI & Web Developer',
    description: 'Premium beauty and skincare e-commerce platform and developer portfolio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glowora | Muhammad Sufyan Agentic AI & Web Developer',
    description: 'Premium beauty and skincare e-commerce platform and developer portfolio.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
