import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Simple Blog",
  description: "App Post"
};

export default function RootLayout({children}){
  return(
    <html>
      <body>
        <AuthProvider>
          <Navbar />
            <main className="container mx-auto p-4 max-w-4xl">
                {children}
            </main>
        </AuthProvider>
      </body>
    </html>
  )
}