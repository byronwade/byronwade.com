import type { Config } from "tailwindcss";

const config = {
	darkMode: ["selector"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		container: {
			padding: {
				DEFAULT: "2rem",
				sm: "3rem",
				md: "4rem",
				lg: "6rem",
				xl: "8rem",
			},
		},
		spacing: {
			...require("tailwindcss/defaultTheme").spacing,
			// Extended spacing scale using 4px base unit
			"18": "4.5rem",
			"22": "5.5rem",
			"26": "6.5rem",
			"30": "7.5rem",
			// Semantic spacing tokens
			tight: "0.5rem",
			normal: "1rem",
			relaxed: "1.5rem",
			loose: "2rem",
		},
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", "system-ui", "sans-serif"],
				signature: ["var(--font-signature)", "cursive"],
			},
			fontSize: {
				xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
				sm: ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.01em" }],
				base: ["1rem", { lineHeight: "1.75", letterSpacing: "0" }],
				lg: ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }],
				xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
				"2xl": ["1.5rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
				"3xl": ["2rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
				"4xl": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
				"5xl": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
				"6xl": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
			},
			fontWeight: {
				thin: "100",
				extralight: "200",
				light: "300",
				normal: "400",
				medium: "500",
				semibold: "600",
				bold: "700",
				extrabold: "800",
				black: "900",
			},
			lineHeight: {
				tight: "1.2",
				snug: "1.3",
				normal: "1.5",
				relaxed: "1.6",
				loose: "1.75",
			},
			letterSpacing: {
				tighter: "-0.02em",
				tight: "-0.01em",
				normal: "0",
				wide: "0.01em",
				wider: "0.02em",
			},
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
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				warning: {
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
				},
				info: {
					DEFAULT: "hsl(var(--info))",
					foreground: "hsl(var(--info-foreground))",
				},
			},
			borderRadius: {
				none: "0",
				sm: "calc(var(--radius) - 4px)",
				md: "calc(var(--radius) - 2px)",
				lg: "var(--radius)",
				xl: "calc(var(--radius) + 2px)",
				"2xl": "calc(var(--radius) + 4px)",
				"3xl": "calc(var(--radius) + 8px)",
				full: "9999px",
				// Semantic radius tokens
				button: "var(--radius)",
				card: "var(--radius)",
				input: "calc(var(--radius) - 2px)",
				modal: "calc(var(--radius) + 4px)",
			},
			boxShadow: {
				sm: "var(--shadow-sm)",
				DEFAULT: "var(--shadow)",
				md: "var(--shadow-md)",
				lg: "var(--shadow-lg)",
				xl: "var(--shadow-xl)",
				"2xl": "var(--shadow-2xl)",
				inner: "var(--shadow-inner)",
				none: "none",
			},
			zIndex: {
				0: "0",
				base: "0",
				dropdown: "1000",
				sticky: "1100",
				fixed: "1200",
				"modal-backdrop": "1300",
				modal: "1400",
				popover: "1500",
				tooltip: "1600",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				orbit: {
					"0%": {
						transform: "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
					},
					"100%": {
						transform: "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
					},
				},
				marquee: {
					from: {
						transform: "translateX(0)",
					},
					to: {
						transform: "translateX(calc(-100% - var(--gap)))",
					},
				},
				"marquee-vertical": {
					from: {
						transform: "translateY(0)",
					},
					to: {
						transform: "translateY(calc(-100% - var(--gap)))",
					},
				},
				speedLeft: {
					"0%": { transform: "translateX(-100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				speedRight: {
					"0%": { transform: "translateX(100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				speedUp: {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20px)" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"slide-in-from-left": {
					"0%": { transform: "translateX(-100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-from-right": {
					"0%": { transform: "translateX(100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-from-bottom": {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
			transitionTimingFunction: {
				"ease-in": "var(--ease-in)",
				"ease-out": "var(--ease-out)",
				"ease-in-out": "var(--ease-in-out)",
				spring: "var(--ease-spring)",
			},
			transitionDuration: {
				fast: "var(--duration-fast)",
				normal: "var(--duration-normal)",
				slow: "var(--duration-slow)",
				slower: "var(--duration-slower)",
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				orbit: "orbit calc(var(--duration)*1s) linear infinite",
				marquee: "marquee var(--duration) infinite linear",
				"marquee-vertical": "marquee-vertical var(--duration) linear infinite",
				"speed-left": "speedLeft 1s ease-out forwards",
				"speed-right": "speedRight 1s ease-out forwards",
				"speed-up": "speedUp 1s ease-out forwards",
				"pulse-fast": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				float: "float 6s ease-in-out infinite",
				"fade-in": "fade-in 0.6s ease-out forwards",
				"slide-in-from-left-4": "slide-in-from-left 0.6s ease-out forwards",
				"slide-in-from-right-4": "slide-in-from-right 0.6s ease-out forwards",
				"slide-in-from-bottom-4": "slide-in-from-bottom 0.6s ease-out forwards",
			},
			typography: () => ({
				DEFAULT: {
					css: {
						"a > img": {
							display: "inline-block",
						},
					},
				},
			}),
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
