Because this is a **React** app (not just simple HTML), you can't just turn on GitHub Pages for the `main` branch. The browser doesn't understand React code directly; it needs to be "built" (translated) first.

so, you'll need to:

### Phase 1: The One-Time Setup (In your Code Editor)

Before deploying, we need to tell the app **where** it lives on the internet.

1. **Find your Repository Name:**
If your GitHub URL is `https://github.com/yourname/my-music-portfolio`, your repo name is `my-music-portfolio`.
2. **Update `vite.config.js`:**
Open this file in your editor. Add the `base` property inside `defineConfig`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: "/your-repo-name-here/", // <--- IMPORTANT: Add this line!
})

```


*(Replace `your-repo-name-here` with your actual GitHub repository name, e.g., `/aishwarya-portfolio/`)*
3. **Update `package.json`:**
Open this file.
* **Add `homepage**` at the top level (under "name" or "version"):
```json
"homepage": "https://yourusername.github.io/your-repo-name-here",

```


* **Update `scripts**`: Add a `predeploy` and `deploy` script inside the "scripts" section:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "predeploy": "npm run build",      // <--- Add this
  "deploy": "gh-pages -d dist"       // <--- Add this
},

```




4. **Install the Deploy Tool** (If you haven't already):
Run this in your terminal:
```bash
npm install gh-pages --save-dev

```

nvm install 22.12
nvm use 22,12

---

### Phase 2: Send it to the Web (In your Terminal)

Now that it's configured, run the magic command. This will build your website and push the "ready-to-view" version to a special branch on GitHub.

1. Run this command:
```bash
npm run deploy

```



*If it asks for your GitHub username/password, enter them. If it says "Published", you are successful!*

---

### Phase 3: Turn it On (In GitHub UI)

Now, go to your repository page on **github.com**:

1. Click the **Settings** tab (top right of the repo menu).
2. On the left sidebar, scroll down and click **Pages**.
3. Under **Build and deployment** > **Source**, make sure it says "Deploy from a branch".
4. Under **Branch**, click the dropdown that says `main` (or `master`) and change it to **`gh-pages`**.
* *(Note: The `gh-pages` branch was created automatically when you ran `npm run deploy` in Phase 2).*


5. Click **Save**.

**That's it!**
In about 1-2 minutes, refresh that Settings page. You will see a bar at the top saying:

> "Your site is live at [https://yourusername.github.io/your-repo-name/](https://www.google.com/search?q=https://yourusername.github.io/your-repo-name/)"

Update:
https://www.npoint.io/docs/351d4f48fd1c2ad3df3b
https://api.npoint.io/41fc51fce7343b4e45e1

which has info about Upcoming events