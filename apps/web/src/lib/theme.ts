export type Theme = 'system' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme-preference';

/**
 * Get the current theme preference from localStorage
 */
export function getThemePreference(): Theme {
  if (typeof window === 'undefined') return 'system';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  return stored && ['system', 'light', 'dark'].includes(stored) ? stored : 'system';
}

/**
 * Save theme preference to localStorage
 */
export function setThemePreference(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Get the effective theme (resolves 'system' to actual theme)
 */
export function getEffectiveTheme(): 'light' | 'dark' {
  const preference = getThemePreference();
  
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  return preference;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  const effectiveTheme = theme === 'system' ? getEffectiveTheme() : theme;
  
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Initialize theme system
 * Should be called before React renders to prevent flash
 */
export function initializeTheme(): void {
  const preference = getThemePreference();
  applyTheme(preference);
  
  // Listen for system theme changes when preference is 'system'
  if (preference === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (getThemePreference() === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup function (though in practice this runs once)
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
}

/**
 * Set theme and persist preference
 */
export function setTheme(theme: Theme): void {
  setThemePreference(theme);
  applyTheme(theme);
}
