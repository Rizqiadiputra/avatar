import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-zinc-900 flex flex-col min-h-screen text-white justify-center items-center">
        {children}
      </body>
    </html>
  );
}
