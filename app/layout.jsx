import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Image Management System",
  description: "Manage images, categories, and annotations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
