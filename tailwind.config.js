/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    ring: "hsl(var(--sidebar-ring))",
                    border: "hsl(var(--sidebar-border))",
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            typography: {
                DEFAULT: {
                    css: {
                        '--tw-prose-links': 'rgb(37 99 235)', // text-blue-600
                        maxWidth: 'none',
                        h1: {
                            marginTop: '2rem',
                            marginBottom: '1rem',
                            fontSize: '2.25rem',
                            fontWeight: '700',
                            lineHeight: '1.2',
                        },
                        h2: {
                            marginTop: '2rem',
                            marginBottom: '1rem',
                            fontSize: '1.875rem',
                            fontWeight: '600',
                            lineHeight: '1.3',
                        },
                        h3: {
                            marginTop: '1.5rem',
                            marginBottom: '0.75rem',
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            lineHeight: '1.3',
                        },
                        'h4,h5,h6': {
                            marginTop: '1.25rem',
                            marginBottom: '0.5rem',
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            lineHeight: '1.4',
                        },
                        p: {
                            marginBottom: '1.25rem',
                            lineHeight: '1.7',
                        },
                        a: {
                            color: 'rgb(37 99 235)', // text-blue-600
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        },
                        ul: {
                            marginTop: '1rem',
                            marginBottom: '1rem',
                            paddingLeft: '1.625rem',
                        },
                        ol: {
                            marginTop: '1rem',
                            marginBottom: '1rem',
                            paddingLeft: '1.625rem',
                        },
                        'ul > li': {
                            marginTop: '0.375rem',
                            marginBottom: '0.375rem',
                            paddingLeft: '0.375rem',
                        },
                        'ol > li': {
                            marginTop: '0.375rem',
                            marginBottom: '0.375rem',
                            paddingLeft: '0.375rem',
                        },
                        blockquote: {
                            marginTop: '1.5rem',
                            marginBottom: '1.5rem',
                            paddingLeft: '1rem',
                            borderLeftWidth: '0.25rem',
                            borderLeftColor: 'rgb(37 99 235)', // border-blue-600
                            fontStyle: 'italic',
                        },
                        img: {
                            marginTop: '2rem',
                            marginBottom: '2rem',
                            borderRadius: '0.5rem',
                        },
                        hr: {
                            marginTop: '2rem',
                            marginBottom: '2rem',
                        },
                        'pre': {
                            backgroundColor: 'rgb(31 41 55)', // bg-gray-800
                            color: 'rgb(243 244 246)', // text-gray-100
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            marginTop: '1.5rem',
                            marginBottom: '1.5rem',
                            overflowX: 'auto',
                        },
                        'code': {
                            backgroundColor: 'rgb(243 244 246)', // bg-gray-100
                            color: 'rgb(31 41 55)', // text-gray-800
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875em',
                        },
                        'pre code': {
                            backgroundColor: 'transparent',
                            padding: '0',
                            color: 'inherit',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require('@tailwindcss/typography'),
    ],
}
