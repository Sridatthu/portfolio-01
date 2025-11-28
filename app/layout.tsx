
import Navbar from "@/components/common/NavBar";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProviders";
import ReactLenis from "lenis/react";
import { ViewTransitions } from 'next-view-transitions';
import OnekoCat from "@/components/common/OnekoCat";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ViewTransitions>
    <html lang="en" suppressHydrationWarning>
      <body
       className={`font-hanken-grotesk antialiased`}
      >
      
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <ReactLenis root>
              <Navbar />
              {children}
               <OnekoCat/>
             </ReactLenis>
          </ThemeProvider>
        
       
      </body>
    </html>
    </ViewTransitions>
  );
}
