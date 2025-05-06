import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed font to Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster for notifications
import { Providers } from './providers'; // Added Providers for client-side context

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Review Insights', // Updated title
  description: 'AI-Powered Feedback Analyzer', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Default to dark theme */}
      <body className={`${inter.variable} font-sans antialiased`}> {/* Use Inter font and Tailwind's font-sans */}
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
