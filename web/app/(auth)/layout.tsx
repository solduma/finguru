import "../globals.css";

// The login page lives outside the [locale] tree, so it carries its own
// <html>/<body> shell (the locale layout owns those for the rest of the site).
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
