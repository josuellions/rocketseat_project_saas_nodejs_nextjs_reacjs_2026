'use client'

import  type { ReactNode} from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";

export  function Providers({children} : { children: ReactNode}) {
  return (
     <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" 
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>
  )
}