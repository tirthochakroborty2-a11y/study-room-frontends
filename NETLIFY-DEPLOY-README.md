# Netlify deployment

This project has been prepared for Netlify with the TanStack Start Vite plugin and a `netlify.toml` build configuration.

## Deploy without GitHub
1. Sign in to Netlify: https://app.netlify.com/
2. Choose **Add new project** / **Deploy manually** (wording may vary).
3. Important: a source ZIP is not the same as a built static site. Netlify Drop cannot build this source ZIP by itself.
4. To build and deploy from this project, use Netlify's supported build workflow (Netlify CLI or a connected Git repository). The build command is `npm run build`; publish directory is `dist/client`.

## Local build
Run from this folder:
```sh
npm install
npm run build
```

If Netlify reports a build error, copy the complete build log so the specific issue can be fixed.
