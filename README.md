# Vedant — Photography Portfolio

A modern, editorial photography website with a full-screen hero, masonry gallery, lightbox viewer, and smooth scroll animations.

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

- `index.html` — main site
- `css/site.css` — styles
- `js/site.js` — gallery, lightbox, filters
- `images/photography/` — full-resolution photos
- `images/photography/thumbnails/` — gallery thumbnails

## Deploy

Static hosting works out of the box (GitHub Pages, Netlify, Vercel, etc.). For local preview with a server, use `npm start`.

### Vercel

This project is configured as a **static site** in `vercel.json`. Do not add `server.js` back to the project root — Vercel treats root-level server files as serverless functions and will stop serving CSS/images.
