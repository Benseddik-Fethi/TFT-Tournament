/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // TFT Brand Colors
                brand: {
                    gold: {
                        50: '#FFF9E6',
                        100: '#FFF0CC',
                        200: '#FFE199',
                        300: '#FFD166',
                        400: '#F0C243',
                        500: '#C89B3C', // Primary Gold
                        600: '#A07A2E',
                        700: '#785A28',
                        800: '#503C1A',
                        900: '#281E0D',
                    },
                    hextech: {
                        50: '#E6FFFC',
                        100: '#CCFFF9',
                        200: '#99FFF3',
                        300: '#66FFED',
                        400: '#33FFE7',
                        500: '#0AC8B9', // Primary Hextech
                        600: '#08A094',
                        700: '#068C82',
                        800: '#045851',
                        900: '#022C29',
                    },
                },
                // Custom Slate (TFT dark theme)
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#010A13', // TFT deep dark
                },
                // Semantic colors
                success: '#0BC95A',
                warning: '#F0B232',
                danger: '#D13639',
                info: '#0AC8B9',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Sora', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glow-gold': '0 0 20px rgba(200, 155, 60, 0.5)',
                'glow-hextech': '0 0 20px rgba(10, 200, 185, 0.5)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                shimmer: 'shimmer 2s linear infinite',
                float: 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                shimmer: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backgroundImage: {
                'hextech-gradient': 'linear-gradient(135deg, #0AC8B9 0%, #068C82 100%)',
                'gold-gradient': 'linear-gradient(135deg, #F0C243 0%, #C89B3C 100%)',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};