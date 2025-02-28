import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       background: "var(--background)",
  //       foreground: "var(--foreground)",
  //     },
  //   },
  // },
  theme: {
    extend: {
      screens: {
        xmd: "940px",
        xll: "1400px",
        xx: "1800px",
        xxl: "2000px",
        xxxl: "2600px",
        xxxxl: "3200px",
      },
      borderRadius: {
        "14px": "14px",
      },
      lineClamp: {
        7: "7",
        8: "8",
        9: "9",
        15: "15",
      },
      //  borderWidth: {
      //   'custom': '0.47px',
      // },
      // borderImage: {
      //   'gradient-border': 'linear-gradient(to right, #152F60 100%, #2659BA 100%)',
      // },
      colors: {
        //c = custom
        cBlue: {
          extraLight: "#21283D",
          light: "#00ADFF",
          main: "#285DA2",
          dark: "#181B2C",
          special: "#141F35",
          navy: "#101828",
          tab: "#1A2947",
          secondary: "#15182B",
        },
        cPurple: {
          main: "#7C83A1",
          light: "#596184",
        },
        cBlack: {
          main: "#0F111F",
          dark: "#090A16",
        },
        cWhite: {
          main: "#fff",
          light: "rgba(255,255,255, 0.3)",
        },
        cGray: {
          400: "#778899",
          500: "#667085",
        },
      },
      fontFamily: {
        primary: ["Inter", "sans-serif"],
        roboto: ["Roboto", "serif"],
      },
      // boxShadow: {
      //   cShadow: {
      //     main: "0px 1px 2px rgba(16, 24, 40, 0.05)",
      //   },
      //   cShadowNavigationVertial: "0px 24px 48px -12px rgba(0, 0, 0, 0.45)",
      // },
    },
  },
  plugins: [],
} satisfies Config;
