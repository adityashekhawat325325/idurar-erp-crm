## Getting started

### Prerequisites

- **Node.js 20** (20.9.0 recommended) and **npm 10**. The backend refuses to start on Node versions below 20. Check with:

```bash
node -v
```

- **Git**
- A **MongoDB** database: either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or MongoDB running locally (or in Docker)

#### Step 1: Clone the repository

```bash
git clone https://github.com/idurar/idurar-erp-crm.git
```

```bash
cd idurar-erp-crm
```

#### Step 2: Get a MongoDB connection string

**Option A – MongoDB Atlas (cloud)**

- Create a MongoDB account on the MongoDB website.

- Create a new cluster by following the MongoDB documentation, then copy the "Connect to your application" URI. Replace `<password>` in it with your database user's password.

- Add your current IP address to the cluster's IP access list so the backend can connect (repeat this whenever your IP changes).

**Option B – Local MongoDB**

If MongoDB is installed locally, or you run it with Docker:

```bash
docker run -d --name idurar-mongo -p 27017:27017 mongo
```

your connection string is:

`mongodb://localhost:27017/idurar`

#### Step 3: Create the backend environment file

The backend's `.env` file is not committed to the repository. Create it from the provided example:

```bash
cp backend/.env.example backend/.env
```

(On Windows Command Prompt, use `copy backend\.env.example backend\.env`.)

#### Step 4: Fill in the environment variables

Open `backend/.env` and set at least these two values:

- `DATABASE`: your MongoDB connection string from Step 2

  `DATABASE="mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/idurar"`

- `JWT_SECRET`: any long random string. It signs login tokens, and logging in will fail without it.

  `JWT_SECRET="replace-with-a-long-random-string"`

The other variables in the file are optional. `RESEND_API` enables email sending, `OPENAI_API_KEY` enables AI features, and the `DO_SPACES_*` variables enable cloud file storage.

#### Step 5: Install backend dependencies

In your terminal, go to the `backend` directory:

```bash
cd backend
```

then run the following command to install the backend dependencies:

```bash
npm install
```

#### Step 6: Run the setup script

While still in the `backend` directory, run:

```bash
npm run setup
```

This creates the default admin account and the application settings in your database. When it finishes you should see `🥳 Setup completed :Success!`.

The setup only needs to run once. To wipe the admin account and settings and start over, run `npm run reset` and then `npm run setup` again.

#### Step 7: Run the backend server

In the same terminal, start the backend:

```bash
npm run dev
```

The backend listens on **http://localhost:8888** (change it with `PORT` in `.env`). You should see `✅ MongoDB connected` followed by `Express running → On PORT : 8888`.

#### Step 8: Install frontend dependencies

Open a **new terminal** window at the root of the repository and run:

```bash
cd frontend
```

Create the frontend environment file from the example (the defaults work for local development):

```bash
cp .env.example .env
```

(On Windows Command Prompt, use `copy .env.example .env`.)

```bash
npm install
```

#### Step 9: Run the frontend server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. The frontend's dev server forwards `/api` requests to the backend on port 8888, so keep both terminals running.

#### Step 10: Log in

Sign in with the default admin account created by the setup script:

- **Email:** `admin@admin.com`
- **Password:** `admin123`

:warning: Change this password right after your first login, especially on any server reachable from the internet.

---

### Frontend configuration (optional)

The frontend reads its settings from `frontend/.env`, which you created from `frontend/.env.example` in Step 8:

| Variable              | Purpose                                                      | Default                  |
| --------------------- | ------------------------------------------------------------ | ------------------------ |
| `VITE_BACKEND_SERVER` | URL of the backend API                                       | `http://localhost:8888/` |
| `VITE_FILE_BASE_URL`  | Base URL for uploaded files and PDFs served by the backend   | `http://localhost:8888/` |

To run the frontend against a **remote** backend instead of a local one, set `VITE_BACKEND_SERVER` to that server's URL (see `frontend/temp.env` for an example), then start the frontend with:

```bash
npm run dev:remote
```

---

### Running in production

Build the frontend:

```bash
cd frontend
```

```bash
npm run build
```

The production files are written to `frontend/dist`; serve them with any static web server. Before building, set `VITE_BACKEND_SERVER` to your production backend URL.

Start the backend (with `NODE_ENV="production"` set in `backend/.env`):

```bash
cd backend
```

```bash
npm start
```

---

### Troubleshooting

**`MongooseServerSelectionError` or the backend cannot connect to the database**

- Check that `DATABASE` in `backend/.env` is correct and the password contains no unescaped special characters.
- For Atlas, make sure your current IP address is in the cluster's IP access list.

**Login fails with a token or `secretOrPrivateKey` error**

- `JWT_SECRET` is missing from `backend/.env`. Add it and restart the backend.

**`npm run setup` reports "Setup already done"**

- The database has already been set up. Run `npm run reset`, then `npm run setup` again.

**OpenSSL error (`ERR_OSSL_EVP_UNSUPPORTED` / `digital envelope routines::unsupported`)**

This only happens on older Node.js versions or legacy tooling. Upgrade to Node.js 20 first. If the error persists, enable the legacy OpenSSL provider and run `npm run dev` again:

- On Unix-like systems (Linux, macOS, Git Bash):

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

- On Windows Command Prompt:

```bash
set NODE_OPTIONS=--openssl-legacy-provider
```

- On PowerShell:

```powershell
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```
