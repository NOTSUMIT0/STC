# Deployment Guide: Deploying STC to Render

This guide walks you through deploying your **Student Tech Community (STC)** platform to the web using **Render** (for hosting) and **MongoDB Atlas** (for the database).

## Prerequisites
- [x] **Project Code Prepared**: I have already updated your code to be "deploy-ready" (replaced hardcoded URLs with environment variables).
- [ ] **GitHub Account**: You need to push your code to a GitHub repository.
- [ ] **MongoDB Atlas Account**: For the database.
- [ ] **Render Account**: For hosting the site.

---

## Phase 1: Push Code to GitHub (If not already done)
1.  Create a new repository on GitHub.
2.  Push your project code to this repository.
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

---

## Phase 2: Setup MongoDB Atlas (Database)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2.  **Create a Cluster** (The free "Shared" tier is fine).
3.  **Create a Database User**:
    - Go to "Database Access".
    - Add a New Database User (e.g., `admin`).
    - **Password**: Create a strong password and **COPY IT** (you will need it later).
4.  **Allow Network Access**:
    - Go to "Network Access".
    - Click "Add IP Address".
    - Select **"Allow Access from Anywhere"** (`0.0.0.0/0`). (Required for Render to connect).
5.  **Get Connection String**:
    - Go to "Deployment" -> "Database".
    - Click **"Connect"** -> "Drivers".
    - Copy the connection string (looks like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).

---

## Phase 3: Deploy Backend (Server) on Render
1.  Go to [Render Dashboard](https://dashboard.render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Configure Settings**:
    - **Name**: `stc-server` (or similar).
    - **Root Directory**: `server` (IMPORTANT: The backend is in the server folder).
    - **Runtime**: `Node`.
    - **Build Command**: `npm install`
    - **Start Command**: `node index.js`
5.  **Environment Variables** (Scroll down to "Advanced"):
    - Click "Add Environment Variable".
    - **Key**: `MONGO_URI`
    - **Value**: Paste your MongoDB connection string (Replace `<password>` with your actual password).
    - **Key**: `PORT`
    - **Value**: `5000`
6.  Click **"Create Web Service"**.
7.  **Wait**: Render will build your app. Once deployed, copy the **Service URL** (e.g., `https://stc-server.onrender.com`).

---

## Phase 4: Deploy Frontend (Client) on Render
1.  Go back to Render Dashboard.
2.  Click **"New +"** -> **"Static Site"**.
3.  Connect the **SAME** GitHub repository.
4.  **Configure Settings**:
    - **Name**: `stc-client`.
    - **Root Directory**: `client` (IMPORTANT: The frontend is in the client folder).
    - **Build Command**: `npm run build`
    - **Publish Directory**: `dist`
5.  **Environment Variables**:
    - Click "Add Environment Variable".
    - **Key**: `VITE_API_URL`
    - **Value**: Paste the **Backend Service URL** from Phase 3 (e.g., `https://stc-server.onrender.com`).
    *Note: Do NOT add a trailing slash `/` at the end.*
6.  Click **"Create Static Site"**.

---

## Success! 🎉
Once both services are deploy "Live", your Student Tech Community platform is online!
- Open the **Client URL** provided by Render to see your live site.
- Test the "Sign Up" flow to verify the database connection works.

### Troubleshooting
- **"Network Error" on Sign Up**: Check the `VITE_API_URL` variable in the Client service. It must match the Server URL exactly.
- **"MongoDB connection error" in Server Logs**: Check "Network Access" in MongoDB Atlas is set to `0.0.0.0/0` and you used the correct password in `MONGO_URI`.
