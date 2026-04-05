# Deploying the docs site

The docs are a [VitePress](https://vitepress.dev/) app under `docs/`.

## Local preview

```bash
bun install
bun run docs:dev
```

## Production build

```bash
bun run docs:build
```

Output: `docs/.vitepress/dist`.

## Vercel

1. Create a Vercel project pointing at this repository.
2. **Framework preset:** VitePress (or “Other”).
3. **Build command:** `bun install && bun run docs:build`
4. **Output directory:** `docs/.vitepress/dist`
5. Attach your domain (e.g. `onering.findmalek.com`) in Vercel DNS settings.

Serve `install.sh` from the site or link to the raw file on GitHub for `curl | bash` workflows.
