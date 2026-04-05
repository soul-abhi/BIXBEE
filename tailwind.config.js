export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'display': ['"Instrument Serif"', 'serif'],
                'sans': ['"Space Grotesk"', 'sans-serif'],
                'mono': ['"Fragment Mono"', 'monospace'],
            },
            colors: {
                background: '#0a0a0c',
                surface: '#121214',
                border: '#2a2a2c',
                foreground: '#f4f4f5',
                muted: '#a1a1aa',
                accent: {
                    coral: '#ff5c58',
                    mint: '#4ade80',
                    pink: '#f472b6',
                    orange: '#fb923c'
                }
            }
        },
    },
    plugins: [],
}