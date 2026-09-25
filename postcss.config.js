// Tailwind v4: the PostCSS plugin now lives in its own package
// (`@tailwindcss/postcss`) and handles vendor prefixing internally via
// Lightning CSS — no separate `autoprefixer` needed.
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
