# KazInvest

## Structure

- `frontend` - React app with Vite, TypeScript, ESLint, Prettier, Vitest, and Playwright
- `backend` - ASP.NET Core API with MSTest unit and integration tests

## Required local toolchain

- Node.js `24.14.0`
- npm compatible with Node `24.14.0`
- .NET SDK `10.0.200`

## First run

### Frontend

```powershell
cd frontend
npm install --save-exact
npm exec playwright install chromium
npm run dev
```

### Backend

```powershell
cd backend
dotnet restore .\kaz-invest.slnx --use-lock-file
dotnet test .\kaz-invest.slnx
$env:OpenRouter__ApiKey = "your-openrouter-api-key"
dotnet run --project .\src\KazInvest.Api\KazInvest.Api.csproj
```

`dotnet run` uses the local launch profile, starts in `Development`, and exposes Swagger UI at `http://localhost:5000/swagger`.
