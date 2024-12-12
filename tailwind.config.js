/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'rusty-red': '#d9344aff',
                'night': '#151515ff',
                'baby-powder': '#fdfffcff',
                'lilac': '#be97c6ff',
                'true-blue': '#476c9bff',
            },
        },
    },
    plugins: [],
};
