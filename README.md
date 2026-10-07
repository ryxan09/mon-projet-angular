# TaskBoard

TaskBoard is an Angular task manager with a standalone Express API and Supabase Postgres persistence.

Use Node.js 22.12 or newer with npm.

## Supabase setup

1. Create a Supabase account at [supabase.com](https://supabase.com), then create a project and wait for its database to finish provisioning.
2. In the Supabase project, open **SQL Editor**, create a query, paste the contents of [`backend/supabase/schema.sql`](backend/supabase/schema.sql), and run it. This creates the `public.tasks` table.
3. Open **Project Settings → API Keys**. Copy the project URL and a server-side secret/`service_role` key (not the publishable/`anon` key). Never put this key in Angular, commit it, or share it in chat. If a key has been exposed, revoke it and use a replacement only in your local backend environment.
4. In `backend/`, copy `.env.example` to `.env` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Keep the replacement secret in this ignored file.

The API uses the service-role key and does not require client-side Supabase configuration. Row-level security is enabled on the table; the key bypasses those policies on the server. The API currently has no authentication, so anyone who can reach it can create, read, update, and delete tasks. CORS is not an access-control mechanism: keep this API local or otherwise restricted until authentication is added.

## Run locally

After the Supabase project and `backend/.env` are configured, start both API and Angular app from the repository root with:

```sh
npm install
cd backend
npm install
cd ..
npm run start:all
```

`npm run start:all` starts the API and Angular app together. Stop both with Ctrl+C. The API listens on `http://localhost:3000`; its routes are `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, and `DELETE /tasks/:id`. Angular is at `http://localhost:4200`. The frontend API URL is configured in [`src/environments/environment.ts`](src/environments/environment.ts); change it for a different backend host.

To verify persistence, create a task, refresh the task board, and confirm it is still present. The task list loads from the API on each visit/refresh.

## Tests

```sh
# From the repository root
npm test

# From backend/
npm test
```
