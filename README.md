
# Traffic App

This project is a Vite single-page app.

## Local development

Run `npm install` to install dependencies.

Run `npm run dev` to start the development server.

Run `npm run build` to create a production build in `dist/`.

Copy [`.env.example`](./.env.example) to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PUBLIC_APP_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The `SUPABASE_SERVICE_ROLE_KEY` is only used by the Netlify serverless functions in [`netlify/functions`](./netlify/functions). Do not expose it as a `VITE_` variable.

## Netlify deployment

The repo is configured for Netlify with [`netlify.toml`](./netlify.toml):

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- SPA fallback: all routes redirect to `/index.html`

To make every push deploy automatically on Netlify:

1. Connect this Git repository to a Netlify site.
2. Set the production branch to `main`.
3. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PUBLIC_APP_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in the Netlify site settings.

## Supabase bootstrap

The checked-in schema bootstrap lives in [`supabase/migrations/20260411_0001_public_schema.sql`](./supabase/migrations/20260411_0001_public_schema.sql). It recreates the tables the app expects, the admin helper/policies, the chat timestamp trigger, and the public `silhouette` storage bucket for clean deployments into a new Supabase project.

Once the repo is connected, Netlify will rebuild and deploy on each push to the tracked branch using the settings from `netlify.toml`.
