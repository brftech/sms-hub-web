/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../packages/config/tailwind.config.js')],
  content: [
    './src/**/*.{ts,tsx}',
    './index.html',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
}
