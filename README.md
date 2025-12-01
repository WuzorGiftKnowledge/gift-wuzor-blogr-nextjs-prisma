# Fullstack Authentication Example with Next.js and NextAuth.js

This is the starter project for the fullstack tutorial with Next.js and Prisma. You can find the final version of this project in the [`final`](https://github.com/prisma/blogr-nextjs-prisma/tree/final) branch of this repo.

## Authentication Providers

This project supports login with:
- **GitHub** OAuth
- **Google** OAuth

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/mydatabase?schema=public"

# NextAuth
# The base URL of your application (required for OAuth redirects)
NEXTAUTH_URL="http://localhost:3000"
# Generate a random secret: openssl rand -base64 32
SECRET="your-nextauth-secret-here"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Setting Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - **IMPORTANT: Fill in BOTH fields correctly:**
     - **Authorized JavaScript origins** (NO paths, just domain):
       - For development: `http://localhost:3000`
       - For production: `https://yourdomain.com`
     - **Authorized redirect URIs** (WITH path):
       - For development: `http://localhost:3000/api/auth/callback/google`
       - For production: `https://yourdomain.com/api/auth/callback/google`
   - Copy the **Client ID** and **Client Secret**
5. Add the credentials to your `.env` file:
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

## Setting Up GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and generate a **Client Secret**
5. Add the credentials to your `.env` file:
   ```env
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

## Troubleshooting

### Error: redirect_uri_mismatch

If you encounter a `redirect_uri_mismatch` error, it means the redirect URI in your OAuth provider settings doesn't match what NextAuth is using. Here's how to fix it:

#### Step-by-Step Fix for Google OAuth:

1. **Verify your `.env` file has the correct `NEXTAUTH_URL`**:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   ```
   - Must match exactly (no trailing slash)
   - For development: use `http://localhost:3000`
   - Make sure you're using port 3000 (or update if you're using a different port)

2. **Go to Google Cloud Console and update BOTH fields**:
   - Visit: https://console.cloud.google.com/apis/credentials
   - Find your OAuth 2.0 Client ID (the one with your `GOOGLE_CLIENT_ID`)
   - Click on it to edit
   - **Authorized JavaScript origins** (NO paths):
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs** (WITH path):
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - **Important**: 
     - No trailing slashes
     - Use lowercase
     - Must be `http://` (not `https://`) for localhost
     - Exact port number (3000)
     - JavaScript origins = domain only (no /api/...)
     - Redirect URIs = full path including /api/auth/callback/google
   
3. **Click "SAVE"** in Google Cloud Console

4. **Wait a few minutes** for changes to propagate (Google can take 1-5 minutes)

5. **Restart your development server**:
   ```bash
   # Stop the server (Ctrl+C) and restart
   yarn dev
   ```

6. **Clear your browser cache and cookies** for localhost, or use an incognito/private window

7. **Try signing in again**

#### For GitHub OAuth:
- Go to: https://github.com/settings/developers
- Click on your OAuth App
- Make sure **Authorization callback URL** is exactly: `http://localhost:3000/api/auth/callback/github`
- Update and save

#### Common Mistakes to Avoid:
- ❌ `http://localhost:3000/api/auth/callback/google/` (trailing slash)
- ❌ `https://localhost:3000/api/auth/callback/google` (https instead of http)
- ❌ `http://127.0.0.1:3000/api/auth/callback/google` (different hostname)
- ❌ `http://localhost:3001/api/auth/callback/google` (wrong port)
- ✅ `http://localhost:3000/api/auth/callback/google` (correct)

#### If still not working - Debug Checklist:

**Step 1: Check the Google Error Message**
- Look at the error page from Google - it usually shows what redirect URI it **received**
- Copy that exact URI and compare it with what's in Google Cloud Console

**Step 2: Verify Your Environment Variables**
1. Check your `.env` file exists in the project root
2. Verify `NEXTAUTH_URL` is set correctly:
   ```bash
   # If your app runs on port 3000:
   NEXTAUTH_URL="http://localhost:3000"
   
   # If your app runs on a different port (e.g., 3001):
   NEXTAUTH_URL="http://localhost:3001"
   ```
3. **NO trailing slash** after the port number
4. Make sure there are **no quotes** around the value in `.env` (or if there are, they match)

**Step 3: Verify What Port Your App is Running On**
- Check your terminal where you ran `yarn dev`
- Look for a message like: `ready - started server on 0.0.0.0:3000`
- If it's on port 3001, 3002, etc., update both:
  - Your `.env` file: `NEXTAUTH_URL="http://localhost:PORT"`
  - Google Cloud Console redirect URI

**Step 4: Double-Check Google Cloud Console Settings**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Verify **Authorized redirect URIs** contains EXACTLY:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Replace 3000 with your actual port if different)

**Step 5: Common Issues to Check**
- ✅ `.env` file is in the project root (same folder as `package.json`)
- ✅ Server was restarted after changing `.env`
- ✅ No extra spaces in `.env` values
- ✅ Using `http://` not `https://` for localhost
- ✅ Port numbers match everywhere

**Step 6: Test the Configuration**
1. Restart your server completely (stop with Ctrl+C, then `yarn dev`)
2. Clear browser cache/cookies or use incognito mode
3. Visit: `http://localhost:3000/api/auth/signin`
4. Try signing in with Google
5. If it fails, check the error URL - it will show what redirect URI was sent
