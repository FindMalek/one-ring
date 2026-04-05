import { defineConfig } from "vitepress";

export default defineConfig({
  title: "OneRing",
  description: "One config to rule them all — cross-platform dotfiles and bootstrap CLI",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting started", link: "/guide/getting-started" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Keyboard & keyd", link: "/guide/keyboard" },
          { text: "Deploy docs (Vercel)", link: "/guide/deploy" },
        ],
      },
    ],
    socialLinks: [],
  },
});
