import './App.css';

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Tags Monorepo - Web App</h1>
      <p>This is a demo of the monorepo structure with shared packages.</p>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Welcome to Tags!</h2>
        <p>The monorepo is set up with:</p>
        <ul>
          <li>✅ pnpm workspaces</li>
          <li>✅ Turborepo</li>
          <li>✅ Shared packages (@models, @api, @config)</li>
          <li>✅ TypeScript ESM</li>
          <li>✅ ESLint configuration</li>
          <li>✅ CI/CD pipeline</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
