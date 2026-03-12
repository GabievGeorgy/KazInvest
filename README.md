# KazInvest

Monorepo scaffold for a React 19 + Vite 7 frontend and a .NET 10 backend.

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
dotnet run --project .\src\KazInvest.Api\KazInvest.Api.csproj
```

`dotnet run` uses the local launch profile, starts in `Development`, and exposes Swagger UI at `http://localhost:5000/swagger`.

## Notes

- The backend is pinned to `.NET SDK 10.0.200` in `backend/global.json`.
- If the required SDK is not installed, `dotnet restore`, `build`, and `test` will fail until it is added locally.
- Playwright browser binaries are not committed; install them after `npm install`.
