# Members Only

I built this for The Odin Project "Members Only" assignment.

The app is a small message board where people can:
- sign up and log in
- post messages
- join the club with a passcode
- become admin with a separate passcode

The main point of the project is practicing auth and permissions with Express + Postgres.

## What is implemented

- Sign up with validation and password hashing (`bcrypt`)
- Login/logout using Passport local strategy
- Membership upgrade flow (`/membership/join`)
- Admin upgrade flow (`/admin/join`)
- Message creation for logged-in users only
- Message deletion for admins only
- Home page shows all messages to everyone
- Author name and timestamp are only shown to members/admins

Role UX details:
- If someone upgrades successfully, they are redirected home with a success banner
- If someone is already a member/admin and tries to hit the join URL directly, they are redirected home with an info banner
- "Join the club" and "Become admin" links are hidden once they no longer apply

## Tech stack

- Node.js + Express
- TypeScript
- PostgreSQL (`pg`)
- Passport (`passport-local`)
- `express-session` + `connect-pg-simple`
- EJS
- `express-validator`

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Postgres database

Example:

```bash
createdb members_only_dev
```

### 3. Create `.env.development`

```env
NODE_ENV=development
DATABASE_URL=postgresql://<user>@localhost:5432/members_only_dev
SESSION_SECRET=replace-me
MEMBERSHIP_PASSCODE=replace-me
ADMIN_PASSCODE=replace-me
```

### 4. Create database tables

```bash
npm run db:setup
```

### 5. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - run in watch mode with `tsx`
- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run compiled app
- `npm run db:setup` - create/update tables and indexes
- `npm run lint` - run ESLint
