# ronell-next-blog

Personal site and blog, based on [next-mdx-blog](https://github.com/leerob/next-mdx-blog).

- **Framework**: [Next.js](https://nextjs.org) (static export)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Font**: [Open Runde](https://github.com/lauridskern/open-runde) via Fontsource
- **Code highlighting**: [sugar-high](https://github.com/antfu/sugar-high)
- **Content**: MDX pages in `app/`

## Running locally

Requires Node.js v20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Writing a post

Create a folder under `app/blog/<slug>/` with a `page.mdx` file:

```mdx
export const metadata = {
  title: 'Post Title',
  description: 'Short summary.',
  alternates: {
    canonical: '/blog/<slug>'
  }
};

# Post Title

Body in Markdown or MDX.
```

Then link it from the **Writing** list in `app/page.mdx`.

## Building

```bash
npm run build
```

Outputs a static site to `out/`, ready for GitHub Pages or any static host.
