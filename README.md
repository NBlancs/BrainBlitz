# Local Setup Guide - BrainBlitz Trivia

Welcome to the local setup and execution guide for **BrainBlitz Trivia**! This document provides step-by-step instructions to get the PostgreSQL database, the Node.js Fastify backend server, and the React Native + Expo mobile application running locally on your machine.

---

## Prerequisites

Make sure you have the following installed on your machine:
1. **Node.js** (v18 or higher recommended; v22 is verified).
2. **npm** (comes with Node.js).
3. **PostgreSQL** (v14 or higher recommended, running on port `5432`).
4. **Expo Go** app installed on your physical mobile device (iOS/Android) if you want to test on physical hardware, or an Android/iOS emulator configured on your PC.

---

## 🔌 Step 1: PostgreSQL Database Configuration

The application uses PostgreSQL with Prisma ORM.

1. **Verify PostgreSQL is Running**:
   Ensure PostgreSQL is running locally on port `5432`.
2. **Update Environment File**:
   In the `sample_backend/` folder, copy `.env.example` to `.env` if it doesn't already exist.
   Ensure the `DATABASE_URL` matches your local PostgreSQL credentials:
   
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/brainblitz
   ```

   > [!NOTE]
   > **Windows Users & SCRAM Authentication**: PostgreSQL installers on Windows require a user password by default. If your credentials do not match, you will see a `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` error. Make sure to specify the correct password in the `DATABASE_URL` or set it in your environment.

---

## Step 2: Backend Setup (Fastify + GraphQL)

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd sample_backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. **Run the Database Provisioning Script**:
   We have created a dedicated, robust database setup script. Run it to create the database, enable necessary PostgreSQL extensions, apply all Prisma schema migrations, and seed initial questions:
   ```bash
   # Standard setup (interactive prompt for seeding)
   npm run db:setup

   # Or, to run it non-interactively with auto-seeding:
   npm run db:setup -- --force --seed

   # Or, to perform a clean reinstall (drops existing db and starts fresh):
   npm run db:setup -- --clean --seed
   ```
4. **Start the GraphQL Backend**:
   Run the development server using:
   ```bash
   npm run dev
   ```
   Once started, the backend will be available at:
   - **GraphQL Endpoint**: `http://localhost:4000/graphql`
   - **GraphiQL Playground**: `http://localhost:4000/graphiql` (Open in browser to test queries/mutations)
   - **Health Check**: `http://localhost:4000/health`

---

## Step 3: Mobile Frontend Setup (React Native + Expo)

1. Open a new terminal window and navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. **Configure Connection**:
   By default, the Expo app will automatically derive your backend server's host from the Expo development server network IP. If you need to set it explicitly:
   - Copy `.env.example` to `.env` (inside the `mobile/` directory).
   - Set the GraphQL URL:
     ```env
     EXPO_PUBLIC_GRAPHQL_HTTP_URL=http://<YOUR_LOCAL_IP>:4000/graphql
     ```
     *(Use your machine's local IP address instead of `localhost` so your physical device running Expo Go can communicate with the server over local Wi-Fi).*

4. **Start the Expo Development Server**:
   ```bash
   npm run start
   ```
   This will boot the Expo Metro Bundler and display a QR code in your terminal.

5. **Run the Application**:
   - **On iOS/Android Device**: Scan the QR code using your phone's camera (iOS) or the Expo Go App (Android). Make sure your phone is connected to the same Wi-Fi network as your computer.
   - **On iOS Simulator**: Press `i` in the terminal.
   - **On Android Emulator**: Press `a` in the terminal.
   - **On Web Browser**: Press `w` in the terminal.

---

## Troubleshooting & Tips

### 1. Mobile Client cannot connect to Backend
If the mobile app starts but shows network errors or cannot fetch categories:
- Ensure both your computer and your phone are on the **exact same Wi-Fi network**.
- Change `localhost` in the mobile `.env` config to your computer's local network IP (e.g., `http://192.168.1.100:4000/graphql`). You can find this IP by running `ipconfig` (Windows) or `ifconfig` (macOS/Linux) in your terminal.
- Verify your computer's firewall is not blocking incoming connections on port `4000`.

### 2. SCRAM Authentication Errors on Backend
If the database setup script or the Fastify server crashes with a SCRAM error:
- Double check that you specified the correct password in the `DATABASE_URL` within `sample_backend/.env`.
- If you are running in PowerShell, you can temporarily override the database URL with your password like this:
  ```powershell
  $env:DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/brainblitz"; npm run db:setup -- --force --seed
  ```
