import { getApiBaseUrl } from './lib/config';

const tracks = [
  'React 19 + Vite 7 setup',
  'MSTest unit and integration tests',
  'Pinned package versions for reproducible installs',
];

function App() {
  return (
    <main className="layout">
      <section className="hero">
        <p className="eyebrow">KazInvest starter</p>
        <h1>React frontend and .NET 10 API scaffold</h1>
        <p className="summary">
          The repo is wired for a Vite-based frontend, an ASP.NET Core backend,
          and separate unit and integration test projects.
        </p>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Frontend</h2>
          <p>TypeScript, ESLint, Prettier, Vitest, and Playwright are configured.</p>
        </article>

        <article className="card">
          <h2>Backend</h2>
          <p>Minimal API with OpenAPI, health endpoint, and MSTest projects.</p>
        </article>

        <article className="card accent">
          <h2>API endpoint</h2>
          <code>{getApiBaseUrl()}</code>
        </article>
      </section>

      <section className="checklist">
        <h2>Next steps</h2>
        <ul>
          {tracks.map((track) => (
            <li key={track}>{track}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;

