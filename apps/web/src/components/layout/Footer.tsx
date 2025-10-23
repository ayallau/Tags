export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>© {currentYear} Tags</span>
          <span className="mx-2">•</span>
          <span>Connect through shared interests</span>
        </div>
      </div>
    </footer>
  );
}
