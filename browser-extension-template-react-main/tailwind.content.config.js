/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/content/**/*.{js,jsx,ts,tsx}",
    ],
    prefix: 'be-',
    important: true,
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    }
}
  
  