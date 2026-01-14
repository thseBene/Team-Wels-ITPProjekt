# Presentation (reveal.js)

This folder contains a Reveal.js-based presentation scaffold for Team Wels project documentation.

How to use:

- Edit `index.html` to add or change slides. Slides live inside the `<div class="slides">` element.
- Open `index.html` in a browser to view the presentation.
- For a local dev server with auto reload, you can use `serve` (npm) or `live-server`:

# from the presentation folder
npx serve .
# or
npx live-server .

Custom styles are in `styles.css`.

If you want to use Reveal.js plugins or install locally, run:

# initialize and install reveal.js locally (optional)
npm init -y
npm i reveal.js
