import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Tags</h1>
          </div>

          {/* Right side - Theme Toggle and User Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* User Menu Placeholder */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <span className="text-muted-foreground text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
