# Installation Guide

## Prerequisites

You need Node.js installed first. Yarn requires Node.js to run.

## Installing Node.js and Yarn

### Step 1: Install Node.js

**Option A: Direct Download (Easiest)**
1. Visit https://nodejs.org/
2. Download the LTS version for macOS
3. Run the installer
4. Restart your terminal

**Option B: Using Homebrew (If you have Homebrew installed)**
```bash
brew install node
```

**Option C: Using nvm (Node Version Manager)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

### Step 2: Verify Node.js Installation

After installing Node.js, verify it's working:
```bash
node --version
npm --version
```

### Step 3: Install Yarn

Once Node.js is installed, you can install Yarn using one of these methods:

**Method 1: Using npm (comes with Node.js)**
```bash
npm install -g yarn
```

**Method 2: Using Corepack (Node.js 16.10+)**
```bash
corepack enable
```

**Method 3: Using Homebrew**
```bash
brew install yarn
```

### Step 4: Verify Yarn Installation

```bash
yarn --version
```

### Step 5: Install Project Dependencies

Once yarn is installed, run:
```bash
yarn install
```

## Quick Setup Commands

If you already have Node.js installed, you can quickly install yarn with:
```bash
npm install -g yarn
```

Then install project dependencies:
```bash
yarn install
```

