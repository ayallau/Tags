import './App.css';
import { ThemeToggle } from './components/ui/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tags Monorepo - Web App</h1>
          <ThemeToggle />
        </div>
        
        <p className="text-foreground-muted mb-8">
          זהו דמו של מבנה המונוריפו עם חבילות משותפות.
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">ברוכים הבאים ל-Tags!</h2>
          <p className="text-foreground-muted mb-4">המונוריפו מוגדר עם:</p>
          <ul className="space-y-2 text-foreground-muted">
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              pnpm workspaces
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Turborepo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              חבילות משותפות (@models, @api, @config)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              TypeScript ESM
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              תצורת ESLint
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              צינור CI/CD
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              מערכת עיצוב עם מצב כהה
            </li>
          </ul>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">כפתורים</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors">
                כפתור ראשי
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary-hover transition-colors">
                כפתור משני
              </button>
              <button className="w-full px-4 py-2 border border-border text-foreground rounded-md hover:bg-surface-hover transition-colors">
                כפתור עם גבול
              </button>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">צבעים סמנטיים</h3>
            <div className="space-y-3">
              <div className="px-3 py-2 bg-info text-info-foreground rounded-md text-sm">
                הודעת מידע
              </div>
              <div className="px-3 py-2 bg-success text-success-foreground rounded-md text-sm">
                הודעת הצלחה
              </div>
              <div className="px-3 py-2 bg-warning text-warning-foreground rounded-md text-sm">
                הודעת אזהרה
              </div>
              <div className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm">
                הודעת שגיאה
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
