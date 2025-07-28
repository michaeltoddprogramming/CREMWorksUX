# CREM WORKS – UX PROJECT

This project is a **monorepo** setup with

- **Frontend**: React + Vite
- **Backend**: Node.js
- Managed with **npm workspaces**

---

## PROJECT SETUP

---

### Components and Styling

- **Component Organization:**  
  All React components are stored in `frontend/src/components`.

- **Global Styling:**  
  Shared styles for layout, colors, and typography are placed in `frontend/src/globalstyles/index.css`. These styles apply to the whole app.

- **Component-Specific Styling:**  
  Each component can have its own CSS Module file (`Login.module.css` in the Login folder). CSS Modules keep styles scoped to the component, preventing conflicts.

---

### Install dependencies

Run **ONCE from the ROOT DIRECTORY (I SET IT UP THIS WAY SO THERES NO NEED TO BE SWITCHING DIRECTORYS AND RUNNING NPM INSTALL)**:

```bash
npm install
```

This installs all frontend and backend dependencies in the shared root `node_modules`. ( There will still be node_modules folders in the frontend and backend but they are just symlinks)

---

### Running the Stack

SETUP IN A WAY WHERE YOU CAN RUN BACKEND AND FRONTEND FROM THE ROOT IN ONE CLI COMMAND

```bash
npm run dev
```

This will
- Run the backend on `http://localhost:3000`
- Run the frontend on `http://localhost:5173`

---

## Current Scripts

| Script            | Description                    |
|------------------|--------------------------------|
| `npm run dev`     | Starts both frontend and backend |
| `npm run dev:frontend` | Starts only the React frontend |
| `npm run dev:backend`  | Starts only the Node backend |

---

## Adding Packages (Frontend / Backend Specific if need be)

To install a package in a specific workspace (Frontend dependencies or Backend Dependencies)

```bash
npm install <package-name> --workspace frontend
npm install <package-name> --workspace backend
```

> Don't run `npm install` inside subfolders! ITS NOT NEEDED

---

## Git & Ignore Notes

This is a single Git repo. A shared `.gitignore` at the root handles all `node_modules`, `dist`, and system files.