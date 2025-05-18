import './../styles/globals.css' // Import global styles
import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google' // Import Google Fonts
import { ImageModalProvider } from '@/context/ImageModalContext'
import ImageModal from '@/components/ImageModal'
import Navbar from '@/components/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Define as CSS variable
})

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Specify weights
  variable: '--font-crimson-text', // Define as CSS variable
})

export const metadata: Metadata = {
  title: 'Scroll Narrative',
  description: "A demo website showcasing scroll-based animations and effects.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <body>
        <ImageModalProvider> {/* Wrap content with modal provider */}
             <Navbar />
            {children}
            <ImageModal /> {/* Render modal at the root level */}
        </ImageModalProvider>
      </body>
    </html>
  )
}
