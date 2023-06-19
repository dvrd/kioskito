import { Exo } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs'

import { CartContextProvider } from "@/context/cart"

import { Menu } from '@/components/menu';

import '@/styles/globals.css';

export const metadata = {
  title: 'Kiosko',
  description: 'an online marketplace but more interactive',
};

const exo = Exo({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={exo.variable}>
        <ClerkProvider>
          <CartContextProvider>
            <div className="flex flex-col">
              <Menu />
              <div className="bg-background p-4 border-t">
                {children}
              </div>
            </div>
          </CartContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
