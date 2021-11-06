import { extendTheme } from "@chakra-ui/react";
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
import { mediaQueries, scrollbar } from "./custom";

const theme = extendTheme({
  components: {
    MenuItem: {
      baseStyle: (props: Dict<any>) => ({
        "&:first-of-type": {
          borderTop: "1px solid",
          borderTopColor: "light",
        },
        display: "flex",
        alignItems: "center",
        height: "3.5rem",
        p: "1rem",
        fontSize: "1.25rem",
        fontWeight: 300,
        grow: 1,
        width: "100%",
        justifyContent: "flex-start",
        cursor: "pointer",
        transition: "0.2s ease",
        color: "light",
        textDecoration: "none",
        _hover: {
          backgroundColor: "blackAlpha.200",
          textDecoration: "none",
          a: {
            transform: "translateX(0.5rem)",
          },
        },
        fontFamily: "heading",
        lineHeight: "1.2rem",
        a: {
          transition: "0.2s ease",
        },
        borderBottom: "1px solid",
        borderBottomColor: "light",
      }),
      variants: {
        active: (props: Dict<any> | StyleFunctionProps) => ({
          fontWeight: 800,
          color: "primaryApp.500",
          backgroundColor: "white",
          _hover: {
            backgroundColor: "white",
          },
        }),
      },
    },
  },
  styles: {
    global: (props: Dict<any>) => ({
      "#__next": {
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
      },
      html: {
        fontSize: "87.5%",
      },
      a: {
        transition: "color 0.2s",
        color: "complementary.500",
        _hover: {
          color: "complementary.800",
        },
      },
      "*": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      },
      body: {
        background: mode("light", "dark")(props),
        color: mode("dark", "light")(props),
        webkitFontSmoothing: "antialiased",
      },
      "body, input, button, select, textarea": {
        fontFamily: "Montserrat, sans-serif",
      },
      ...mediaQueries,
      ...scrollbar,
    }),
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Red Hat Display, sans-serif",
    mono: "Fira Mono, monospace",
  },
  colors: {
    primaryApp: {
      50: "#E9F0FB",
      100: "#C2D6F4",
      200: "#9BBBED",
      300: "#74A0E6",
      400: "#4E86DF",
      500: "#276BD8",
      600: "#1F56AD",
      700: "#174082",
      800: "#0F2B57",
      900: "#08152B",
    },
    complementaryApp: {
      50: "#FBF5E9",
      100: "#F4E4C2",
      200: "#EDD29B",
      300: "#E7C174",
      400: "#E0AF4D",
      500: "#D99E26",
      600: "#AD7E1F",
      700: "#825F17",
      800: "#573F0F",
      900: "#2B2008",
    },
    success: {
      50: "#EAFAEE",
      100: "#C5F1D0",
      200: "#A0E8B1",
      300: "#7BE093",
      400: "#56D774",
      500: "#31CE56",
      600: "#27A545",
      700: "#1D7C33",
      800: "#145222",
      900: "#0A2911",
    },
    warning: {
      50: "#FFF6E6",
      100: "#FEE7B9",
      200: "#FDD78B",
      300: "#FDC85E",
      400: "#FCB831",
      500: "#FCA903",
      600: "#C98703",
      700: "#976502",
      800: "#654301",
      900: "#322201",
    },
    danger: {
      50: "#FBE9EA",
      100: "#F4C2C3",
      200: "#EE9B9D",
      300: "#E77477",
      400: "#E04D51",
      500: "#D9262A",
      600: "#AE1E22",
      700: "#821719",
      800: "#570F11",
      900: "#2B0808",
    },

    google: {
      50: "#FDEAE8",
      100: "#F8C3BE",
      200: "#F49C95",
      300: "#F0756B",
      400: "#EB4F42",
      500: "#E72818",
      600: "#B92013",
      700: "#8B180E",
      800: "#5C100A",
      900: "#2E0805",
    },

    gray: {
      50: "#F1F2F4",
      100: "#D7DBDF",
      200: "#BEC4CB",
      300: "#A5ADB6",
      400: "#8B96A2",
      500: "#727F8D",
      600: "#5B6671",
      700: "#444C55",
      800: "#2D3339",
      900: "#17191C",
    },

    dark: "#141414",
    light: "#F0F0F0",
  },
});

export default theme;
