Full-resolution originals, kept out of `public/` so they are never deployed.

| File | Used for |
| --- | --- |
| `pfp-original.png` | Portrait (About page, home, structured data) |
| `projects/*.jpg`, `projects/*.webp` | Project screenshots, one per project slug |

The site serves AVIF/WebP derivatives from `public/img/`. Regenerate them
after adding or replacing an original:

    npm run assets:images

Brand assets are generated too:

    npm run assets:icons   # favicon.svg, PNG icons, favicon.ico
    npm run assets:fonts   # subset fonts into public/fonts

The Open Graph image is `scripts/og-image.html` rendered by headless Chrome;
the command is in that file's header comment.
