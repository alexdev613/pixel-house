/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      minHeight: {
        "screen-minus-header-and-footer": "calc(100vh - 224px)",
      },
    },
  },
  plugins: [],
}
