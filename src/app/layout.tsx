/* eslint-disable @next/next/no-page-custom-font */
import './globals.css';

import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

import Header from '@/components/Header/Header';
import { siteConfig } from '@/constants/config';

import StoreProvider from './StoreProvider';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },

  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    // creator: '@th_clarence',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Mulish:wght@200..1000&family=Poppins:wght@100..900&display=swap'
        />
      </head>
      <body className='font-mulish font-600'
      >
        <StoreProvider>
          <Toaster position='top-center' />
          <Header />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
