/**** Tailwind v3 config ****/
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				navy: '#0f172a',
				teal: '#0ea5a4'
			}
		}
	},
	plugins: []
};
