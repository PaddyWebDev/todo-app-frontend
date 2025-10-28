import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "react-hot-toast";
import AuthContext from "@/provider/auth-context";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/tanstack-query";
import { SidebarProvider } from "@/components/ui/sidebar";

const archivo = Archivo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notezzy",
  description: "Notezzy is a note taking application built with Next.js 14 and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthContext>
        <body className={archivo.className}>
          <SidebarProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              // disableTransitionOnChange
              >
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                />
                {children}
              </ThemeProvider>
            </QueryClientProvider>
          </SidebarProvider>
        </body>
      </AuthContext>
    </html>
  );
}
