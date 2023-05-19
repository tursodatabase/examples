import Navbar from './Navbar'
import FooterComponent from './Footer'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Top Web Frameworks',
  description: 'A Next.js and Turso starter template',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        <main className="min-h-screen flex flex-col items-center p-24 mt-10">
          {children}
        </main>
        <FooterComponent />
      </body>
    </html>
  )
}
