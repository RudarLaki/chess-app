# ♟️ Chess App — React + Vite

This project is a React-based chess application built using the Vite development environment and the `immutable` library for efficient data handling.

## 🚀 Setup Instructions

Follow these steps to get the project up and running on your local machine:

---

### 1. ✅ Install Node.js
If you don't already have Node.js installed, download it here:  
👉 [https://nodejs.org/](https://nodejs.org/)

---

### 2. 📁 Create and Open Project Folder

- Create a new folder anywhere on your machine (e.g. Desktop), and name it:

```bash
chess-app
```

- Open the folder in **Visual Studio Code (VS Code)**.

---

### 3. ⚙️ Initialize the Project with Vite

Open the terminal in VS Code and run the following:

```bash
npm create vite@latest chess-app -- --template react
cd chess-app
npm install
```

> **Note**: If you get a script execution error like:
> ```
> running scripts is disabled on this system
> ```
> Then run this **PowerShell command** first:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then re-run:

```bash
npm create vite@latest chess-app -- --template react
cd chess-app
npm install
```

---

### 4. 📦 Install Required Dependencies

Install the `immutable` library (used in the app):

```bash
npm install immutable
```

---

### 5. 📂 Replace the `src` Folder

- Delete the existing `src` folder inside `chess-app`.
- Replace it with **your own \`src\` folder** (the one you were given).
  
> 📁 Optional: You can also delete the contents of the `public` folder — they are not needed.

---

### 6. 🧪 Run the Development Server

Start the Vite dev server:

```bash
npm run dev
```

You’ll see a local URL like:

```
http://localhost:5173/
```

Open it in your browser to view the app.

---

## 🔁 Run It Again Later

Every time you want to run the app:

1. Open the project folder (`chess-app`) in VS Code
2. Run this in the terminal:

```bash
npm run dev
```

---

### ✅ That’s it! You’re good to go.

